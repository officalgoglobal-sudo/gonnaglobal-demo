"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import { Search, Bookmark, Share2, MapPin, Calendar, Monitor, X, SlidersHorizontal, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"

import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import { isOpportunityExpired } from "@/lib/opportunityStatus"


const CATEGORY_TABS = [
  { label: "All Opportunities", icon: "🌐" },
  { label: "Global Opportunities", icon: "🌍" },
  { label: "Internships", icon: "💼" },
  { label: "Hackathons", icon: "</>" },
  { label: "Sports", icon: "🏆" },
  { label: "Conferences", icon: "🎤" },
  { label: "Freelancing", icon: "💻" },
  { label: "Events", icon: "📅" },
  { label: "Competitions", icon: "⭐" },
]



const TYPE_COLORS: Record<string, string> = {
  "Internship": "bg-[#DBEAFE] text-[#2563EB]",
  "Internships": "bg-[#DBEAFE] text-[#2563EB]",
  "Global Opportunity": "bg-[#DBEAFE] text-[#2563EB]",
  "Global Opportunities": "bg-[#DBEAFE] text-[#2563EB]",
  "Hackathon": "bg-[#DBEAFE] text-[#2563EB]",
  "Hackathons": "bg-[#DBEAFE] text-[#2563EB]",
  "Conference": "bg-[#DBEAFE] text-[#2563EB]",
  "Conferences": "bg-[#DBEAFE] text-[#2563EB]",
  "Mentorship": "bg-[#DBEAFE] text-[#2563EB]",
  "Mentorships": "bg-[#DBEAFE] text-[#2563EB]",
  "Scholarship": "bg-[#DBEAFE] text-[#2563EB]",
  "Scholarships": "bg-[#DBEAFE] text-[#2563EB]",
  "Fellowship": "bg-[#DBEAFE] text-[#2563EB]",
  "Fellowships": "bg-[#DBEAFE] text-[#2563EB]",
  "Event": "bg-[#DBEAFE] text-[#2563EB]",
  "Events": "bg-[#DBEAFE] text-[#2563EB]",
  "Cultural Events": "bg-[#DBEAFE] text-[#2563EB]",
  "Freelancing": "bg-[#DBEAFE] text-[#2563EB]",
  "Sports": "bg-[#DBEAFE] text-[#2563EB]",
  "Research": "bg-[#DBEAFE] text-[#2563EB]",
  "Competition": "bg-[#DBEAFE] text-[#2563EB]",
  "Competitions": "bg-[#DBEAFE] text-[#2563EB]",
}


export default function ExplorePage() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<any[]>([])
const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>([])
const [savingOpportunityId, setSavingOpportunityId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("All Opportunities")
 const [selectedCategories, setSelectedCategories] = useState<string[]>([])

const [selectedLocation, setSelectedLocation] = useState("Anywhere")
const [locationSearch, setLocationSearch] = useState("")
const [selectedModes, setSelectedModes] = useState<string[]>(["Any mode"])
const [selectedEligibility, setSelectedEligibility] = useState<string[]>(["Open to All"])
const [selectedDeadlines, setSelectedDeadlines] = useState<string[]>(["Any deadline"])
const [customStartDate, setCustomStartDate] = useState("")
const [customEndDate, setCustomEndDate] = useState("")
const [selectedFunding, setSelectedFunding] = useState<string[]>([])
const [selectedExperience, setSelectedExperience] = useState<string[]>(["All Levels"])

const [appliedFilters, setAppliedFilters] = useState({
  modes: ["Any mode"],
  eligibility: ["Open to All"],
  deadlines: ["Any deadline"],
  funding: [] as string[],
  experience: ["All Levels"],
})

  const [activeFilters, setActiveFilters] = useState(["Internships", "Remote", "Students", "Closing Soon"])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("Most Relevant")
 const [loading, setLoading] = useState(true)
const [error, setError] = useState("")

 
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/login")
      setLoading(false)
      return
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const typeParam = params.get("type") || ""
      const searchParam = params.get("search") || ""

      if (typeParam) {
  const categoryNames: Record<string, string> = {
    "global opportunities": "Global Opportunities",
    internships: "Internships",
    hackathons: "Hackathons",
    sports: "Sports",
    conferences: "Conferences",
    freelancing: "Freelancing",
    events: "Events",
    competitions: "Competitions",
  }

  const selectedType =
    categoryNames[typeParam.trim().toLowerCase()] || typeParam

  setSelectedCategories([selectedType])
  setActiveTab(selectedType)
} else {
  setSelectedCategories([])
  setActiveTab("All Opportunities")
}

if (searchParam) setSearch(searchParam)
    }

    setLoading(true)
    setError("")

    
try {
  const snapshot = await getDocs(collection(db, "opportunities"))

  const fetched = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))

  setOpportunities(
    fetched.filter((o: any) => o.status !== "archived")
  )

  // Load this user's saved opportunities from Firestore.
  const savedQuery = query(
    collection(db, "savedOpportunities"),
    where("userId", "==", user.uid)
  )

  const savedSnapshot = await getDocs(savedQuery)

  setSavedOpportunityIds(
    savedSnapshot.docs
      .map((savedDoc) => {
        const data = savedDoc.data()
        return data.opportunityId ||
          (savedDoc.id.startsWith(`${user.uid}_`)
            ? savedDoc.id.slice(user.uid.length + 1)
            : "")
      })
      .filter(Boolean)
  )


     
setOpportunities(
  fetched.filter((o: any) => o.status !== "archived")
)

    } catch (error) {
      console.error("Failed to fetch opportunities:", error)
      setOpportunities([])
      setError("Unable to load opportunities. Please try again.")
    } finally {
      setLoading(false)
    }
  })

  return () => unsubscribe()
}, [router])


  const removeFilter = (f: string) => setActiveFilters(activeFilters.filter(x => x !== f))

  
const normalize = (value: unknown) =>
  String(value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ")


const displayData = opportunities.filter((o: any) => {
  const normalize = (value: unknown) =>
    String(value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ")

  const searchText = normalize(search)
  const searchableText = normalize(
    `${o.title ?? ""} ${o.organization ?? ""} ${o.description ?? ""} ${o.location ?? ""} ${(o.tags ?? []).join?.(" ") ?? ""}`
  )

  if (searchText && !searchableText.includes(searchText)) return false

  const category = normalize(o.type ?? o.category)
  if (
    selectedCategories.length > 0 &&
    !selectedCategories.some((c) => {
      const selected = normalize(c)
      return category === selected ||
        category.includes(selected) ||
        selected.includes(category)
    })
  ) return false

  const f = appliedFilters
  const mode = normalize(o.mode)
  if (
    !f.modes.includes("Any mode") &&
    f.modes.length > 0 &&
    !f.modes.some((m) => mode.includes(normalize(m)))
  ) return false

  const eligibility = normalize(
    Array.isArray(o.eligibility) ? o.eligibility.join(" ") : o.eligibility
  )
  if (
    !f.eligibility.includes("Open to All") &&
    f.eligibility.length > 0 &&
    !f.eligibility.some((e) => {
      if (e === "Open to All") return true
      return eligibility.includes(normalize(e))
    })
  ) return false

  const deadlineValue = o.deadline?.toDate
    ? o.deadline.toDate()
    : new Date(o.deadline)
  const hasDeadline =
    o.deadline != null && !Number.isNaN(deadlineValue.getTime())
  const daysLeft = hasDeadline
    ? (deadlineValue.getTime() - Date.now()) / 86400000
    : null

  if (!f.deadlines.includes("Any deadline") && f.deadlines.length > 0) {
    if (f.deadlines.includes("Closing Soon") &&
        !(daysLeft !== null && daysLeft >= 0 && daysLeft <= 7)) return false
    if (f.deadlines.includes("Within 7 days") &&
        !(daysLeft !== null && daysLeft >= 0 && daysLeft <= 7)) return false
    
    if (f.deadlines.includes("Custom Range")) {
      if (!customStartDate || !customEndDate || !hasDeadline) return false

      const startDate = new Date(`${customStartDate}T00:00:00`)
      const endDate = new Date(`${customEndDate}T23:59:59.999`)

      if (deadlineValue < startDate || deadlineValue > endDate) {
        return false
      }
    }

  }

  const funding = normalize(
    `${o.funding ?? ""} ${o.payment ?? ""} ${o.fundingType ?? ""}`
  )
  if (
    f.funding.length > 0 &&
    !f.funding.some((v) => funding.includes(normalize(v)))
  ) return false

  const experience = normalize(o.experienceLevel ?? o.experience ?? "")
  if (
    !f.experience.includes("All Levels") &&
    f.experience.length > 0 &&
    !f.experience.some((v) => experience.includes(normalize(v)))
  ) return false

  return true
})


  return (
    <main className="min-h-screen bg-white text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-[80px]">
       
<Topbar />

<div className="flex">
  {/* ── MAIN CONTENT */}

          <div className="flex-1 min-w-0">

            {/* HERO BANNER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#EEF4FF] via-[#F0F7FF] to-[#E8F0FE] px-6 py-8 sm:px-10">
              <div className="flex items-center justify-between">
                <div className="max-w-lg">
                  <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] sm:text-4xl">
                    Explore Opportunities
                  </h1>
                  <p className="mt-2 text-[14px] text-[#687995]">
                    Discover internships, hackathons, events, competitions and more from around the world.
                  </p>
                </div>
                {/* Right text decoration */}
                <div className="hidden lg:flex items-center gap-3 shrink-0">
                  <div className="relative w-[120px] h-[80px]">
                    {/* Hiker silhouette */}
                    <div className="absolute right-0 top-0 text-[48px]">🧗</div>
                  </div>
                  <div className="text-right">
                    <p className="text-[18px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Explore</p>
                    <p className="text-[18px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Learn</p>
                    <p className="text-[18px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Grow</p>
                  </div>
                  <div className="text-right">
                    <svg viewBox="0 0 100 60" className="w-[100px]">
                      <circle cx="60" cy="30" r="28" fill="#DBEAFE" opacity="0.6"/>
                      <text x="60" y="36" textAnchor="middle" fontSize="24">🌐</text>
                    </svg>
                    <p className="text-[13px] font-bold text-[#1A1A2E]">Global</p>
                    <p className="text-[13px] font-bold text-[#1A1A2E]">Opportunities</p>
                    <p className="text-[13px] font-bold text-[#1A1A2E]">Brighter Futures</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 sm:px-8">

              {/* SEARCH BAR */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#E0E0E0] bg-[#F7F7F7] px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-[#ABABAB]" />
                <input
                  type="text"
                  placeholder="Search opportunities, skills, or organizers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-[14px] text-[#1A1A2E] outline-none placeholder:text-[#ABABAB]"
                />
              </div>

              {/* CATEGORY TABS */}
              
<div className="mt-4 flex flex-wrap items-center gap-2">

                {CATEGORY_TABS.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => {
  setActiveTab(label)
  if (label === "All Opportunities") {
    setSelectedCategories([])
  } else {
    const categoryMap: Record<string, string> = {
      "Global Opportunities": "global",
      Internships: "internship",
      Hackathons: "hackathon",
      Sports: "sports",
      Conferences: "conference",
      Freelancing: "freelance",
      Events: "event",
      Competitions: "competition",
    }
    setSelectedCategories([categoryMap[label] || label.toLowerCase()])
  }
}}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                      activeTab === label
                        ? "bg-[#2563EB] text-white"
                        : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"
                    }`}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}

{!showFilters && (
  <button
    type="button"
    onClick={() => setShowFilters(true)}
    className="ml-auto shrink-0 rounded-lg border border-[#E0E0E0] bg-white px-4 py-2 text-[13px] font-semibold text-[#2563EB] shadow-sm transition hover:bg-[#EEF4FF]"
  >
    <SlidersHorizontal className="mr-2 inline h-4 w-4" />
    All Filters
  </button>
)}

              </div>


             


{loading ? (
  <div className="mt-8 py-12 text-center text-sm text-[#687995]">
    Loading opportunities from the database...
  </div>
) : error ? (
  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center">
    <p className="font-semibold text-red-700">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-3 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
    >
      Try Again
    </button>
  </div>
) : displayData.length === 0 ? (
  <div className="mt-8 rounded-2xl border border-[#E0E0E0] bg-[#FAFBFF] px-5 py-12 text-center">
    <Search className="mx-auto h-8 w-8 text-[#9CAAC0]" />
    <h3 className="mt-3 text-lg font-bold text-[#1A1A2E]">
      No opportunities found
    </h3>
    <p className="mt-2 text-sm text-[#687995]">
      There are no matching active opportunities right now. Try changing your search or filters.
    </p>
  </div>
) : (
  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {displayData.map((item) => (
      
<div
  key={item.id}
  role="link"
  tabIndex={0}
  onClick={() => router.push(`/opportunity/${item.id}`)}
  onKeyDown={(e) => {
    if (e.key === "Enter") router.push(`/opportunity/${item.id}`)
  }}
  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm transition-all duration-300 hover:shadow-md"
>

        <div className="relative h-[150px] overflow-hidden bg-gray-100">
          <img
            src={item.image || item.posterUrl || "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80"}
            alt={item.title || "Opportunity"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
  TYPE_COLORS[item.type] ||
  (String(item.type || item.category || "").toLowerCase().includes("global")
    ? "bg-[#DBEAFE] text-[#2563EB]"
    : "bg-gray-100 text-gray-700")
}`}>
            {item.type}
          </span>
          
<button
  type="button"
  aria-label={
    savedOpportunityIds.includes(item.id)
      ? `Unsave ${item.title || "opportunity"}`
      : `Save ${item.title || "opportunity"}`
  }
  disabled={savingOpportunityId === item.id}
  onClick={async (e) => {
  e.stopPropagation()
    const user = auth.currentUser
    if (!user) {
      router.push("/login")
      return
    }

    setSavingOpportunityId(item.id)

    try {
      const savedRef = doc(
  db,
  "savedOpportunities",
  `${user.uid}_${item.id}`
)

      if (savedOpportunityIds.includes(item.id)) {
        await deleteDoc(savedRef)
        setSavedOpportunityIds((previous) =>
          previous.filter((id) => id !== item.id)
        )
      } else {
       await setDoc(savedRef, {
  userId: user.uid,
  opportunityId: item.id,
  savedAt: serverTimestamp(),
})
        setSavedOpportunityIds((previous) =>
          [...previous, item.id]
        )
      }
    } catch (error) {
  console.error("Failed to update saved opportunity:", error)

  if (error instanceof Error) {
    alert(`Save failed: ${error.message}`)
  } else {
    alert("Could not update saved opportunity. Check the browser console.")
  }
} finally {
      setSavingOpportunityId(null)
    }
  }}
  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-md transition hover:bg-[#DBEAFE] disabled:opacity-50"
>
  <Bookmark
    className="h-4 w-4"
    fill={savedOpportunityIds.includes(item.id) ? "currentColor" : "none"}
  />
</button>

        </div>

        <div className="p-4">
          <h3 className="line-clamp-1 text-[14px] font-bold text-[#1A1A2E]">
            {item.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            {item.orgLogo && (
              <img
                src={item.orgLogo}
                alt=""
                className="h-5 w-5 rounded object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            )}
            <span className="text-[13px] font-medium text-[#687995]">
              {item.organization}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-[#687995]">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {item.location}
              </span>
            )}
            {item.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {item.deadline}
              </span>
            )}
            {item.mode && (
              <span className="flex items-center gap-1">
                <Monitor className="h-3 w-3" /> {item.mode}
              </span>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {(item.tags || []).slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-[#F0F0F0] px-2.5 py-0.5 text-[11px] text-[#555]"
              >
                {tag}
              </span>
            ))}
          </div>

         <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F0F0F0] pt-3">
            <span className="flex items-center gap-1 text-[11.5px] text-[#687995]">
              <Calendar className="h-3 w-3" />
              {item.deadlineLabel || (item.deadline ? `Deadline: ${item.deadline}` : "Deadline not specified")}
            </span>
<div className="flex shrink-0 items-center gap-2">
<button
  type="button"
  aria-label={`Share ${item.title || "opportunity"}`}
  onClick={async (e) => {
    e.stopPropagation()

    const shareUrl = `${window.location.origin}/opportunity/${item.id}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title || "Opportunity",
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert("Opportunity link copied!")
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl)
          alert("Opportunity link copied!")
        } catch {
          alert(`Copy this link: ${shareUrl}`)
        }
      }
    }
  }}
  className="flex shrink-0 items-center justify-center rounded-full border border-[#2563EB] p-1.5 text-[#2563EB] transition hover:bg-[#DBEAFE]"
  title="Share opportunity"
>
  <Share2 className="h-4 w-4" />
</button>

            <Link
              href={`/opportunity/${item.id}`}
              className="flex shrink-0 items-center gap-1 rounded-full border border-[#2563EB] px-3 py-1 text-[12px] font-semibold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
            >
              View Details →
            </Link>
</div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
          </div>
       </div>

          {/* ── RIGHT FILTER PANEL (always shown on xl) */}
        {showFilters && (
  <div className="hidden xl:block w-[280px] shrink-0 border-l border-[#EBEBEB] bg-white">
            <div className="sticky top-[60px] overflow-y-auto max-h-[calc(100vh-60px)] p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-[#1A1A2E]">All Filters</h3>
                <button
  onClick={() => setShowFilters(false)}
  className="text-[#ABABAB] hover:text-[#555]"
  aria-label="Close filters"
>
  <X className="h-4 w-4" />
</button>
              </div>

             

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Location */}
              <FilterSection title="Location" defaultOpen>
                <div className="flex items-center gap-2 rounded-lg border border-[#E0E0E0] px-3 py-1.5 mb-3">
                  <Search className="h-3.5 w-3.5 text-[#ABABAB]"/>
                  
<input
  type="text"
  placeholder="Search region..."
  value={locationSearch}
  onChange={(e) => setLocationSearch(e.target.value)}
  className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#ABABAB]"
/>

                </div>
                <div className="grid grid-cols-2 gap-y-2">
                 {["Anywhere","Asia","Europe","Africa","South America","North America","Australia","Others"]
  .filter((l) => l.toLowerCase().includes(locationSearch.trim().toLowerCase()))
  .map((l) => (
                    <label key={l} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      
<input
  type="radio"
  name="location"
  className="accent-[#2563EB]"
  checked={selectedLocation === l}
  onChange={() => setSelectedLocation(l)}
/>
{l}

                    </label>
                  ))}
                </div>
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Mode */}
              <FilterSection title="Mode">
                <div className="grid grid-cols-2 gap-y-2">
                  {["Online","On-site","Hybrid","Any mode"].map((m) => (
                    <label key={m} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      
<input
  type="checkbox"
  className="rounded border-[#E0E0E0] accent-[#2563EB]"
  checked={selectedModes.includes(m)}
  onChange={(e) => {
    setSelectedModes((prev) =>
      m === "Any mode"
        ? e.target.checked ? ["Any mode"] : []
        : e.target.checked
          ? [...prev.filter((v) => v !== "Any mode"), m]
          : prev.filter((v) => v !== m)
    )
  }}
/>
{m}

                    </label>
                  ))}
                </div>
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Eligibility */}
              <FilterSection title="Eligibility">
                <div className="grid grid-cols-2 gap-y-2">
                  {["Students","Professionals","Graduates","Open to All"].map((e) => (
                    <label key={e} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      
<input
  type="checkbox"
  className="rounded border-[#E0E0E0] accent-[#2563EB]"
  checked={selectedEligibility.includes(e)}
  onChange={(event) => {
    setSelectedEligibility((prev) =>
      event.target.checked
        ? e === "Open to All"
          ? ["Open to All"]
          : [...prev.filter((v) => v !== "Open to All"), e]
        : prev.filter((v) => v !== e)
    )
  }}
/>
{e}

                    </label>
                  ))}
                </div>
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Deadline */}
              <FilterSection title="Deadline" defaultOpen>
                <div className="grid grid-cols-2 gap-y-2">
                  {["Any deadline","Closing Soon","Within 30 days","Within 7 days","Custom Range"].map((d) => (
                    <label key={d} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer col-span-1">
                      
<input
  type="radio"
  name="deadline"
  className="accent-[#2563EB]"
  checked={selectedDeadlines.includes(d)}
  onChange={() => setSelectedDeadlines([d])}
/>
{d}

                    </label>
                  ))}
                
                </div>

                {selectedDeadlines.includes("Custom Range") && (
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-[#555]">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        max={customEndDate || undefined}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full rounded-lg border border-[#E0E0E0] p-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#555]">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        min={customStartDate || undefined}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full rounded-lg border border-[#E0E0E0] p-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Funding */}

              <FilterSection title="Funding / Payment">
                <div className="grid grid-cols-2 gap-y-2">
                  {["Fully Funded","Unpaid","Partially Funded","Free to Participate","Paid","Paid Registration"].map((f) => (
                    <label key={f} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      
<input
  type="checkbox"
  className="rounded border-[#E0E0E0] accent-[#2563EB]"
  checked={selectedFunding.includes(f)}
  onChange={(event) => {
    setSelectedFunding((prev) =>
      event.target.checked
        ? [...prev, f]
        : prev.filter((v) => v !== f)
    )
  }}
/>
{f}

                    </label>
                  ))}
                </div>
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Experience Level */}
              <FilterSection title="Experience Level">
                <div className="grid grid-cols-2 gap-y-2">
                  {["Beginner","Advanced","Intermediate","All Levels"].map((e) => (
                    <label key={e} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      
<input
  type="radio"
  name="exp"
  className="accent-[#2563EB]"
  checked={selectedExperience.includes(e)}
  onChange={() => setSelectedExperience([e])}
/>
{e}

                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* CTA buttons */}
              <div className="mt-6 flex gap-2">
                
<button
  type="button"
  onClick={() => {
    setSelectedLocation("Anywhere")
    setLocationSearch("")
    setSelectedModes(["Any mode"])
    setSelectedEligibility(["Open to All"])
    setSelectedDeadlines(["Any deadline"])
    setCustomStartDate("")
    setCustomEndDate("")
    setSelectedFunding([])
    setSelectedExperience(["All Levels"])

    setAppliedFilters({
      modes: ["Any mode"],
      eligibility: ["Open to All"],
      deadlines: ["Any deadline"],
      funding: [],
      experience: ["All Levels"],
    })
  }}
  className="flex-1 rounded-xl border border-[#E0E0E0] py-2.5 text-[13px] font-semibold text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition"
>
  Clear All
</button>

                
<button
  type="button"
  onClick={() => {
    setAppliedFilters({
      modes: [...selectedModes],
      eligibility: [...selectedEligibility],
      deadlines: [...selectedDeadlines],
      funding: [...selectedFunding],
      experience: [...selectedExperience],
    })
  }}
  className="flex-1 rounded-xl bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition"
>
  Apply Filters
</button>

              </div>
            </div>
          </div>
 )}
        </div>
      </div>
    </main>
  )
}


function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-1">
        <span className="text-[13px] font-semibold text-[#1A1A2E]">{title}</span>
        <ChevronDown className={`h-4 w-4 text-[#ABABAB] transition-transform ${open ? "rotate-180" : ""}`}/>
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  )
}
