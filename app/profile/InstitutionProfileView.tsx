"use client"

import InstitutionOpportunitiesManager from "./InstitutionOpportunitiesManager"
import InstitutionApplications from "./InstitutionApplications"
import InstitutionCoursesManager from "./InstitutionCoursesManager"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signOut } from "firebase/auth"
import {
  orderBy,
  limit,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  MapPin, Mail, Link2, Camera, Share2, ChevronDown,
  Pencil, Download, ExternalLink, Plus, CheckCircle2,
  Circle, FileText, Bookmark, CalendarDays, Users,
  ArrowRight
} from "lucide-react"

// ── Institution Profile Sub-Component
export default function InstitutionProfileView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Overview")


  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showBrochureModal, setShowBrochureModal] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState("")
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications !== false)
  const [applicationUpdates, setApplicationUpdates] = useState(user?.applicationUpdates !== false)
  const [publicProfile, setPublicProfile] = useState(user?.publicProfile !== false)

  async function saveInstitutionSettings() {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) {
      setSettingsMessage("Please sign in again before saving.")
      return
    }

    setSettingsSaving(true)
    setSettingsMessage("")
    try {
      await updateDoc(doc(db, "users", uid), {
        emailNotifications,
        applicationUpdates,
        publicProfile,
      })
      setSettingsMessage("Settings saved successfully.")
    } catch (error) {
      console.error("Unable to save institution settings:", error)
      setSettingsMessage("Could not save settings. Please try again.")
    } finally {
      setSettingsSaving(false)
    }
  }

  async function handleInstitutionLogout() {
    try {
      await signOut(auth)
      setConfirmLogout(false)
      router.push("/login")
    } catch (error) {
      console.error("Unable to sign out:", error)
      setSettingsMessage("Could not log out. Please try again.")
    }
  }


  const router = useRouter()
  const searchParams = useSearchParams()
  const [activityItems, setActivityItems] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)
  useEffect(() => {
    if (searchParams.get("completeProfile") === "1") {
      setActiveTab("Details")
      setIsEditingProfile(true)
    }
  }, [searchParams])


  useEffect(() => {
    const uid = user?.uid || auth.currentUser?.uid
    if (uid) void loadActivity(uid)
  }, [user?.uid])

  async function loadActivity(uid: string) {
    setActivityLoading(true)
    try {
      const [applicationsSnap, savedSnap, viewedSnap] = await Promise.all([
        getDocs(query(collection(db, "applications"), where("userId", "==", uid))),
        getDocs(query(collection(db, "savedOpportunities"), where("userId", "==", uid))),
        getDocs(query(
          collection(db, "recentlyViewedOpportunities"),
          where("userId", "==", uid),
          orderBy("viewedAt", "desc"),
          limit(10)
        )),
      ])

      const rows: any[] = []
      const opportunityCache = new Map<string, any>()

      const getOpportunity = async (id: string) => {
        if (!id) return {}
        if (opportunityCache.has(id)) return opportunityCache.get(id)
        const snapshot = await getDoc(doc(db, "opportunities", id))
        const data = snapshot.exists() ? snapshot.data() : {}
        opportunityCache.set(id, data)
        return data
      }

      await Promise.all([
        ...applicationsSnap.docs.map(async item => {
          const data = item.data()
          const opportunity = await getOpportunity(data.opportunityId || "")
          rows.push({
            id: "application-" + item.id,
            title: "Applied for " + (opportunity.title || opportunity.name || "an opportunity"),
            sub: opportunity.organization || opportunity.company || opportunity.university || "Opportunity",
            date: data.createdAt?.toDate?.() || data.appliedAt?.toDate?.() || data.updatedAt?.toDate?.() || null,
            icon: FileText,
            color: "#DBEAFE",
            iconColor: "#2563EB",
          })
        }),
        ...savedSnap.docs.map(async item => {
          const data = item.data()
          const opportunityId = data.opportunityId ||
            (item.id.startsWith(uid + "_") ? item.id.slice(uid.length + 1) : "")
          const opportunity = await getOpportunity(opportunityId)
          rows.push({
            id: "saved-" + item.id,
            title: "Saved an opportunity",
            sub: opportunity.title || opportunity.name || "Opportunity",
            date: data.createdAt?.toDate?.() || data.savedAt?.toDate?.() || null,
            icon: Bookmark,
            color: "#D1FAE5",
            iconColor: "#059669",
          })
        }),
      ])

      viewedSnap.docs.forEach(item => {
        const viewed = item.data()
        rows.push({
          id: "viewed-" + item.id,
          title: "Viewed an opportunity",
          sub: viewed.title || "Opportunity",
          date: viewed.viewedAt?.toDate?.() || null,
          icon: FileText,
          color: "#EDE9FE",
          iconColor: "#7C3AED",
        })
      })

      rows.sort((a, b) =>
        (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0)
      )
      setActivityItems(rows)
    } catch (error) {
      console.error("Could not load recent activity:", error)
      setActivityItems([])
    } finally {
      setActivityLoading(false)
    }
  }


  const [detailsDraft, setDetailsDraft] = useState({
    institutionName: "",
    institutionType: "",
    aboutInstitution: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    established: "",
    accreditation: "",
    studentStrength: "",
    country: "",
    catalogUrl: "",
    tagline: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    xUrl: "",
    youtube: "",
  })
  const [savingDetails, setSavingDetails] = useState(false)
  const [detailsSaveMessage, setDetailsSaveMessage] = useState("")


  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutDescription, setAboutDescription] = useState("")
  const [aboutDraft, setAboutDraft] = useState("")
  const [isSavingAbout, setIsSavingAbout] = useState(false)

  const [isEditingKeyInfo, setIsEditingKeyInfo] = useState(false)
  const [isSavingKeyInfo, setIsSavingKeyInfo] = useState(false)
  const [keyInfo, setKeyInfo] = useState({
    type: "",
    established: "",
    website: "",
    address: "",
    accreditation: "",
    studentStrength: "",
  })
  const [keyInfoDraft, setKeyInfoDraft] = useState(keyInfo)
  const [saveError, setSaveError] = useState("")
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [locationDraft, setLocationDraft] = useState("")
  const [isSavingLocation, setIsSavingLocation] = useState(false)


  const [programsOffered, setProgramsOffered] = useState<string[]>([])

  const institutionProfileCompletion = (() => {
    const has = (...values: unknown[]) =>
      values.some(value =>
        typeof value === "string"
          ? value.trim().length > 0
          : Array.isArray(value) && value.length > 0
      )
    const items = [
      [
        detailsDraft.institutionName || user?.institutionName || user?.organizationName,
        detailsDraft.institutionType || user?.institutionType,
        detailsDraft.email || user?.email,
        detailsDraft.phone || user?.phone,
        detailsDraft.country || user?.country,
      ].every(value => String(value ?? "").trim().length > 0),
      [user?.aboutInstitution || user?.bio, user?.website, user?.address || user?.location, user?.established, user?.studentStrength, user?.tagline, user?.linkedin || user?.linkedinUrl].every(value => has(value)),
      Array.isArray(user?.programsOffered) && user.programsOffered.length > 0,
      has(user?.address, user?.location) && has(user?.website),
      has(user?.linkedin, user?.linkedinUrl) || has(user?.instagram, user?.instagramUrl) || has(user?.facebook, user?.facebookUrl) || has(user?.xUrl, user?.twitter) || has(user?.youtube, user?.youtubeUrl),
      has(user?.catalogUrl, user?.brochureUrl),
    ]
    return Math.round((items.filter(Boolean).length / items.length) * 100)
  })()

  const [programToAdd, setProgramToAdd] = useState("")
  const [customProgram, setCustomProgram] = useState("")
  const [isSavingPrograms, setIsSavingPrograms] = useState(false)

  const availableInstitutionPrograms = [
    "B.Tech Computer Science and Engineering",
    "B.Tech Information Technology",
    "B.Tech Artificial Intelligence and Machine Learning",
    "B.Tech Data Science",
    "B.Tech Cyber Security",
    "B.Tech Electronics and Communication Engineering",
    "B.Tech Electrical Engineering",
    "B.Tech Mechanical Engineering",
    "B.Tech Civil Engineering",
    "B.Tech Biotechnology",
    "B.Tech Chemical Engineering",
    "B.Tech Mechatronics",
    "BCA",
    "MCA",
    "B.Sc Computer Science",
    "B.Sc Data Science",
    "B.Sc Mathematics",
    "B.Sc Physics",
    "B.Sc Chemistry",
    "B.Sc Biotechnology",
    "B.Com",
    "B.Com (Honours)",
    "BBA",
    "MBA",
    "BA",
    "BA Economics",
    "BA Psychology",
    "MA",
    "M.Sc Computer Science",
    "M.Sc Data Science",
    "M.Tech Computer Science and Engineering",
    "M.Tech Artificial Intelligence",
    "M.Tech Data Science",
    "M.Tech Cyber Security",
    "Ph.D. Computer Science",
    "Ph.D. Engineering",
    "Ph.D. Management",
    "LLB",
    "LLM",
    "MBBS",
    "BDS",
    "B.Pharm",
    "D.Pharm",
    "B.Arch",
    "M.Arch",
    "B.Des",
    "M.Des",
    "BHM",
    "Bachelor of Education (B.Ed.)",
    "Master of Education (M.Ed.)",
    "Diploma Programs",
    "Certificate Programs",
    "Executive Education",
  ]

  const addInstitutionProgram = (name: string) => {
    const cleanName = name.trim()
    if (!cleanName) return

    setProgramsOffered(previous =>
      previous.some(p => p.toLowerCase() === cleanName.toLowerCase())
        ? previous
        : [...previous, cleanName]
    )
  }

  const saveInstitutionLocation = async () => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) {
      setSaveError("Please sign in again before saving.")
      return
    }

    const cleanAddress = locationDraft.trim()
    if (!cleanAddress) {
      setSaveError("Enter an institution address before saving.")
      return
    }

    setIsSavingLocation(true)
    setSaveError("")
    try {
      await updateDoc(doc(db, "users", uid), { address: cleanAddress })
      setKeyInfo(previous => ({ ...previous, address: cleanAddress }))
      setLocationDraft(cleanAddress)
      setIsEditingLocation(false)
    } catch (error) {
      console.error("Failed to save institution location:", error)
      setSaveError("Could not save the location. Please try again.")
    } finally {
      setIsSavingLocation(false)
    }
  }

  const saveInstitutionPrograms = async () => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) {
      setSaveError("Please sign in again before saving.")
      return
    }

    setIsSavingPrograms(true)
    setSaveError("")
    try {
      await updateDoc(doc(db, "users", uid), {
        programsOffered: programsOffered,
      })
    } catch (error) {
      console.error("Failed to save institution programs:", error)
      setSaveError("Could not save programs. Please try again.")
    } finally {
      setIsSavingPrograms(false)
    }
  }

  useEffect(() => {
    const about =
      user?.aboutInstitution ?? user?.about ?? user?.description ?? ""
    setAboutDescription(about)
    setAboutDraft(about)

    setProgramsOffered(
      Array.isArray(user?.programsOffered)
        ? user.programsOffered.filter(
            (program: unknown): program is string =>
              typeof program === "string" && program.trim().length > 0
          )
        : []
    )

    const details = {
      type: user?.institutionType ?? "",
      established: String(user?.established ?? ""),
      website: user?.website ?? "",
      address: user?.address ?? user?.location ?? "",
      accreditation: user?.accreditation ?? "",
      studentStrength: String(user?.studentStrength ?? ""),
    }
    setKeyInfo(details)
    setKeyInfoDraft(details)
    setLocationDraft(String(user?.address ?? user?.location ?? ""))
  }, [user])



  useEffect(() => {
    setDetailsDraft({
      institutionName: String(user?.institutionName ?? user?.organizationName ?? ""),
      institutionType: String(user?.institutionType ?? ""),
      aboutInstitution: String(user?.aboutInstitution ?? user?.bio ?? ""),
      email: String(user?.email ?? ""),
      phone: String(user?.phone ?? ""),
      website: String(user?.website ?? ""),
      address: String(user?.address ?? user?.location ?? ""),
      established: String(user?.established ?? ""),
      accreditation: String(user?.accreditation ?? ""),
      studentStrength: String(user?.studentStrength ?? ""),
      country: String(user?.country ?? ""),
      catalogUrl: String(user?.catalogUrl ?? ""),
      tagline: String(user?.tagline ?? ""),
      linkedin: String(user?.linkedin ?? user?.linkedinUrl ?? ""),
      instagram: String(user?.instagram ?? user?.instagramUrl ?? ""),
      facebook: String(user?.facebook ?? user?.facebookUrl ?? ""),
      xUrl: String(user?.xUrl ?? user?.twitter ?? ""),
      youtube: String(user?.youtube ?? user?.youtubeUrl ?? ""),
    })
  }, [user])

  return (
    <div>
      {/* Cover */}
      <div className="relative h-[200px] overflow-hidden bg-gradient-to-r from-green-200 to-teal-300">
        <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1400&q=80" alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute left-10 top-8 text-white">
          <p className="text-[28px] font-bold drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Shaping</p>
          <p className="text-[28px] font-bold drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Global Citizens</p>
        </div>
        <div className="absolute right-16 top-8 text-right text-white drop-shadow">
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Education</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Research</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Impact</p>
        </div>
      </div>

      {/* Info row */}
      <div className="relative bg-white px-6 pb-0 border-b border-[#EBEBEB]">
        <div className="absolute -top-14 left-6">
          <div className="relative h-[108px] w-[108px] rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-[10px] font-bold text-red-600">🔴</div>
                <div className="text-[11px] font-bold text-[#1A1A2E]">MI</div>
                <div className="text-[9px] text-[#687995]">MANIPAL</div>
              </div>
            </div>
            <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
              <Camera className="h-3.5 w-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        <div className="ml-[130px] flex flex-wrap items-start justify-between gap-4 pb-4 pt-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#1A1A2E]">{user?.institutionName || user?.organizationName || user?.fullName || user?.displayName || "Your Institution"}</h1>
            </div>
            {!!String(user?.tagline || "").trim() && (
              <p className="text-[13.5px] text-[#687995]">{String(user.tagline).trim()}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#687995]">
              {!!String(user?.address || user?.location || "").trim() && (
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/>{String(user.address || user.location).trim()}</span>
              )}
              {!!String(user?.website || "").trim() && (
                <a href={/^https?:\/\//i.test(String(user.website).trim()) ? String(user.website).trim() : `https://${String(user.website).trim()}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2563EB]">
                  <ExternalLink className="h-3.5 w-3.5"/>{String(user.website).trim()}
                </a>
              )}
              {!!String(user?.email || "").trim() && (
                <a href={`mailto:${String(user.email).trim()}`} className="flex items-center gap-1 hover:text-[#2563EB]"><Mail className="h-3.5 w-3.5"/>{String(user.email).trim()}</a>
              )}
              {!!String(user?.linkedin || user?.linkedinUrl || "").trim() && (
                <a href={/^https?:\/\//i.test(String(user.linkedin || user.linkedinUrl).trim()) ? String(user.linkedin || user.linkedinUrl).trim() : `https://${String(user.linkedin || user.linkedinUrl).trim()}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2563EB]">
                  <Link2 className="h-3.5 w-3.5"/>{String(user.linkedin || user.linkedinUrl).trim()}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {["Overview", "Details", "Gallery", "Reviews", "Manage Opportunities", "View Applications", "Courses", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-[14px] font-medium transition ${activeTab === tab ? "border-b-2 border-[#2563EB] text-[#2563EB]" : "text-[#687995] hover:text-[#1A1A2E]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {activeTab === "Overview" && (
<div className="grid grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[240px_1fr_280px]">
        {/* Left */}
        <div>
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Profile Completion</h3>
            {(() => {
              const has = (...values: unknown[]) =>
                values.some(value =>
                  typeof value === "string"
                    ? value.trim().length > 0
                    : Array.isArray(value) && value.length > 0
                )

              const items = [
                {
                  label: "Basic Information",
                  done: [
                    detailsDraft.institutionName || user?.institutionName || user?.organizationName,
                    detailsDraft.institutionType || user?.institutionType,
                    detailsDraft.email || user?.email,
                    detailsDraft.phone || user?.phone,
                    detailsDraft.country || user?.country,
                  ].every(value => has(value)),
                },
                {
                  label: "Institution Details",
                  done: [
                    user?.aboutInstitution || user?.bio,
                    user?.website,
                    user?.address || user?.location,
                    user?.established,
                    user?.studentStrength,
                    user?.tagline,
                    user?.linkedin || user?.linkedinUrl,
                  ].every(value => has(value)),
                },
                {
                  label: `Programs Offered (${programsOffered.length})`,
                  done: programsOffered.length > 0,
                },
                {
                  label: "Location & Website",
                  done: has(user?.address, user?.location) && has(user?.website),
                },
                {
                  label: "Social Links",
                  done: has(user?.linkedin, user?.linkedinUrl) ||
                    has(user?.instagram, user?.instagramUrl) ||
                    has(user?.facebook, user?.facebookUrl) ||
                    has(user?.xUrl, user?.twitter) ||
                    has(user?.youtube, user?.youtubeUrl),
                },
                {
                  label: "Add Brochure / Media",
                  done: has(user?.catalogUrl, user?.brochureUrl),
                },
              ]

              const completed = items.filter(item => item.done).length
              const percent = Math.round((completed / items.length) * 100)

              return (
                <>
                  <div className="my-5 flex justify-center">
                    <div className="relative h-[110px] w-[110px]">
                      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                        <circle cx="55" cy="55" r="48" fill="none" stroke="#F0F0F0" strokeWidth="10" />
                        <circle
                          cx="55" cy="55" r="48" fill="none" stroke="#2563EB" strokeWidth="10"
                          strokeDasharray={`${(percent / 100) * 301.6} 301.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[22px] font-bold text-[#1A1A2E]">{percent}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-center text-[12px] text-[#687995]">
                    {completed}/{items.length} sections completed
                  </p>
                  <div className="space-y-2.5">
                    {items.map(item => (
                      <div key={item.label} className="flex items-center gap-2 text-[13px]">
                        {item.done
                          ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2563EB]" />
                          : <Circle className="h-4 w-4 shrink-0 text-[#D0D0D0]" />}
                        <span className={item.done ? "text-[#1A1A2E]" : "text-[#ABABAB]"}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Complete Your Profile <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )
            })()}
          </div>
        </div>

        {/* Middle */}
        <div className="space-y-5">
          {isEditingProfile && (
            <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <span className="text-sm font-medium text-blue-800">Edit Profile mode is on</span>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false)
                  setIsEditingAbout(false)
                  setIsEditingKeyInfo(false)
                  setIsEditingLocation(false)
                }}
                className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white"
              >
                Done Editing
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">About the Institution</h3>
              {isEditingProfile && <button type="button" aria-label="Edit About the Institution" onClick={() => {
                setAboutDraft(aboutDescription)
                setIsEditingAbout(true)
              }}><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>}
            </div>
            {isEditingAbout ? (
              <textarea value={aboutDraft} onChange={e => setAboutDraft(e.target.value)} rows={4}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white p-3 text-[13.5px] leading-[1.7] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            ) : (
              <p className="text-[13.5px] leading-[1.7] text-[#687995]">{aboutDescription}</p>
            )}
            <div className="mt-4">
              {isEditingAbout && <div className="mt-3 flex gap-2">
                <button
                  disabled={isSavingAbout}
                  onClick={async () => {
                    const uid = user?.uid || auth.currentUser?.uid
                    if (!uid) {
                      setSaveError("Please sign in again before saving.")
                      return
                    }
                    setIsSavingAbout(true)
                    setSaveError("")
                    try {
                      await updateDoc(doc(db, "users", uid), {
                        aboutInstitution: aboutDraft,
                      })
                      setAboutDescription(aboutDraft)
                      setIsEditingAbout(false)
                    } catch (error) {
                      console.error("Failed to save institution description:", error)
                      setSaveError("Could not save your changes. Please try again.")
                    } finally {
                      setIsSavingAbout(false)
                    }
                  }}
                  className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isSavingAbout ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setIsEditingAbout(false)}
                  className="rounded-full border border-[#E0E0E0] px-4 py-2 text-xs font-semibold text-[#555]">Cancel</button>
              </div>}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Programs Offered</h3>
              <span className="text-[12px] text-[#687995]">
                {programsOffered.length} selected
              </span>
            </div>

            {isEditingProfile && <div className="space-y-3">
              <label className="block text-[12px] font-medium text-[#687995]">
                Choose a course
                <select
                  value={programToAdd}
                  onChange={e => {
                    const value = e.target.value
                    setProgramToAdd("")
                    if (value) addInstitutionProgram(value)
                  }}
                  className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select a course to add...</option>
                  {availableInstitutionPrograms
                    .filter(program => !programsOffered.some(
                      selected => selected.toLowerCase() === program.toLowerCase()
                    ))
                    .map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                </select>
              </label>

              <form
                className="flex gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  addInstitutionProgram(customProgram)
                  setCustomProgram("")
                }}
              >
                <input
                  value={customProgram}
                  onChange={e => setCustomProgram(e.target.value)}
                  placeholder="Add a custom course..."
                  aria-label="Custom course name"
                  maxLength={120}
                  className="min-w-0 flex-1 rounded-lg border border-[#D1D5DB] px-3 py-2 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  disabled={!customProgram.trim()}
                  className="rounded-lg border border-[#2563EB] px-3 py-2 text-[12px] font-semibold text-[#2563EB] disabled:opacity-40"
                >
                  Add
                </button>
              </form>



              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSavingPrograms}
                  onClick={saveInstitutionPrograms}
                  className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isSavingPrograms ? "Saving..." : "Save Programs"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProgramsOffered(
                      Array.isArray(user?.programsOffered)
                        ? user.programsOffered.filter(
                            (program: unknown): program is string =>
                              typeof program === "string" && program.trim().length > 0
                          )
                        : []
                    )
                    setCustomProgram("")
                    setProgramToAdd("")
                    setSaveError("")
                  }}
                  className="rounded-full border border-[#E0E0E0] px-4 py-2 text-xs font-semibold text-[#555]"
                >
                  Reset
                </button>
              </div>
            </div>}
            {programsOffered.length === 0 ? (
              <p className="rounded-lg bg-[#F7F7F7] p-3 text-[12px] text-[#687995]">
                No programs added yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {programsOffered.map(program => (
                  <span
                    key={program}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1.5 text-[12px] text-[#1A1A2E]"
                  >
                    <span className="break-words">{program}</span>
                    {isEditingProfile && (
                      <button
                        type="button"
                        aria-label={`Remove ${program}`}
                        onClick={() => setProgramsOffered(previous =>
                          previous.filter(item => item !== program)
                        )}
                        className="shrink-0 font-bold text-[#687995] hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Key Information</h3>
              {saveError && (
                <p role="alert" className="mt-3 text-xs text-red-600">
                  {saveError}
                </p>
              )}
              {isEditingProfile && <button type="button" aria-label="Edit Key Information" onClick={() => {
                setKeyInfoDraft(keyInfo)
                setIsEditingKeyInfo(true)
              }}><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>}
            </div>
            {isEditingKeyInfo ? (
              <div className="space-y-3">
                {([
                  ["type", "Type"], ["established", "Established"],
                  ["website", "Website"], ["address", "Address"],
                  ["accreditation", "Accreditation"], ["studentStrength", "Student Strength"],
                ] as const).map(([field, label]) => (
                  <label key={field} className="block text-[12px] text-[#687995]">{label}
                    <input value={keyInfoDraft[field]}
                      onChange={e => setKeyInfoDraft(prev => ({...prev, [field]: e.target.value}))}
                      className="mt-1 w-full rounded-lg border border-[#D1D5DB] p-2.5 text-[13px] text-[#1A1A2E]" />
                  </label>
                ))}
                <div className="flex gap-2">
                  <button
                    disabled={isSavingKeyInfo}
                    onClick={async () => {
                      const uid = user?.uid || auth.currentUser?.uid
                      if (!uid) {
                        setSaveError("Please sign in again before saving.")
                        return
                      }
                      setIsSavingKeyInfo(true)
                      setSaveError("")
                      try {
                        await updateDoc(doc(db, "users", uid), {
                          institutionType: keyInfoDraft.type,
                          established: keyInfoDraft.established,
                          website: keyInfoDraft.website,
                          address: keyInfoDraft.address,
                          accreditation: keyInfoDraft.accreditation,
                          studentStrength: keyInfoDraft.studentStrength,
                        })
                        setKeyInfo(keyInfoDraft)
                        setIsEditingKeyInfo(false)
                      } catch (error) {
                        console.error("Failed to save institution details:", error)
                        setSaveError("Could not save your changes. Please try again.")
                      } finally {
                        setIsSavingKeyInfo(false)
                      }
                    }}
                    className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {isSavingKeyInfo ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => { setKeyInfoDraft(keyInfo); setIsEditingKeyInfo(false) }}
                    className="rounded-full border border-[#E0E0E0] px-4 py-2 text-xs font-semibold text-[#555]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-[13px]">
                {[
                  {label:"Type",value:keyInfo.type},
                  {label:"Established",value:keyInfo.established},
                  {label:"Website",value:keyInfo.website,link:true},
                  {label:"Address",value:keyInfo.address},
                  {label:"Accreditation",value:keyInfo.accreditation},
                  {label:"Student Strength",value:keyInfo.studentStrength},
                ].map(({label,value,link})=>(
                  <div key={label} className="flex items-start gap-2">
                    <span className="w-[140px] shrink-0 text-[#ABABAB]">🏛 {label}</span>
                    {link ? <a href={value.startsWith("http") ? value : `https://${value}`} target="_blank" rel="noreferrer" className="break-all text-[#2563EB] hover:underline">{value}</a> : <span className="text-[#1A1A2E] font-medium">{value}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

<div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Media & Gallery</h3>
              <button
                type="button"
                onClick={() => setActiveTab("Gallery")}
                className="text-[12px] font-semibold text-[#2563EB] hover:underline"
              >
                View All →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("Gallery")}
              className="flex min-h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 py-6 text-center hover:border-[#2563EB]"
            >
              <span className="text-sm font-semibold text-[#1A1A2E]">No gallery items yet</span>
              <span className="mt-1 text-xs text-[#687995]">Institution photos and media will appear here.</span>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-4">Quick Actions</h3>
            {showBrochureModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                onClick={() => setShowBrochureModal(false)}>
                <div role="dialog" aria-modal="true" aria-labelledby="brochure-modal-title"
                  className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                  onClick={e => e.stopPropagation()}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#2563EB]">
                    <ExternalLink className="h-6 w-6" />
                  </div>
                  <h2 id="brochure-modal-title" className="text-lg font-bold text-[#1A1A2E]">
                    Brochure not available
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#687995]">
                    This institution hasn’t added a brochure URL yet. Add it in Institution Details to make the brochure viewable.
                  </p>
                  <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={() => setShowBrochureModal(false)}
                      className="rounded-xl border border-[#E0E0E0] px-4 py-2.5 text-sm font-medium text-[#555]">
                      Close
                    </button>
                    <button type="button" onClick={() => {
                      setShowBrochureModal(false)
                      setActiveTab("Details")
                    }} className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
                      Add Brochure URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {[
                {icon:Pencil,label:"Edit Profile",primary:true},
                {icon:Share2,label:"Share Profile"},
                {icon:ExternalLink,label:"View Public Profile"},
                {icon:ExternalLink,label:"View Brochure"},
                {icon:FileText,label:"Manage Opportunities"},
                {icon:Users,label:"View Applications"},
              ].map(({icon:Icon,label,primary})=>(
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "Edit Profile") {
                      setActiveTab("Overview")
                      setIsEditingProfile(true)
                    } else if (label === "View Public Profile") {
                      const institutionId = user?.uid || auth.currentUser?.uid
                      if (institutionId) {
                        router.push(`/institution/${encodeURIComponent(institutionId)}`)
                      } else {
                        alert("Please log in to view the public institution profile.")
                      }
                    } else if (label === "Share Profile") {
                      const institutionId = user?.uid || auth.currentUser?.uid
                      if (!institutionId) {
                        alert("Please log in to share the institution profile.")
                      } else {
                        const publicUrl = `${window.location.origin}/institution/${encodeURIComponent(institutionId)}`
                        if (navigator.share) {
                          void navigator.share({ title: `${user?.institutionName || user?.organizationName || "Institution"} public profile`, url: publicUrl }).catch(() => {})
                        } else {
                          void navigator.clipboard.writeText(publicUrl).then(
                            () => alert("Public institution profile link copied."),
                            () => alert("Could not copy the profile link.")
                          )
                        }
                      }
                    } else if (label === "Manage Opportunities") {
                      setActiveTab("Manage Opportunities")
                    } else if (label === "View Applications") {
                      setActiveTab("View Applications")
                    } else if (label === "View Brochure") {
                      const brochureUrl = String(
                        detailsDraft.catalogUrl || user?.catalogUrl || user?.institutionDetails?.catalogUrl || ""
                      ).trim()

                      if (!brochureUrl) {
                        setShowBrochureModal(true)
                        return
                      }

                      const safeUrl = /^https?:\/\//i.test(brochureUrl)
                        ? brochureUrl
                        : `https://${brochureUrl}`

                      window.open(safeUrl, "_blank", "noopener,noreferrer")
                    }
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${primary?"bg-[#EEF3FF] text-[#2563EB]":"border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"}`}
                >
                  <Icon className="h-4 w-4"/> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Location & Reach</h3>
              {isEditingProfile && (
                <button
                  type="button"
                  aria-label="Edit institution location"
                  onClick={() => {
                    setLocationDraft(String(keyInfo.address || user?.address || user?.location || ""))
                    setSaveError("")
                    setIsEditingLocation(true)
                  }}
                  className="rounded p-1 hover:bg-[#F7F7F7]"
                >
                  <Pencil className="h-4 w-4 text-[#687995]" />
                </button>
              )}
            </div>

            {isEditingLocation ? (
              <form
                className="space-y-3"
                onSubmit={e => {
                  e.preventDefault()
                  void saveInstitutionLocation()
                }}
              >
                <label className="block text-[12px] font-medium text-[#687995]">
                  Institution address
                  <textarea
                    value={locationDraft}
                    onChange={e => setLocationDraft(e.target.value)}
                    placeholder="Enter campus address, city, state and country"
                    rows={3}
                    maxLength={300}
                    required
                    className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingLocation || !locationDraft.trim()}
                    className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {isSavingLocation ? "Saving..." : "Save Location"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationDraft(String(keyInfo.address || user?.address || user?.location || ""))
                      setIsEditingLocation(false)
                      setSaveError("")
                    }}
                    className="rounded-full border border-[#E0E0E0] px-4 py-2 text-xs font-semibold text-[#555]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#F7F7F7] px-3 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p className="break-words text-[13px] text-[#1A1A2E]">
                    {keyInfo.address || user?.address || user?.location || "No address added yet"}
                  </p>
                </div>
                {(keyInfo.address || user?.address || user?.location) ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(keyInfo.address || user?.address || user?.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    View on Map
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-[12px] text-[#687995]">
                    Add an address to enable Google Maps.
                  </p>
                )}
              </>
            )}
            {saveError && (
              <p role="alert" className="mt-3 text-xs text-red-600">{saveError}</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Recent Activity</h3>
              <button
                type="button"
                onClick={() => router.push("/profile/activity")}
                className="text-[12px] font-semibold text-[#2563EB]"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {activityLoading ? (
                <p className="text-sm text-[#687995]">Loading activity...</p>
              ) : activityItems.length === 0 ? (
                <p className="text-sm text-[#687995]">
                  No opportunities posted yet.
                </p>
              ) : (
                (showAllActivity ? activityItems : activityItems.slice(0, 4)).map(
                  ({ id, icon: Icon, color, iconColor, title, sub, date }) => (
                    <div key={id} className="flex items-start gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="h-4 w-4" style={{ color: iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1A1A2E]">
                          {title}
                        </p>
                        <p className="text-[12px] text-[#687995] line-clamp-1">
                          {title} · {sub}
                        </p>
                      </div>
                      <span className="text-[11px] text-[#ABABAB] shrink-0">
                        {date ? date.toLocaleDateString() : "Date unavailable"}
                      </span>
                    </div>
                  )
                )
              )}
            </div>
            {!activityLoading && activityItems.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllActivity((value) => !value)}
                className="mt-4 text-[12px] font-semibold text-[#2563EB]"
              >
                {showAllActivity ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Social Media</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "in", title: "LinkedIn", url: user?.linkedin || user?.linkedinUrl },
                { label: "📷", title: "Instagram", url: user?.instagram || user?.instagramUrl },
                { label: "f", title: "Facebook", url: user?.facebook || user?.facebookUrl },
                { label: "𝕏", title: "X", url: user?.xUrl || user?.twitter },
                { label: "▶", title: "YouTube", url: user?.youtube || user?.youtubeUrl },
              ].filter(item => typeof item.url === "string" && item.url.trim()).map(item => {
                const rawUrl = item.url!.trim()
                const href = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
                return (
                  <a
                    key={item.title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.title}
                    title={item.title}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E0E0] text-[14px] font-bold text-[#555] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                  >
                    {item.label}
                  </a>
                )
              })}
              {[
                user?.linkedin || user?.linkedinUrl,
                user?.instagram || user?.instagramUrl,
                user?.facebook || user?.facebookUrl,
                user?.xUrl || user?.twitter,
                user?.youtube || user?.youtubeUrl,
              ].every(value => !String(value ?? "").trim()) && (
                <p className="text-sm text-[#687995]">
                  Add your social URLs in Details to activate these links.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
)}
{activeTab === "Reviews" && (
        <main className="mx-auto w-full max-w-3xl space-y-5 px-6 py-6">
          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1A1A2E]">Institution Reviews</h2>
            <p className="mt-1 text-sm text-[#687995]">Ratings and feedback from students and visitors who have reviewed your institution.</p>
            <div className="mt-6 rounded-xl border border-dashed border-[#D9E1EF] px-5 py-10 text-center">
              <h3 className="text-base font-semibold text-[#1A1A2E]">Your reviews will appear here</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#687995]">Reviews will appear here once students and visitors can submit feedback.</p>
            </div>
          </section>
        </main>
      )}

      {activeTab === "Gallery" && (
        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A2E]">Media & Gallery</h2>
          <p className="mt-3 text-sm font-semibold text-[#2563EB]">Coming Soon</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#687995]">
            Institution photo and media management is under development.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("Overview")}
            className="mt-5 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Overview
          </button>
        </div>
      )}

      {activeTab === "Settings" && (
        <main className="mx-auto w-full max-w-3xl space-y-5 px-6 py-6">
          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1A1A2E]">Institution Settings</h2>
            <p className="mt-1 text-sm text-[#687995]">Manage your account, notifications, and profile visibility.</p>
          </section>

          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#1A1A2E]">Account Information</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-[#687995]">Institution</p>
                <p className="font-medium text-[#1A1A2E]">{user?.institutionName || user?.organizationName || "Not added"}</p>
              </div>
              <div>
                <p className="text-[#687995]">Account email</p>
                <p className="font-medium text-[#1A1A2E]">{user?.email || auth.currentUser?.email || "Not available"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#1A1A2E]">Notifications</h3>
            <div className="mt-4 space-y-5">
              <label className="flex items-center justify-between gap-4 text-sm">
                <span><span className="block font-medium text-[#1A1A2E]">Email notifications</span><span className="text-[#687995]">Receive updates by email.</span></span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifications}
                  aria-label="Email notifications"
                  onClick={() => setEmailNotifications(v => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${emailNotifications ? "bg-[#2563EB]" : "bg-[#D1D5DB]"}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${emailNotifications ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </label>
              <label className="flex items-center justify-between gap-4 text-sm">
                <span><span className="block font-medium text-[#1A1A2E]">Application updates</span><span className="text-[#687995]">Enable application-related notifications.</span></span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={applicationUpdates}
                  aria-label="Application updates"
                  onClick={() => setApplicationUpdates(v => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${applicationUpdates ? "bg-[#2563EB]" : "bg-[#D1D5DB]"}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${applicationUpdates ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#1A1A2E]">Privacy</h3>
            <label className="mt-4 flex items-center justify-between gap-4 text-sm">
              <span><span className="block font-medium text-[#1A1A2E]">Public profile visibility</span><span className="text-[#687995]">Allow your institution profile to be visible publicly.</span></span>
              <button
                type="button"
                role="switch"
                aria-checked={publicProfile}
                aria-label="Public profile visibility"
                onClick={() => setPublicProfile(v => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${publicProfile ? "bg-[#2563EB]" : "bg-[#D1D5DB]"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${publicProfile ? "translate-x-[22px]" : "translate-x-0.5"}`} />
              </button>
            </label>
          </section>

          {settingsMessage && <p role="status" className="text-sm text-[#2563EB]">{settingsMessage}</p>}

          <div className="flex flex-wrap justify-between gap-3">
            <button type="button" onClick={() => void saveInstitutionSettings()} disabled={settingsSaving}
              className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60">
              {settingsSaving ? "Saving..." : "Save Settings"}
            </button>
            <button type="button" onClick={() => setConfirmLogout(true)}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
              Log Out
            </button>
          </div>

          {confirmLogout && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" role="presentation">
              <section role="dialog" aria-modal="true" aria-labelledby="institution-logout-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h3 id="institution-logout-title" className="text-lg font-bold text-[#1A1A2E]">Log out?</h3>
                <p className="mt-2 text-sm text-[#687995]">Are you sure you want to log out of your institution account?</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setConfirmLogout(false)} className="rounded-xl border border-[#E0E0E0] px-4 py-2.5 text-sm font-medium">Cancel</button>
                  <button type="button" onClick={() => void handleInstitutionLogout()} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Log Out</button>
                </div>
              </section>
            </div>
          )}
        </main>
      )}

      {activeTab === "Manage Opportunities" && (
        <InstitutionOpportunitiesManager
          user={user}
          institutionName={detailsDraft.institutionName || user?.institutionName || user?.name || user?.displayName || ""}
          profileCompletion={institutionProfileCompletion}
        />
      )}

      {activeTab === "Courses" && (
        <main className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
          <section className="w-full max-w-xl rounded-3xl border border-[#E8EAF0] bg-white px-8 py-12 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#2563EB]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m22 10-10-5L2 10l10 5 10-5Z" />
                <path d="M6 12v5c3.5 3 8.5 3 12 0v-5" />
                <path d="M22 10v6" />
              </svg>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              Something Exciting Is Coming
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1A1A2E] sm:text-4xl">
              Courses Are Coming Soon!
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#687995] sm:text-base">
              We’re working on a better way for institutions to showcase their
              courses, manage fees, and connect with students. Stay tuned —
              something great is on its way!
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#DCE6FF] bg-[#F5F8FF] px-5 py-2.5 text-sm font-semibold text-[#2563EB]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563EB]" />
              Coming Soon · Stay Tuned
            </div>
          </section>
        </main>
      )}

      {activeTab === "View Applications" && (
        <InstitutionApplications user={user} />
      )}

      {activeTab === "Details" && (
  <div className="px-6 py-6">
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#1A1A2E]">Institution Details</h2>
        <p className="mt-1 text-sm text-[#687995]">Manage your institution's official information.</p>
      </div>

      <form className="space-y-5" onSubmit={async (e) => {
        e.preventDefault()
        const uid = user?.uid || auth.currentUser?.uid
        if (!uid) {
          setDetailsSaveMessage("Please sign in again before saving.")
          return
        }

        const missingRequired: string[] = []
const requiredFields: [string, string][] = [
  ["institutionName", "Institution name"],
  ["institutionType", "Institution type"],
  ["aboutInstitution", "Institution description"],
  ["email", "Official email"],
  ["phone", "Phone number"],
  ["website", "Official website"],
  ["address", "Full address"],
  ["established", "Year established"],
  ["studentStrength", "Student strength"],
  ["country", "Country"],
  ["tagline", "Institution Tagline"],
  ["linkedin", "LinkedIn URL"],
]

for (const [key, label] of requiredFields) {
  const value = detailsDraft[key as keyof typeof detailsDraft]
  if (value === undefined || value === null || String(value).trim() === "") {
    missingRequired.push(label)
  }
}

if (missingRequired.length > 0) {
          setDetailsSaveMessage(
            `Please fill in the required fields: ${missingRequired.join(" and ")}.`
          )
          return
        }

        setSavingDetails(true)
        setDetailsSaveMessage("")
        try {
          await updateDoc(doc(db, "users", uid), {
            institutionName: detailsDraft.institutionName.trim(),
            organizationName: detailsDraft.institutionName.trim(),
            institutionType: detailsDraft.institutionType.trim(),
            aboutInstitution: detailsDraft.aboutInstitution.trim(),
            bio: detailsDraft.aboutInstitution.trim(),
            email: detailsDraft.email.trim(),
            phone: detailsDraft.phone.trim(),
            website: detailsDraft.website.trim(),
            address: detailsDraft.address.trim(),
            established: detailsDraft.established.trim(),
            accreditation: detailsDraft.accreditation.trim(),
            studentStrength: detailsDraft.studentStrength.trim(),
            country: detailsDraft.country.trim(),
            catalogUrl: detailsDraft.catalogUrl.trim(),
            tagline: detailsDraft.tagline.trim(),
            linkedin: detailsDraft.linkedin.trim(),
            instagram: detailsDraft.instagram.trim(),
            facebook: detailsDraft.facebook.trim(),
            xUrl: detailsDraft.xUrl.trim(),
            youtube: detailsDraft.youtube.trim(),
          })
          setDetailsSaveMessage("Details saved successfully.")
        } catch (error) {
          console.error("Failed to save institution details:", error)
          setDetailsSaveMessage("Could not save. Please try again.")
        } finally {
          setSavingDetails(false)
        }
      }}>
        {[
          { title: "Basic Information", fields: [
            ["institutionName", "Institution name"],
            ["institutionType", "Institution type"],
          ]},
          { title: "Contact Information", fields: [
            ["email", "Official email"],
            ["phone", "Phone number"],
            ["website", "Official website"],
            ["address", "Full address"],
          ]},
          { title: "Institution Information", fields: [
            ["established", "Year established"],
            ["accreditation", "Accreditation"],
            ["studentStrength", "Student strength"],
            ["country", "Country"],
          ]},
          { title: "Catalog", fields: [
            ["catalogUrl", "Catalog / brochure URL"],
            ["tagline", "Institution Tagline"],
          ]},
          { title: "Social Media Links", fields: [
            ["linkedin", "LinkedIn URL"],
            ["instagram", "Instagram URL"],
            ["facebook", "Facebook URL"],
            ["xUrl", "X (Twitter) URL"],
            ["youtube", "YouTube URL"],
          ]},
        ].map(section => (
          <section key={section.title} className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-[#1A1A2E]">{section.title}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.fields.map(([key, label]) => (
                <label key={key} className={`block text-sm font-medium text-[#374151] ${key === "address" ? "md:col-span-2" : ""}`}>
                  {label}
                  {key === "address" ? (
                    <textarea rows={2} value={detailsDraft[key as keyof typeof detailsDraft]}
                      onChange={e => setDetailsDraft(prev => ({ ...prev, [key]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-[#D1D5DB] p-3 text-sm" />
                  ) : (
                    <input type={key === "email" ? "email" : key === "website" ? "url" : "text"}
                      value={detailsDraft[key as keyof typeof detailsDraft]}
                      onChange={e => setDetailsDraft(prev => ({ ...prev, [key]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-[#D1D5DB] p-3 text-sm" />
                  )}
                </label>
              ))}
            </div>
            {section.title === "Basic Information" && (
              <label className="mt-4 block text-sm font-medium text-[#374151]">
                Institution description
                <textarea rows={4} value={detailsDraft.aboutInstitution}
                  onChange={e => setDetailsDraft(prev => ({ ...prev, aboutInstitution: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[#D1D5DB] p-3 text-sm" />
              </label>
            )}
          </section>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={savingDetails}
            className="rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {savingDetails ? "Saving..." : "Save Details"}
          </button>
          {detailsSaveMessage && <p role="status" className="text-sm text-[#687995]">{detailsSaveMessage}</p>}
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  )
}
