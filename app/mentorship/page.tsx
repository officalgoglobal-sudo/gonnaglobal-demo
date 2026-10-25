"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Search, ChevronDown, Users, Star, ArrowRight } from "lucide-react"

type Mentor = {
  uid: string;
  name: string;
  role: string;
  company: string;
  type: "Mentor" | "Institution";
  tags: string[];
  rating: number;
  reviews: number;
  price: string;
  available: string;
  img: string;
};

const INITIALS: Record<string, string> = {};

const FILTER_TAGS = ["All", "Free", "Paid"]


const COLORS = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-red-100 text-red-700", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-pink-100 text-pink-700", "bg-indigo-100 text-indigo-700", "bg-orange-100 text-orange-700"]

export default function MentorshipPage() {
  const [activeTag, setActiveTag] = useState("All")
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [activeTab, setActiveTab] = useState("All")
  const router = useRouter()
  const [isMentor, setIsMentor] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const activeMentors = snapshot.docs
        .map((profile): Mentor | null => {
          const data = profile.data()
          if (data.isMentorActive !== true) return null
          if ((data.activeRole || data.role) !== "mentor") return null

          const name = String(data.fullName || data.displayName || data.name || "Mentor")
          const priceValue = data.mentorPrice ?? data.price ?? 0
          const priceNumber = Number(priceValue)
          const price = String(priceValue).trim().toLowerCase() === "free" ||
            !Number.isNaN(priceNumber) && priceNumber === 0
            ? "Free"
            : `₹${priceValue}`

          const rawTags = data.mentorshipAreas ?? data.expertise ?? data.skills ?? []
          const tags = Array.isArray(rawTags)
            ? rawTags.filter((tag: unknown): tag is string => typeof tag === "string")
            : []

          return {
            uid: profile.id,
            name,
            role: String(data.profession || data.jobTitle || data.headline || "Mentor"),
            company: String(data.company || data.organization || data.currentCompany || ""),
            type: "Mentor" as const,
            tags,
            rating: Number(data.rating ?? data.averageRating ?? 0),
            reviews: Number(data.reviewsCount ?? data.reviewCount ?? 0),
            price,
            available: String(data.availability || data.mentorSessionType || "By appointment"),
            img: String(data.photoURL || ""),
          }
        })
        .filter((mentor): mentor is Mentor => mentor !== null)
      setMentors(activeMentors)
    }, (error) => {
      console.error("Unable to load active mentors:", error)
      setMentors([])
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsMentor(false)
      if (!firebaseUser) return
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid))
        if (!snap.exists()) return
        const data = snap.data()
        setIsMentor((data.activeRole || data.role) === "mentor")
      } catch (error) {
        console.error("Unable to check mentor role:", error)
        setIsMentor(false)
      }
    })
    return () => unsubscribe()
  }, [])


  const filteredMentors = mentors.filter((m) => {
    const price = String(m.price ?? "").trim().toLowerCase();
    if (activeTag === "All") return true;
    if (activeTag === "Free") return price === "free" || price === "₹0" || price === "0";
    if (activeTag === "Paid") return price !== "" && price !== "free" && price !== "₹0" && price !== "0";
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />
        {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EEF3FF] to-white px-8 py-10 lg:px-12 flex items-start gap-8">
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-2">Mentorship</p>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-[32px] font-black text-[#1A1A2E] mb-2">
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
        {isMentor && (
        <button onClick={() => router.push("/profile")} className="hidden lg:flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#1d4ed8] transition shrink-0">
          <Users className="h-4 w-4" /> Mentor Dashboard
        </button>
        )}
      </div>

      <div className="px-8 py-6 lg:px-12">
        {/* Search + filters row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-[#ABABAB]" />
            <input placeholder="Search mentors or institutions by name, expertise..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#B0B0B0]" />
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_TAGS.map((t) => (
            <button key={t} onClick={() => setActiveTag(t)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition ${activeTag === t ? "bg-[#2563EB] text-white" : "border border-[#E0E0E0] bg-white text-[#5A5A6A] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
              {t}
            </button>
          ))}

        </div>

        {/* Count + tabs + sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <p className="text-[14px] font-bold text-[#1A1A2E]">{filteredMentors.filter((m) => activeTab === "All" || m.type === (activeTab === "Mentors" ? "Mentor" : "Institution")).length} {activeTab === "All" ? "Mentors & Institutions" : activeTab}</p>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-[#E0E0E0] bg-white overflow-hidden">
              {["All", "Mentors", "Institutions"].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-[12.5px] font-medium transition ${activeTab === t ? "bg-[#2563EB] text-white" : "text-[#5A5A6A] hover:bg-[#F4F4F4]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mentor grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredMentors
              .filter((m) => activeTab === "All" || m.type === (activeTab === "Mentors" ? "Mentor" : "Institution"))
              .map((m, i) => (
            <div key={`${m.name}-${i}`} className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[13px] font-black ${COLORS[i % COLORS.length]}`}>
                    {INITIALS[m.name] || m.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${m.type === "Mentor" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{m.type}</span>
                    </div>
                    <p className="text-[13px] font-bold text-[#1A1A2E] leading-tight">{m.name}</p>
                    <p className="text-[11px] text-[#8A8A8A]">{m.role}{m.company && m.role ? `, ${m.company}` : m.company}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(m.rating) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E5E7EB]"}`} />)}
                <span className="text-[11px] text-[#6B6B6B] ml-1">{m.rating} ({m.reviews})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {m.tags.map((t: string) => <span key={t} className="rounded-full bg-[#F4F4F4] px-2.5 py-1 text-[10px] text-[#5A5A6A]">{t}</span>)}
              </div>
              <div className="text-[11px] text-[#888] flex items-center gap-1.5">
                <span>📅</span> Available: {m.available}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F4F4F4]">
                <span className={`text-[14px] font-black ${m.price === "Free" ? "text-[#16A34A]" : "text-[#1A1A2E]"}`}>{m.price}</span>
                <button
                  type="button"
                  onClick={() => router.push(`/mentor/${encodeURIComponent(m.uid)}`)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2563EB] px-3 py-1.5 text-[12px] font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition"
                >
                  View Profile <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </main>
  )
}