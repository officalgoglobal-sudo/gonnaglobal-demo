"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import { Search, Bookmark, MapPin, Calendar, Monitor, X, SlidersHorizontal, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { isOpportunityExpired } from "@/lib/opportunityStatus"

// ── Mock cards for demo when no DB data
const MOCK_OPPORTUNITIES = [
  {
    id: "1", type: "Internship", title: "Software Engineering Intern", organization: "Google",
    orgLogo: "https://www.google.com/favicon.ico", location: "Bengaluru, India", deadline: "Summer 2026",
    mode: "Remote", tags: ["Software Development", "Machine Learning", "Internship"],
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
    deadlineLabel: "Deadline: 15 Oct 2026",
  },
  {
    id: "2", type: "Global Opportunity", title: "Clarendon Scholarship 2026", organization: "University of Oxford",
    orgLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-Coat-Of-Arms.svg/100px-Oxford-Coat-Of-Arms.svg.png",
    location: "UK", deadline: "2026 Intake", mode: "Fully Funded",
    tags: ["Master's", "Research", "All Fields"],
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80",
    deadlineLabel: "Deadline: 2 Dec 2026",
  },
  {
    id: "3", type: "Hackathon", title: "NASA Space Apps Challenge 2026", organization: "NASA",
    orgLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/100px-NASA_logo.svg.png",
    location: "Global", deadline: "4–6 Oct 2026", mode: "Online",
    tags: ["Innovation", "Space Tech", "Team Event"],
    image: "https://images.unsplash.com/photo-1446941303997-b2097da73688?w=600&q=80",
    deadlineLabel: "Deadline: 20 Sep 2026",
  },
  {
    id: "4", type: "Conference", title: "TechCrunch Disrupt 2026", organization: "TechCrunch",
    orgLogo: "https://techcrunch.com/favicon.ico", location: "San Francisco, USA",
    deadline: "27–29 Oct 2026", mode: "On-site",
    tags: ["Technology", "Startups", "Networking"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    deadlineLabel: "Deadline: 10 Oct 2026",
  },
  {
    id: "5", type: "Event", title: "Global Youth Leadership Summit", organization: "United Nations",
    orgLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/100px-Flag_of_the_United_Nations.svg.png",
    location: "New York, USA", deadline: "12–14 Nov 2026", mode: "Hybrid",
    tags: ["Leadership", "Sustainability", "Networking"],
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    deadlineLabel: "Deadline: 5 Nov 2026",
  },
  {
    id: "6", type: "Freelancing", title: "Frontend Developer (Freelance)", organization: "Toptal",
    orgLogo: "https://www.toptal.com/favicon.ico", location: "Remote",
    deadline: "Flexible", mode: "Paid",
    tags: ["React", "Next.js", "Web Development"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    deadlineLabel: "Deadline: 30 Sep 2026",
  },
]

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
  "Internship": "bg-[#FEF3C7] text-[#92400E]",
  "Global Opportunity": "bg-[#DBEAFE] text-[#1E40AF]",
  "Hackathon": "bg-[#EDE9FE] text-[#5B21B6]",
  "Conference": "bg-[#D1FAE5] text-[#065F46]",
  "Event": "bg-[#FCE7F3] text-[#9D174D]",
  "Freelancing": "bg-[#FEE2E2] text-[#991B1B]",
  "Sports": "bg-[#FEF3C7] text-[#D97706]",
  "Research": "bg-[#DBEAFE] text-[#1E40AF]",
  "Scholarship": "bg-[#D1FAE5] text-[#065F46]",
}

export default function ExplorePage() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("All Opportunities")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Internships"])
  const [selectedModes, setSelectedModes] = useState<string[]>(["Any mode"])
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["Anywhere"])
  const [selectedEligibility, setSelectedEligibility] = useState<string[]>(["Students"])
  const [selectedDeadlines, setSelectedDeadlines] = useState<string[]>(["Closing Soon"])
  const [selectedFunding, setSelectedFunding] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>(["All Levels"])
  const [activeFilters, setActiveFilters] = useState(["Internships", "Remote", "Students", "Closing Soon"])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("Most Relevant")
  const [useMock, setUseMock] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return }

      // Get URL params
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        const typeParam = params.get("type") || ""
        const searchParam = params.get("search") || ""
        if (typeParam) setSelectedCategories([typeParam])
        if (searchParam) setSearch(searchParam)
      }

      try {
        const snapshot = await getDocs(collection(db, "opportunities"))
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        const active = fetched.filter((o: any) => o.status !== "archived" && !isOpportunityExpired(o.deadline))
        if (active.length > 0) {
          setOpportunities(active)
        } else {
          setUseMock(true)
          setOpportunities(MOCK_OPPORTUNITIES)
        }
      } catch {
        setUseMock(true)
        setOpportunities(MOCK_OPPORTUNITIES)
      }
    })
    return () => unsubscribe()
  }, [router])

  const removeFilter = (f: string) => setActiveFilters(activeFilters.filter(x => x !== f))

  const displayData = useMock ? MOCK_OPPORTUNITIES : opportunities.filter((o) => {
    const matchesSearch = !search || o.title?.toLowerCase().includes(search.toLowerCase()) || o.organization?.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(o.type)
    return matchesSearch && matchesCat
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
              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_TABS.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                      activeTab === label
                        ? "bg-[#2563EB] text-white"
                        : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"
                    }`}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>

              {/* FILTER ROW */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {[
                  { label: "Location", value: "Anywhere" },
                  { label: "Mode", value: "Any mode" },
                  { label: "Eligibility", value: "All eligible users" },
                  { label: "Deadline", value: "Any deadline" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] text-[#ABABAB] px-1">{label}</span>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-[13px] text-[#555] hover:border-[#2563EB] transition">
                      📍 {value} <ChevronDown className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                ))}

                {/* All Filters button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-[13px] font-semibold text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition mt-4"
                >
                  <SlidersHorizontal className="h-4 w-4" /> All Filters
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-bold text-white">3</span>
                </button>
              </div>

              {/* ACTIVE FILTER TAGS */}
              {activeFilters.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {activeFilters.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 rounded-full border border-[#DBEAFE] bg-[#EEF4FF] px-3 py-1 text-[12px] font-medium text-[#2563EB]">
                      {f} <button onClick={() => removeFilter(f)}><X className="h-3 w-3"/></button>
                    </span>
                  ))}
                  <button className="text-[12px] font-semibold text-[#EF4444] hover:underline">Clear All</button>
                </div>
              )}

              {/* RESULTS ROW */}
              <div className="mt-5 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-[#1A1A2E]">
                  {displayData.length > 0 ? `1,240 Opportunities found` : "0 Opportunities found"}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[#555]">
                  Sort by:
                  <button className="flex items-center gap-1 font-semibold text-[#1A1A2E]">
                    {sortBy} <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CARDS GRID */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {displayData.map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-[150px] overflow-hidden bg-gray-100">
                      <img
                        src={item.image || item.posterUrl || "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80"}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Type badge */}
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TYPE_COLORS[item.type] || "bg-gray-100 text-gray-700"}`}>
                        {item.type}
                      </span>
                      {/* Bookmark btn */}
                      <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#555] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#2563EB]">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-[14px] font-bold text-[#1A1A2E] line-clamp-1">{item.title}</h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        {item.orgLogo && (
                          <img src={item.orgLogo} alt="" className="h-5 w-5 rounded object-contain" onError={(e) => { e.currentTarget.style.display = "none" }} />
                        )}
                        <span className="text-[13px] text-[#687995] font-medium">{item.organization}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-[#687995]">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {item.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {item.deadline}</span>
                        <span className="flex items-center gap-1"><Monitor className="h-3 w-3"/> {item.mode}</span>
                      </div>

                      {/* Tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {(item.tags || []).slice(0, 3).map((tag: string) => (
                          <span key={tag} className="rounded-full bg-[#F0F0F0] px-2.5 py-0.5 text-[11px] text-[#555]">{tag}</span>
                        ))}
                      </div>

                      {/* Deadline + CTA */}
                      <div className="mt-3 flex items-center justify-between border-t border-[#F0F0F0] pt-3">
                        <span className="text-[11.5px] text-[#687995] flex items-center gap-1">
                          <Calendar className="h-3 w-3"/> {item.deadlineLabel || `Deadline: ${item.deadline}`}
                        </span>
                        <Link
                          href={`/opportunity/${item.id}`}
                          className="flex items-center gap-1 rounded-full border border-[#2563EB] px-3 py-1 text-[12px] font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── RIGHT FILTER PANEL (always shown on xl) */}
          <div className="hidden xl:block w-[280px] shrink-0 border-l border-[#EBEBEB] bg-white">
            <div className="sticky top-[60px] overflow-y-auto max-h-[calc(100vh-60px)] p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-[#1A1A2E]">All Filters</h3>
                <button className="text-[#ABABAB] hover:text-[#555]"><X className="h-4 w-4"/></button>
              </div>

              {/* Category */}
              <FilterSection title="Category" defaultOpen>
                {["Global Opportunities","Internships","Hackathons","Sports","Conferences","Freelancing","Events","Competitions"].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                    <input type="checkbox" className="rounded border-[#E0E0E0] accent-[#2563EB]" defaultChecked={c==="Internships"} /> {c}
                  </label>
                ))}
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Location */}
              <FilterSection title="Location" defaultOpen>
                <div className="flex items-center gap-2 rounded-lg border border-[#E0E0E0] px-3 py-1.5 mb-3">
                  <Search className="h-3.5 w-3.5 text-[#ABABAB]"/>
                  <input type="text" placeholder="Search country or city..." className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#ABABAB]"/>
                </div>
                <div className="grid grid-cols-2 gap-y-2">
                  {["Anywhere","UK","India","Canada","USA","Other Countries"].map((l) => (
                    <label key={l} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      <input type="radio" name="location" className="accent-[#2563EB]" defaultChecked={l==="Anywhere"}/> {l}
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
                      <input type="checkbox" className="rounded border-[#E0E0E0] accent-[#2563EB]" defaultChecked={m==="Any mode"}/> {m}
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
                      <input type="checkbox" className="rounded border-[#E0E0E0] accent-[#2563EB]" defaultChecked={e==="Students"}/> {e}
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
                      <input type="radio" name="deadline" className="accent-[#2563EB]" defaultChecked={d==="Closing Soon"}/> {d}
                    </label>
                  ))}
                </div>
              </FilterSection>

              <div className="my-4 border-t border-[#F0F0F0]"/>

              {/* Funding */}
              <FilterSection title="Funding / Payment">
                <div className="grid grid-cols-2 gap-y-2">
                  {["Fully Funded","Unpaid","Partially Funded","Free to Participate","Paid","Paid Registration"].map((f) => (
                    <label key={f} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                      <input type="checkbox" className="rounded border-[#E0E0E0] accent-[#2563EB]"/> {f}
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
                      <input type="radio" name="exp" className="accent-[#2563EB]" defaultChecked={e==="All Levels"}/> {e}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* CTA buttons */}
              <div className="mt-6 flex gap-2">
                <button className="flex-1 rounded-xl border border-[#E0E0E0] py-2.5 text-[13px] font-semibold text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">
                  Clear All
                </button>
                <button className="flex-1 rounded-xl bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition">
                  Apply Filters (24)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function FilterSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
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
