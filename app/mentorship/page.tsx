"use client"
import { useState } from "react"
import { Search, ChevronDown, Users, Star, Bookmark, ArrowRight } from "lucide-react"

const MENTORS = [
  { name: "Rahul Verma", role: "Software Engineer", company: "Google", type: "Mentor", tags: ["Career Guidance", "Tech", "Interview Prep"], rating: 4.8, reviews: 120, price: "Free", available: "Mon, Wed, Fri", img: "" },
  { name: "Priya Sharma", role: "Product Manager", company: "Microsoft", type: "Mentor", tags: ["Product Management", "Career Growth", "Resume Review"], rating: 4.9, reviews: 98, price: "₹800 / session", available: "Weekends", img: "" },
  { name: "MIT", role: "Massachusetts Institute of Technology", company: "USA", type: "Institution", tags: ["Study Abroad", "Research Guidance", "Admissions"], rating: 4.8, reviews: 210, price: "₹1,500 / session", available: "By Appointment", img: "" },
  { name: "Dr. Neha Kapoor", role: "Professor (AI & ML)", company: "IIT Delhi", type: "Mentor", tags: ["Research", "Higher Studies", "Academic Guidance"], rating: 4.8, reviews: 76, price: "Free", available: "Tue, Thu", img: "" },
  { name: "Stanford University", role: "", company: "Stanford, USA", type: "Institution", tags: ["Study Abroad", "Admissions", "Scholarships"], rating: 4.9, reviews: 320, price: "₹2,000 / session", available: "By Appointment", img: "" },
  { name: "Aditya Rao", role: "Data Scientist", company: "Amazon", type: "Mentor", tags: ["Data Science", "ML/AI", "Projects"], rating: 4.7, reviews: 64, price: "₹700 / session", available: "Weekends", img: "" },
  { name: "Sneha Iyer", role: "Study Abroad Consultant", company: "IDP Education", type: "Mentor", tags: ["Study Abroad", "University Selection", "Applications"], rating: 4.8, reviews: 93, price: "₹1,200 / session", available: "Mon - Sat", img: "" },
  { name: "Coursera", role: "Online Learning Platform", company: "", type: "Institution", tags: ["Online Courses", "Certifications", "Career Guidance"], rating: 4.7, reviews: 450, price: "Free", available: "Always Open", img: "" },
]

const FILTER_TAGS = ["All", "Free", "Paid", "Industry Experts", "University Professors", "Institutions", "Career Guidance", "Study Abroad", "Research", "Skill Development", "Entrepreneurship"]

const INITIALS: Record<string, string> = {
  "Rahul Verma": "RV", "Priya Sharma": "PS", "MIT": "MIT", "Dr. Neha Kapoor": "NK",
  "Stanford University": "SU", "Aditya Rao": "AR", "Sneha Iyer": "SI", "Coursera": "C",
}
const COLORS = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-red-100 text-red-700", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-pink-100 text-pink-700", "bg-indigo-100 text-indigo-700", "bg-orange-100 text-orange-700"]

export default function MentorshipPage() {
  const [activeTag, setActiveTag] = useState("All")
  const [activeTab, setActiveTab] = useState("All")

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EEF3FF] to-white px-8 py-10 lg:px-12 flex items-start gap-8">
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-2">Mentorship</p>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-[36px] font-black text-[#1A1A2E] mb-2">
            Learn from Mentors &amp; Institutions
          </h1>
          <p className="text-[14px] text-[#6B6B6B] max-w-xl">
            Get guidance from industry experts, professors, and leading institutions.
          </p>
        </div>
        {/* Feature dots */}
        <div className="hidden lg:flex flex-col gap-2 text-[12.5px] text-[#5A5A6A]">
          {["Career Guidance", "Industry Insights", "University Admissions", "Skill Development", "Research Guidance"].map((t) => (
            <div key={t} className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />{t}</div>
          ))}
        </div>
        <button className="hidden lg:flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-[13.5px] font-bold text-white hover:bg-[#1d4ed8] transition shrink-0">
          <Users className="h-4 w-4" /> Become a Mentor
        </button>
      </div>

      <div className="px-8 py-6 lg:px-12">
        {/* Search + filters row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-[#ABABAB]" />
            <input placeholder="Search mentors or institutions by name, expertise..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#B0B0B0]" />
          </div>
          {["All Types", "All Categories", "All Levels", "All Pricing", "All Availability"].map((f) => (
            <button key={f} className="flex items-center gap-1.5 rounded-xl border border-[#E0E0E0] bg-white px-3 py-2.5 text-[12.5px] text-[#5A5A6A] hover:border-[#2563EB] transition">
              {f} <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ))}
          <button className="text-[12.5px] text-[#2563EB] font-medium">Clear Filters</button>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_TAGS.map((t) => (
            <button key={t} onClick={() => setActiveTag(t)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition ${activeTag === t ? "bg-[#2563EB] text-white" : "border border-[#E0E0E0] bg-white text-[#5A5A6A] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
              {t}
            </button>
          ))}
          <button className="rounded-full border border-[#E0E0E0] bg-white px-4 py-1.5 text-[12.5px] text-[#5A5A6A] flex items-center gap-1">More <ChevronDown className="h-3 w-3" /></button>
        </div>

        {/* Count + tabs + sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <p className="text-[14px] font-bold text-[#1A1A2E]">86 Mentors &amp; Institutions</p>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-[#E0E0E0] bg-white overflow-hidden">
              {["All", "Mentors", "Institutions"].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-[12.5px] font-medium transition ${activeTab === t ? "bg-[#2563EB] text-white" : "text-[#5A5A6A] hover:bg-[#F4F4F4]"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[12.5px] text-[#5A5A6A]">
              Sort by: <button className="flex items-center gap-1 font-semibold text-[#1A1A2E]">Most Relevant <ChevronDown className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Mentor grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MENTORS.map((m, i) => (
            <div key={m.name} className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[13px] font-black ${COLORS[i % COLORS.length]}`}>
                    {INITIALS[m.name] || m.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${m.type === "Mentor" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{m.type}</span>
                    </div>
                    <p className="text-[13.5px] font-bold text-[#1A1A2E] leading-tight">{m.name}</p>
                    <p className="text-[11.5px] text-[#8A8A8A]">{m.role}{m.company && m.role ? `, ${m.company}` : m.company}</p>
                  </div>
                </div>
                <button className="text-[#CCCCCC] hover:text-[#2563EB]"><Bookmark className="h-4 w-4" /></button>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(m.rating) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E5E7EB]"}`} />)}
                <span className="text-[11.5px] text-[#6B6B6B] ml-1">{m.rating} ({m.reviews})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {m.tags.map((t) => <span key={t} className="rounded-full bg-[#F4F4F4] px-2.5 py-1 text-[10.5px] text-[#5A5A6A]">{t}</span>)}
              </div>
              <div className="text-[11.5px] text-[#888] flex items-center gap-1.5">
                <span>📅</span> Available: {m.available}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F4F4F4]">
                <span className={`text-[14px] font-black ${m.price === "Free" ? "text-[#16A34A]" : "text-[#1A1A2E]"}`}>{m.price}</span>
                <button className="flex items-center gap-1.5 rounded-xl border border-[#2563EB] px-3 py-1.5 text-[12px] font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition">
                  View Profile <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}