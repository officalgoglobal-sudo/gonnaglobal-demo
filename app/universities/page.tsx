"use client"
import { useState } from "react"
import { Search, ChevronDown, Heart, ArrowRight, Globe } from "lucide-react"

const UNIVERSITIES = [
  { rank: "#1 QS", name: "Massachusetts Institute of Technology", abbr: "MIT", location: "USA", type: "Private", fields: ["Engineering", "AI/ML", "Research"], img: "/uni-mit.jpg" },
  { rank: "#3 QS", name: "Stanford University", abbr: "Stanford", location: "USA", type: "Private", fields: ["Computer Science", "Business", "Research"], img: "/uni-oxford.jpg" },
  { rank: "#4 QS", name: "Harvard University", abbr: "Harvard", location: "USA", type: "Private", fields: ["Business", "Law", "Medicine"], img: "/uni-oxford.jpg" },
  { rank: "#1 National", name: "University of Oxford", abbr: "Oxford", location: "UK", type: "Public", fields: ["Arts", "Social Sciences", "Research"], img: "/uni-oxford.jpg" },
  { rank: "#2 National", name: "University of Cambridge", abbr: "Cambridge", location: "UK", type: "Public", fields: ["Engineering", "Natural Sciences", "Research"], img: "/uni-oxford.jpg" },
  { rank: "#1 Asia", name: "National University of Singapore", abbr: "NUS", location: "Singapore", type: "Public", fields: ["Engineering", "Business", "Computer Science"], img: "/uni-oxford.jpg" },
  { rank: "#7 QS", name: "ETH Zurich", abbr: "ETH", location: "Switzerland", type: "Public", fields: ["Engineering", "Technology", "Research"], img: "/uni-oxford.jpg" },
  { rank: "#1 Canada", name: "University of Toronto", abbr: "UofT", location: "Canada", type: "Public", fields: ["Computer Science", "Business", "Life Sciences"], img: "/uni-oxford.jpg" },
]

const COUNTRY_TABS = ["All", "Top Universities", "Partner Universities", "USA", "UK", "Canada", "Australia", "Germany", "Singapore", "Europe", "Asia", "Popular for Study Abroad"]

const TYPE_COLORS: Record<string, string> = { Private: "bg-gray-100 text-gray-600", Public: "bg-blue-50 text-blue-600" }

export default function UniversitiesPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [savedItems, setSaved] = useState<number[]>([])

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <img src="/uni-oxford.jpg" alt="University" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative px-8 py-10 lg:px-12 flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-2">Universities</p>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-[36px] font-black text-[#1A1A2E] mb-2">
              Explore Top Universities Worldwide
            </h1>
            <p className="text-[14px] text-[#6B6B6B] max-w-2xl">
              Discover universities listed on Gonn&apos;a Global. Find programs, scholarships, events, and opportunities.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-[#DBEAFE] bg-white/90 px-5 py-4 shrink-0 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF]">
              <Globe className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1A1A2E]">Global Education</p>
              <p className="text-[12px] font-semibold text-[#2563EB]">Greater Opportunities</p>
              <p className="text-[11px] text-[#8A8A8A]">Explore universities from across the world.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 lg:px-12">
        {/* Search + filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-[#ABABAB]" />
            <input placeholder="Search universities by name, country, or program..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#B0B0B0]" />
          </div>
          {["All Countries", "All Regions", "All Types", "All Programs"].map((f) => (
            <button key={f} className="flex items-center gap-1.5 rounded-xl border border-[#E0E0E0] bg-white px-3 py-2.5 text-[12.5px] text-[#5A5A6A] hover:border-[#2563EB] transition">
              {f} <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* Country/type tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {COUNTRY_TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition ${activeTab === t ? "bg-[#2563EB] text-white" : "border border-[#E0E0E0] bg-white text-[#5A5A6A] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
              {t}
            </button>
          ))}
          <button className="text-[12.5px] text-[#2563EB] font-medium">Clear Filters</button>
        </div>

        {/* Count + sort */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[14px] font-bold text-[#1A1A2E]">128 Universities</p>
          <div className="flex items-center gap-2 text-[12.5px] text-[#5A5A6A]">
            Sort by: <button className="flex items-center gap-1 font-semibold text-[#1A1A2E]">Most Relevant <ChevronDown className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {/* University grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {UNIVERSITIES.map((u, i) => (
            <div key={u.name} className="rounded-2xl border border-[#EBEBEB] bg-white overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-36 overflow-hidden">
                <img src={u.img} alt={u.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/uni-oxford.jpg" }} />
                <span className="absolute left-3 top-3 rounded-lg bg-[#1A1A2E]/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">{u.rank}</span>
                <button
                  onClick={() => setSaved((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i])}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
                >
                  <Heart className={`h-4 w-4 ${savedItems.includes(i) ? "fill-red-500 text-red-500" : "text-[#CCCCCC]"}`} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[10px] font-black text-[#2563EB]">{u.abbr.slice(0, 3)}</div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1A1A2E] leading-tight">{u.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-[#8A8A8A]">🌐 {u.location}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${TYPE_COLORS[u.type]}`}>{u.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {u.fields.map((f) => <span key={f} className="rounded-full bg-[#F4F4F4] px-2 py-0.5 text-[10.5px] text-[#5A5A6A]">{f}</span>)}
                </div>
                <button className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#2563EB] py-2 text-[12.5px] font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition">
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E0E0] text-[#5A5A6A] hover:border-[#2563EB]">‹</button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition ${p === 1 ? "bg-[#2563EB] text-white" : "border border-[#E0E0E0] text-[#5A5A6A] hover:border-[#2563EB]"}`}>{p}</button>
          ))}
          <span className="text-[#CCCCCC] px-1">...</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E0E0] text-[13px] font-medium text-[#5A5A6A] hover:border-[#2563EB]">16</button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E0E0] text-[#5A5A6A] hover:border-[#2563EB]">›</button>
        </div>
      </div>
    </main>
  )
}