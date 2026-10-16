"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import { MapPin, Calendar, Monitor, Trash2, Bookmark, Search, ChevronDown } from "lucide-react"

const MOCK_SAVED = [
  {
    id: "1",
    type: "Internship",
    title: "Software Engineering Intern",
    organization: "Google",
    orgLogo: "https://www.google.com/favicon.ico",
    location: "Bengaluru, India",
    deadline: "Summer 2026",
    mode: "Hybrid",
    tags: ["Software Development", "Machine Learning", "Frontend"],
    savedAgo: "Saved 2 days ago",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
    tagColors: ["default", "default", "default"],
  },
  {
    id: "2",
    type: "Scholarship",
    title: "Clarendon Scholarship 2026",
    organization: "University of Oxford",
    orgLogo: "https://www.ox.ac.uk/favicon.ico",
    location: "UK",
    deadline: "2026 Intake",
    mode: "Fully Funded",
    tags: ["Master's", "Research", "All Fields"],
    savedAgo: "Saved 5 days ago",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80",
    tagColors: ["green", "green", "green"],
  },
  {
    id: "3",
    type: "Study Abroad",
    title: "B.Tech in Computer Science",
    organization: "National University of Singapore",
    orgLogo: "https://nus.edu.sg/favicon.ico",
    location: "Singapore",
    deadline: "2026 Intake",
    mode: "On-Campus",
    tags: ["Computer Science", "AI", "Data Science"],
    savedAgo: "Saved 1 week ago",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
    tagColors: ["default", "default", "orange"],
  },
  {
    id: "4",
    type: "Job",
    title: "Full Stack Developer",
    organization: "Microsoft",
    orgLogo: "https://microsoft.com/favicon.ico",
    location: "Hyderabad, India",
    deadline: "Full Time",
    mode: "On-Site",
    tags: ["React", "Node.js", "TypeScript"],
    savedAgo: "Saved 1 week ago",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    tagColors: ["default", "default", "blue"],
  },
  {
    id: "5",
    type: "Research",
    title: "Research Assistant – AI/ML",
    organization: "Stanford University",
    orgLogo: "https://stanford.edu/favicon.ico",
    location: "USA",
    deadline: "Jan 2026",
    mode: "On-Site",
    tags: ["Machine Learning", "Computer Vision", "Research"],
    savedAgo: "Saved 2 weeks ago",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    tagColors: ["default", "default", "default"],
  },
  {
    id: "6",
    type: "Internship",
    title: "Product Management Intern",
    organization: "Amazon",
    orgLogo: "https://amazon.com/favicon.ico",
    location: "Bengaluru, India",
    deadline: "Summer 2026",
    mode: "Hybrid",
    tags: ["Product Strategy", "Data Analysis", "Market Research"],
    savedAgo: "Saved 2 weeks ago",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80",
    tagColors: ["default", "default", "default"],
  },
]

const TYPE_TABS = ["All (24)", "Internships (8)", "Scholarships (6)", "Jobs (4)", "Study Abroad (4)", "Research (2)", "Events (0)", "Competitions (0)"]

const TAG_COLORS: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  default: "bg-gray-100 text-gray-600",
}

const TYPE_COLORS: Record<string, string> = {
  "Internship": "bg-[#FEF3C7] text-[#92400E]",
  "Scholarship": "bg-[#D1FAE5] text-[#065F46]",
  "Study Abroad": "bg-[#DBEAFE] text-[#1E40AF]",
  "Job": "bg-[#EDE9FE] text-[#5B21B6]",
  "Research": "bg-[#FCE7F3] text-[#9D174D]",
  "Hackathon": "bg-[#FEE2E2] text-[#991B1B]",
}

export default function SavedPage() {
  const router = useRouter()
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All (24)")
  const [useMock, setUseMock] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return }

      try {
        const savedQuery = query(collection(db, "savedOpportunities"), where("userId", "==", user.uid))
        const savedSnapshot = await getDocs(savedQuery)

        if (savedSnapshot.empty) {
          setUseMock(true)
          setSavedOpportunities(MOCK_SAVED)
        } else {
          const savedItems = await Promise.all(
            savedSnapshot.docs.map(async (savedDoc) => {
              const savedData = savedDoc.data()
              const opportunityRef = doc(db, "opportunities", savedData.opportunityId)
              const opportunitySnapshot = await getDoc(opportunityRef)
              if (opportunitySnapshot.exists()) return { id: opportunitySnapshot.id, ...opportunitySnapshot.data() }
              return null
            })
          )
          setSavedOpportunities(savedItems.filter(Boolean))
        }
      } catch {
        setUseMock(true)
        setSavedOpportunities(MOCK_SAVED)
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

  const displayData = useMock ? MOCK_SAVED : savedOpportunities

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

          {/* SEARCH + FILTERS */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-4 py-2.5 min-w-[180px] max-w-[320px]">
              <Search className="h-4 w-4 text-[#ABABAB] shrink-0" />
              <input type="text" placeholder="Search saved opportunities..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#ABABAB]" />
            </div>
            {["All Types", "All Categories", "All Locations", "All Modes"].map((f) => (
              <button key={f} className="flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-[13px] font-medium text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">
                {f} <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          {/* TABS */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                    activeTab === tab
                      ? "bg-[#2563EB] text-white"
                      : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#555]">
              Sort by:
              <button className="flex items-center gap-1 font-semibold text-[#1A1A2E]">
                Recently Saved <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm hover:shadow-md transition-all duration-300">
                {/* Image */}
                <div className="relative h-[160px] overflow-hidden">
                  <img src={item.image || "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80"} alt={item.title} className="h-full w-full object-cover" />
                  {/* Type badge */}
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-semibold ${TYPE_COLORS[item.type] || "bg-gray-100 text-gray-700"}`}>
                    {item.type}
                  </span>
                  {/* Delete btn */}
                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <span className="flex items-center gap-1.5 text-[12px] text-[#687995]">
                      <Bookmark className="h-3.5 w-3.5 text-[#2563EB]" /> {item.savedAgo}
                    </span>
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

          {/* PAGINATION */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">‹</button>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium transition ${n === 1 ? "bg-[#2563EB] text-white" : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
                {n}
              </button>
            ))}
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">›</button>
          </div>

        </section>
      </main>
    </>
  )
}