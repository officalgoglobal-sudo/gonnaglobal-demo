"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import { MapPin, Calendar, Monitor, Trash2, Bookmark, Search, Share2 } from "lucide-react"


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

const TAG_COLORS: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  default: "bg-gray-100 text-gray-600",
}


const TYPE_COLORS: Record<string, string> = {
  "Internship": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Internships": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Global Opportunity": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Global Opportunities": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Hackathon": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Hackathons": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Conference": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Conferences": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Mentorship": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Mentorships": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Scholarship": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Scholarships": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Fellowship": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Fellowships": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Event": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Events": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Cultural Events": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Freelancing": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Sports": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Research": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Competition": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
  "Competitions": "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]",
}


export default function SavedPage() {
  const router = useRouter()
  
const [savedOpportunities, setSavedOpportunities] = useState<any[]>([])
const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState("All Opportunities")
const [search, setSearch] = useState("")


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return }

      try {
        const savedQuery = query(collection(db, "savedOpportunities"), where("userId", "==", user.uid))
        const savedSnapshot = await getDocs(savedQuery)

       


const savedItems = await Promise.all(
  savedSnapshot.docs.map(async (savedDoc) => {
    const savedData = savedDoc.data()

    const opportunityId =
      savedData.opportunityId ||
      (savedDoc.id.startsWith(`${user.uid}_`)
        ? savedDoc.id.slice(user.uid.length + 1)
        : "")

    if (!opportunityId) return null

    const opportunitySnapshot = await getDoc(
      doc(db, "opportunities", opportunityId)
    )

    if (!opportunitySnapshot.exists()) return null

    return {
      id: opportunitySnapshot.id,
      ...opportunitySnapshot.data(),
      savedAt: savedData.savedAt ?? null,
    }
  })
)

setSavedOpportunities(savedItems.filter(Boolean))


         
        
      } catch (error) {
  console.error("Failed to load saved opportunities:", error)
  setSavedOpportunities([])
}

      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-white pb-24 lg:ml-[80px] lg:pb-0">
        <Sidebar />
        <Topbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
        </div>
      </main>
    )
  }


const displayData = savedOpportunities.filter((item) => {
  const searchText = search.trim().toLowerCase()
  const searchableText = [
    item.title,
    item.organization,
    item.description,
    item.location,
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (searchText && !searchableText.includes(searchText)) {
    return false
  }

  if (activeTab === "All Opportunities") {
    return true
  }

  const type = String(item.type ?? item.category ?? "").toLowerCase()

  const categoryMap: Record<string, string[]> = {
    "Global Opportunities": ["global opportunity", "global opportunities"],
    Internships: ["internship", "internships"],
    Hackathons: ["hackathon", "hackathons"],
    Sports: ["sport", "sports"],
    Conferences: ["conference", "conferences"],
    Freelancing: ["freelance", "freelancing"],
    Events: ["event", "events"],
    Competitions: ["competition", "competitions"],
  }

  return (categoryMap[activeTab] ?? []).some((category) =>
    type.includes(category)
  )
})


  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-white pb-24 text-[#1A1A2E] lg:ml-[80px] lg:pb-0">
        <Topbar />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-none bg-gradient-to-r from-[#EEF4FF] via-[#F0F7FF] to-[#E8F0FE] px-6 py-8 sm:px-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] sm:text-4xl">
                Saved Opportunities
              </h1>
              <p className="mt-2 max-w-xl text-[14px] leading-[1.7] text-[#687995]">
                All the opportunities you've saved. Keep track, apply later, or remove the ones you're no longer interested in.
              </p>
            </div>
            {/* Right decoration */}
            <div className="hidden lg:flex flex-col items-end gap-1">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB] shadow-lg">
                  <Bookmark className="h-8 w-8 text-white" fill="white" />
                </div>
              </div>
              <div className="text-right mt-2">
                <p className="text-[18px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Saved Today,</p>
                <p className="text-[18px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>A Brighter Tomorrow</p>
                <svg viewBox="0 0 100 20" className="ml-auto w-20 mt-1">
                  <path d="M5 15 Q50 5 95 12" stroke="#1A1A2E" strokeWidth="2" fill="none"/>
                  <path d="M83 7 L95 12 L86 18" stroke="#1A1A2E" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-6 sm:px-8">


{/* SEARCH + CATEGORY TABS */}
<div className="mb-6 flex flex-wrap items-center gap-3">
  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
    {CATEGORY_TABS.map(({ label, icon }) => (
      <button
        key={label}
        onClick={() => setActiveTab(label)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition ${
          activeTab === label
            ? "bg-[#2563EB] text-white"
            : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"
        }`}
      >
        <span>{icon}</span>
        {label}
      </button>
    ))}
  </div>

  <div className="flex w-full items-center gap-2 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-4 py-2.5 sm:w-[280px] sm:shrink-0">
    <Search className="h-4 w-4 shrink-0 text-[#ABABAB]" />
    <input
      type="text"
      placeholder="Search saved opportunities..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#ABABAB]"
    />
  </div>
</div>

          

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((item) => (
              
<div
  key={item.id}
  role="link"
  tabIndex={0}
  aria-label={`View ${item.title || "opportunity"} details`}
  onClick={() => router.push(`/opportunity/${item.id}`)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      router.push(`/opportunity/${item.id}`)
    }
  }}
  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm transition-all duration-300 hover:shadow-md"
>

               

{/* Image */}
<div className="relative h-[160px] overflow-hidden bg-gray-100">
  {(item.image || item.posterUrl) && (
    <img
      src={item.image || item.posterUrl}
      alt={item.title || "Opportunity"}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none"
      }}
    />
  )}

  {/* Type badge */}
  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-semibold ${TYPE_COLORS[item.type] || "border border-[#BFDBFE] bg-[#DBEAFE] text-[#2563EB]"}`}>
    {item.type}
  </span>

  
<button
  type="button"
  aria-label={`Remove ${item.title || "opportunity"} from saved`}
  onClick={async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const { getAuth } = await import("firebase/auth")
      const user = getAuth().currentUser

      if (!user) {
        router.push("/login")
        return
      }

      const savedQuery = query(
        collection(db, "savedOpportunities"),
        where("userId", "==", user.uid)
      )

      const savedSnapshot = await getDocs(savedQuery)

      const matchingDocs = savedSnapshot.docs.filter((savedDoc) => {
        const data = savedDoc.data()
        return (
          data.opportunityId === item.id ||
          savedDoc.id === `${user.uid}_${item.id}`
        )
      })

      await Promise.all(matchingDocs.map((savedDoc) => deleteDoc(savedDoc.ref)))

      setSavedOpportunities((prev) =>
        prev.filter((opportunity) => opportunity.id !== item.id)
      )
    } catch (error) {
      console.error("Failed to remove saved opportunity:", error)
      alert("Could not remove this opportunity. Please try again.")
    }
  }}
  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
>
  <Trash2 className="h-4 w-4" />
</button>

</div>


                {/* Content */}
                <div className="p-4">
                  <h3 className="text-[15px] font-bold text-[#1A1A2E] line-clamp-1">{item.title}</h3>
                  <div className="mt-1.5 flex items-center gap-2">
                    {item.orgLogo && (
                      <img src={item.orgLogo} alt="" className="h-5 w-5 rounded object-contain" onError={(e) => { e.currentTarget.style.display = "none" }} />
                    )}
                    <span className="text-[13px] text-[#687995] font-medium">{item.organization}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#687995]">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {item.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {item.deadline}</span>
                    <span className="flex items-center gap-1"><Monitor className="h-3.5 w-3.5" /> {item.mode}</span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(item.tags || []).map((tag: string, i: number) => (
                      <span key={tag} className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TAG_COLORS[item.tagColors?.[i]] || TAG_COLORS.default}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F0] pt-3">
                    

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
  className="flex items-center justify-center rounded-full p-1 text-[#2563EB] hover:bg-blue-50 transition"
  title="Share opportunity"
>
  <Share2 className="h-4 w-4" />
</button>


                    <Link
                      href={`/opportunity/${item.id}`}
                      className="flex items-center gap-1 rounded-full border border-[#2563EB] px-3 py-1.5 text-[12px] font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </>
  )
}