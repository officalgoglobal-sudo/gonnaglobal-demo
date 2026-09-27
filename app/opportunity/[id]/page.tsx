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
  
        setOpportunity({
          id: snapshot.id,
          ...snapshot.data(),
        })
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

        <h1 className="text-2xl sm:text-3xl font-semibold">
          Opportunity not found
        </h1>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] pb-24 text-[#2B1D16] lg:pl-24 lg:pb-0">

    <Sidebar />

      {/* HERO */}

      <section className="border-b border-[#E7DDD1] bg-gradient-to-b from-[#FFFDF9] to-[#F8F5F0] ">

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
      {opportunity.posterUrl && (

<div className="overflow-hidden rounded-[32px] border border-[#E7DDD1] bg-white">

<img
  src={opportunity.posterUrl}
  alt={opportunity.title}
  className="h-auto max-h-[700px] w-full object-contain"
/>

</div>

)}
<div>

          <p className="text-sm uppercase tracking-[0.25em] text-[#8B7355]">
            {opportunity.organization}
          </p>

          <h1 className="mt-4 max-w-4xl text-2xl sm:text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl xl:text-5xl">

            {opportunity.title}

          </h1>

          <p className="mt-6 max-w-3xl text-[17px] leading-8 text-[#6B5B52] sm:text-[18px]">

  {opportunity.description}

</p>

           

          {/* TAGS */}

          <div className="mt-8 flex flex-wrap gap-3">

            <Badge>
              {opportunity.type}
            </Badge>

            <Badge>
              {opportunity.location}
            </Badge>

            <Badge>
              {opportunity.mode}
            </Badge>
            <Badge>
  {opportunity.careerDomain}
</Badge>

<Badge>
  {opportunity.funding}
</Badge>

          </div>

          {/* META */}

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#8B7355]">

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

              Deadline: {opportunity.deadline}

            </div>

            </div>

<div className="mt-10 flex flex-wrap gap-4">

  <div className="rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white">

    {opportunity.funding || "Global Opportunity"}

  </div>

  <div className="rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3 text-sm font-medium">

    {opportunity.deadlineType || "Open"}

  </div>

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

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-16">

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-10">

          {/* LEFT */}

          <div className="space-y-8">

            {/* ABOUT */}

            <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] shadow-sm p-6 sm:p-8 lg:p-10">

              <h2 className="text-2xl sm:text-3xl font-semibold">
              ✨ About this opportunity
              </h2>

              <p className="mt-6 leading-8 text-[#6B5B52]">

  {opportunity.description}

   </p>

            </div>

            {/* ELIGIBILITY */}

            {opportunity.eligibility && (

<div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 sm:p-8 lg:p-10">

              <h2 className="text-2xl sm:text-3xl font-semibold">
              🎯 Eligibility
              </h2>

              <p className="mt-6 whitespace-pre-line leading-8 text-[#6B5B52]">

  {opportunity.eligibility}

   </p>

            </div>
            )}

            {/* RESPONSIBILITIES */}

{opportunity.responsibilities && (

<div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] shadow-sm p-6 sm:p-8 lg:p-10">

              <h2 className="text-2xl sm:text-3xl font-semibold">
              🛠 Responsibilities
              </h2>

              <p className="mt-6 whitespace-pre-line leading-8 text-[#6B5B52]">

  {opportunity.responsibilities}

   </p>

            </div>
)}
          

          {opportunity.benefits && (

<div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] shadow-sm p-6 sm:p-8 lg:p-10">

  <h2 className="text-2xl sm:text-3xl font-semibold">
  🎁 Benefits
  </h2>

  <p className="mt-6 whitespace-pre-line leading-8 text-[#6B5B52]">

  {opportunity.benefits}

</p>



</div>
)}
</div>
          {/* RIGHT SIDEBAR */}

          <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm lg:sticky lg:top-28 lg:h-fit lg:rounded-[32px] lg:p-8">

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

            <div className="mt-10 space-y-7">

            <div className="rounded-2xl bg-[#F8F5F0] p-5">

<p className="text-sm text-[#8B7355]">
  Opportunity Type
</p>

<h3 className="mt-2 text-lg font-semibold">
  {opportunity.type}
</h3>

</div>

              <div>

                <p className="text-sm text-[#8B7355]">
                  Location
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  {opportunity.location}
                </h3>

              </div>

              <div>

                <p className="text-sm text-[#8B7355]">
                  Mode
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  {opportunity.mode}
                </h3>

              </div>

              <div>

                <p className="text-sm text-[#8B7355]">
                  Deadline
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  {opportunity.deadline}
                </h3>

              </div>
              <div>

  <p className="text-sm text-[#8B7355]">
    Career Domain
  </p>

  <h3 className="mt-2 text-lg font-semibold">
    {opportunity.careerDomain}
  </h3>

</div>

            </div>

            <div className="mt-10 rounded-2xl border bg-[#F8F5F0] border-[#E7DDD1]  p-5">

  <p className="text-sm text-[#8B7355]">
    Applications
  </p>

  <h3 className="mt-2 text-2xl font-bold">
  {applicationsCount}
  </h3>

  <p className="mt-1 text-sm text-[#8B7355]">
  {applicationsCount === 1
  ? "Candidate already applied"
  : "Candidates already applied"}
  </p>

</div>

            {/* BUTTONS */}

            <div className="mt-12 space-y-4">

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

        </div>

      </section>

    </main>
  )
}