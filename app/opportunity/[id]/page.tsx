"use client"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import Sidebar from "@/components/home/Sidebar"
import Image from "next/image"
import {
  MapPin,
  CalendarDays,
  Globe,
  Bookmark,
  ArrowUpRight,
  Share2,
} from "lucide-react"

import { useEffect, useState } from "react"

import {
  useParams,
  useRouter,
} from "next/navigation"

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"

export default function OpportunityPage() {

  const params = useParams()
  const router = useRouter()

  const [opportunity, setOpportunity] =
    useState<any>(null)
    const [saved, setSaved] =
  useState(false)
  const [applied, setApplied] =
  useState(false)
  const [applicationsCount, setApplicationsCount] =
  useState(0)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState<number | null>(null)
  
  useEffect(() => {
  
    const fetchOpportunity = async () => {
  
      const docRef = doc(
        db,
        "opportunities",
        params.id as string
      )
  
      const snapshot =
        await getDoc(docRef)
  
      if (snapshot.exists()) {
  
        const opportunityData = snapshot.data()

        setOpportunity({
          id: snapshot.id,
          ...opportunityData,
        })

        const currentUser = auth.currentUser
        if (currentUser) {
          try {
            await setDoc(
              doc(db, "recentlyViewedOpportunities", `${currentUser.uid}_${snapshot.id}`),
              {
                userId: currentUser.uid,
                opportunityId: snapshot.id,
                title: opportunityData.title || opportunityData.name || "Opportunity",
                organization: opportunityData.organization || opportunityData.company || opportunityData.university || "Opportunity",
                viewedAt: serverTimestamp(),
              }
            )
          } catch (error) {
            console.error("Could not record opportunity view:", error)
          }
        }

        const savedRef = doc(
          db,
          "savedOpportunities",
          `${auth.currentUser?.uid}_${snapshot.id}`
        )
        
        const savedSnapshot =
          await getDoc(savedRef)
        
        setSaved(savedSnapshot.exists())
        const appliedRef = doc(
          db,
          "applications",
          `${auth.currentUser?.uid}_${snapshot.id}`
        )
        
        const appliedSnapshot =
          await getDoc(appliedRef)
        
        setApplied(appliedSnapshot.exists())
        const applicationsQuery = query(
          collection(db, "applications"),
          where(
            "opportunityId",
            "==",
            snapshot.id
          )
        )
        
        const applicationsSnapshot =
          await getDocs(applicationsQuery)
        
        setApplicationsCount(
          applicationsSnapshot.size
        )
  
      }
  
    }
  
    fetchOpportunity()
  
  }, [params.id])
  const handleSave = async () => {

    if (!opportunity)
      return
  
    // User is not logged in
    if (!auth.currentUser) {
  
      router.push(
        `/login?redirect=/opportunity/${opportunity.id}`
      )
  
      return
    }
  
    try {
  
      const saveRef = doc(
        db,
        "savedOpportunities",
        `${auth.currentUser.uid}_${opportunity.id}`
      )
  
      if (saved) {
  
        await deleteDoc(saveRef)
  
        setSaved(false)
  
      } else {
  
        await setDoc(saveRef, {
  
          userId:
            auth.currentUser.uid,
  
          opportunityId:
            opportunity.id,
  
          savedAt:
            serverTimestamp(),
  
        })
  
        setSaved(true)
  
      }
  
    } catch (error) {
  
      console.error(error)
  
    }
  
  }
  const handleShare = async () => {

    if (!opportunity) return
  
    const url =
      `${window.location.origin}/opportunity/${opportunity.id}`
  
    try {
  
      if (navigator.share) {

        await navigator.share({
          url,
        })
      
      } else {
      
        await navigator.clipboard.writeText(url)
      
        alert("Opportunity link copied!")
      
      }
  
    } catch (error: any) {
  
      if (
        error?.name === "AbortError"
      ) {
        return
      }
  
      console.error(error)
  
    }
  
  }

  const calculateProfileCompletion = (data: any) => {
    const hasText = (value: any) =>
      typeof value === "string" && value.trim().length > 0

    const basicComplete = [
      data.fullName || data.displayName,
      data.email,
      data.phone || data.phoneNumber,
      data.homeCountry || data.country,
      data.city,
    ].every(hasText)

    const professionalComplete = [
      data.professionalTitle,
      data.headline,
      data.currentRole,
      data.company,
    ].some(hasText)

    const areasComplete =
      Array.isArray(data.mentorshipAreas) && data.mentorshipAreas.length >= 4

    const languagesComplete =
      Array.isArray(data.languages) && data.languages.length >= 2

    const experienceComplete =
      Array.isArray(data.experiences) && data.experiences.length > 0 ||
      Array.isArray(data.experience) && data.experience.length > 0

    const websiteComplete =
      hasText(data.website) || hasText(data.portfolio)

    const sections = [
      basicComplete,
      professionalComplete,
      areasComplete,
      languagesComplete,
      experienceComplete,
      websiteComplete,
    ]

    return Math.round(
      (sections.filter(Boolean).length / sections.length) * 100
    )
  }

  const checkProfileCompletion = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) return false

    const profileSnap = await getDoc(doc(db, "users", currentUser.uid))
    const pct = profileSnap.exists()
      ? calculateProfileCompletion(profileSnap.data())
      : 0

    setProfileCompletion(pct)

    if (pct < 75) {
      setShowProfilePopup(true)
      return false
    }
    return true
  }

  const handleApply = async () => {

    if (!opportunity)
      return
  
    // User is not logged in
    if (!auth.currentUser) {
  
      router.push(
        `/login?redirect=/opportunity/${opportunity.id}`
      )
  
      return
    }
  
    if (!(await checkProfileCompletion())) return

    try {
  
      const applicationRef = doc(
        db,
        "applications",
        `${auth.currentUser.uid}_${opportunity.id}`
      )
  
      // Prevent duplicate applications
      const existingApplication =
        await getDoc(applicationRef)
  
      if (existingApplication.exists()) {
  
        setApplied(true)
  
        return
      }
  
      await setDoc(applicationRef, {
  
        userId:
          auth.currentUser.uid,
  
        opportunityId:
          opportunity.id,
  
        recruiterId:
          opportunity.createdBy,
  
        appliedAt:
          serverTimestamp(),
  
      })
  
      setApplied(true)
  
      setApplicationsCount(
        (prev) => prev + 1
      )
  
    } catch (error) {
  
      console.error(error)
  
    }
  
  }
  const handleExternalApply = async () => {

    if (!opportunity)
      return
  
    // If user is not logged in,
    // send them to login and remember this opportunity.
    if (!auth.currentUser) {
  
      router.push(
        `/login?redirect=/opportunity/${opportunity.id}`
      )
  
      return
    }
  
    if (!(await checkProfileCompletion())) return

    try {
  
      const applicationRef = doc(
        db,
        "applications",
        `${auth.currentUser.uid}_${opportunity.id}`
      )
  
      const existingApplication =
        await getDoc(applicationRef)
  
      if (!existingApplication.exists()) {
  
        await setDoc(applicationRef, {
  
          userId:
            auth.currentUser.uid,
  
          opportunityId:
            opportunity.id,
  
          recruiterId:
            opportunity.createdBy,
  
          appliedAt:
            serverTimestamp(),
  
          external: true,
  
        })
  
        setApplicationsCount(
          (prev) => prev + 1
        )
  
        setApplied(true)
  
      }
  
      window.open(
        opportunity.applicationLink,
        "_blank"
      )
  
    } catch (error) {
  
      console.error(error)
  
    }
  
  }

  if (!opportunity) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">

        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Opportunity not found
        </h1>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] pb-24 text-[#2B1D16] lg:pl-24 lg:pb-0">

    <Sidebar />

      {/* HERO */}

      <section className="border-b border-[#E7DDD1] bg-[#F8F5F0] ">

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
      {opportunity.posterUrl && (

<div className="overflow-hidden rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-2 shadow-sm sm:rounded-[32px] sm:p-3">

<img
  src={opportunity.posterUrl}
  alt={opportunity.title}
  className="max-h-[520px] w-full object-contain transition duration-300 sm:max-h-[600px]"
/>

</div>

)}
<div>

          <p className="text-sm uppercase tracking-[0.25em] text-[#8B7355]">
            {opportunity.organization}
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl">

            {opportunity.title}

          </h1>

          {opportunity.description && (
            <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-[#6B5B52] sm:text-lg sm:leading-8">
              {opportunity.description.length > 240
                ? `${opportunity.description.slice(0, 240).trim()}…`
                : opportunity.description}
            </p>
          )}

           

          {/* TAGS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["Type", opportunity.type],
              ["Location", opportunity.location],
              ["Mode", opportunity.mode],
              ["Domain", opportunity.careerDomain],
              ["Funding", opportunity.funding],
              ["Experience", opportunity.experienceLevel],
            ].filter(([, value]) => value != null && String(value).trim() !== "").map(([label, value]) => (
              <span key={label} className="inline-flex items-center rounded-full border border-[#E7DDD1] bg-[#FFFDF9] px-3.5 py-2 text-xs font-medium text-[#6B5B52] sm:text-sm">
                <span className="mr-1.5 text-[#8B7355]">{label}:</span> {value}
              </span>
            ))}
          </div>

          {/* META */}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#8B7355]">

            <div className="flex items-center gap-2">

              <MapPin className="h-4 w-4" />

              {opportunity.location}

            </div>

            <div className="flex items-center gap-2">

              <Globe className="h-4 w-4" />

              {opportunity.mode}

            </div>

            <div className="flex items-center gap-2">

              <CalendarDays className="h-4 w-4" />

              {opportunity.deadlineType === "No Deadline" ? "No deadline" : opportunity.deadlineType === "Rolling" ? "Rolling applications" : opportunity.deadline ? `Deadline: ${opportunity.deadline}` : ""}

            </div>

            </div>

<div className="mt-7 flex flex-wrap gap-3">

  {opportunity.funding && (
    <div className="rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white">
      {opportunity.funding}
    </div>
  )}

  {opportunity.deadlineType && (
    <div className="rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3 text-sm font-medium text-[#2B1D16]">
      {opportunity.deadlineType}
    </div>
  )}

  {opportunity.applicationLink && (

<button
  onClick={handleExternalApply}
  className="rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3 text-sm font-medium transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
>

  External Application

</button>

)}

</div>

</div> {/* right side content */}

</div> {/* grid */}

</div> {/* max-w-7xl container */}

</section>

      {/* MAIN CONTENT */}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">

          {/* LEFT */}

          <div className="space-y-5 sm:space-y-6">

            {/* ABOUT */}

            <div className="rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-[0_2px_8px_rgba(43,29,22,0.04)] sm:p-8 lg:rounded-[28px]">

              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              ✨ About this opportunity
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B5B52] sm:text-base sm:leading-8">

  {opportunity.description}

   </p>

            </div>

            {/* ELIGIBILITY */}

            {opportunity.eligibility && (

<div className="rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-[0_2px_8px_rgba(43,29,22,0.04)] sm:p-8 lg:rounded-[28px]">

              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              🎯 Eligibility
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B5B52] sm:text-base sm:leading-8">

  {opportunity.eligibility}

   </p>

            </div>
            )}

            {/* RESPONSIBILITIES */}

{opportunity.responsibilities && (

<div className="rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-[0_2px_8px_rgba(43,29,22,0.04)] sm:p-8 lg:rounded-[28px]">

              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              🛠 Responsibilities
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B5B52] sm:text-base sm:leading-8">

  {opportunity.responsibilities}

   </p>

            </div>
)}
          

          {opportunity.benefits && (

<div className="rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-[0_2px_8px_rgba(43,29,22,0.04)] sm:p-8 lg:rounded-[28px]">

  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
  🎁 Benefits
  </h2>

  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B5B52] sm:text-base sm:leading-8">

  {opportunity.benefits}

</p>



</div>
)}
</div>
          {/* RIGHT SIDEBAR */}

          <div className="rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-5 shadow-[0_8px_30px_rgba(43,29,22,0.05)] sm:p-6 lg:sticky lg:top-6 lg:h-fit lg:rounded-[28px]">

            {/* TOP */}

            <div className="flex items-start justify-between">

<div>

  <p className="text-sm text-[#8B7355]">
    Opportunity Overview
  </p>

  <h2 className="mt-2 text-2xl font-semibold">
    {opportunity.organization}
  </h2>

</div>

<div className="flex gap-2">

  <button
    onClick={handleShare}
    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7DDD1] transition hover:bg-[#2563EB] hover:text-white"
  >
    <Share2 className="h-5 w-5" />
  </button>

  <button
    onClick={handleSave}
    className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
      saved
        ? "border-[#2563EB] bg-[#2563EB] text-white"
        : "border-[#E7DDD1] hover:bg-[#2563EB] hover:text-white"
    }`}
  >
    <Bookmark className="h-5 w-5" />
  </button>

</div>

</div>

            {/* DETAILS */}
            <div className="mt-7 space-y-5">
              {[
                ["Opportunity Type", opportunity.type],
                ["Location", opportunity.location],
                ["Mode", opportunity.mode],
                ["Deadline", opportunity.deadlineType === "No Deadline" ? "No deadline" : opportunity.deadline],
                ["Career Domain", opportunity.careerDomain],
                ["Experience Level", opportunity.experienceLevel],
                ["Eligible Region", opportunity.locationRegion],
                ["Deadline Policy", opportunity.deadlineType],
                ["Funding / Stipend", opportunity.funding],
              ].filter(([, value]) => value != null && String(value).trim() !== "").map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-[#8B7355]">{label}</p>
                  <h3 className="mt-2 break-words text-base font-semibold text-[#2B1D16]">
                    {value}
                  </h3>
                </div>
              ))}
            </div>

            {applicationsCount >= 0 && (
              <div className="mt-7 rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] p-5">
                <p className="text-sm text-[#8B7355]">Applications</p>
                <h3 className="mt-2 text-2xl font-bold">{applicationsCount}</h3>
                <p className="mt-1 text-sm text-[#8B7355]">
                  {applicationsCount === 1 ? "Candidate applied" : "Candidates applied"}
                </p>
              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-7 space-y-3">

            {opportunity.applicationLink ? (

<button
  onClick={handleExternalApply}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3.5 sm:px-6 sm:py-4 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
>

  {applied
    ? "Applied Externally"
    : "Apply Externally"}

  <ArrowUpRight className="h-4 w-4" />

</button>

) : (

<button
  onClick={handleApply}
  disabled={applied}
  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4 text-sm font-medium transition ${
    applied
      ? "bg-[#D8C7B8] text-[#6B5B52]"
      : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
  }`}
>

  {applied
    ? "Applied"
    : "Apply Now"}

  <ArrowUpRight className="h-4 w-4" />

</button>

)}

              <button
  onClick={handleSave}

  className={`w-full rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4 text-sm font-medium transition ${
   saved
? "border-[#2563EB] bg-[#2563EB] text-white"
      : "border border-[#E7DDD1] bg-[#FFFDF9] hover:bg-[#EFE7DC]"
  }`}
>

  {saved
    ? "Saved"
    : "Save Opportunity"}

</button>

            </div>

          </div>

        
      {showProfilePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-gate-title"
            className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-3xl border border-blue-100 bg-[#FFFDF9] p-6 shadow-2xl duration-200 sm:p-8"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              💙
            </div>

            <h2 id="profile-gate-title" className="text-center text-2xl font-bold tracking-tight text-slate-900">
              Your profile needs a little love ✨
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              Recruiters want to get to know you! Add a little more about yourself before applying.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Profile completion</span>
                <span className="font-bold text-blue-600">{profileCompletion ?? 0}%</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuenow={profileCompletion ?? 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500"
                  style={{ width: `${profileCompletion ?? 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                You need at least 75% to start applying.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowProfilePopup(false)
                router.push("/profile")
              }}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Complete My Profile ✨
            </button>

            <button
              type="button"
              onClick={() => setShowProfilePopup(false)}
              className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
</div>

      </section>

    </main>
  )
}