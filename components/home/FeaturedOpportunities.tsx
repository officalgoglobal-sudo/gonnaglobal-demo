"use client"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Bookmark, Calendar, MapPin, Building2, Globe, ChevronRight } from "lucide-react"
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

// ─── Exact 10 opportunities from the reference image ─────────────────────
const DEMO_OPPORTUNITIES = [
  {
    id: "demo-1",
    type: "Scholarship",
    title: "Rhodes Scholarship 2025",
    organization: "University of Oxford",
    location: "United Kingdom",
    funding: "Fully Funded",
    statusChip: "Fully Funded",
    deadline: "Jan 5, 2025",
    posterUrl: "https://images.unsplash.com/photo-1548637870-0ccabfe24dca?w=600&q=80",
  },
  {
    id: "demo-2",
    type: "Internship",
    title: "Google Summer Internship 2025",
    organization: "Google",
    location: "Multiple Locations",
    funding: "Stipend Provided",
    statusChip: "Competitive",
    deadline: "Mar 31, 2025",
    posterUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
  },
  {
    id: "demo-3",
    type: "Fellowship",
    title: "UN Youth Programme 2025",
    organization: "United Nations",
    location: "New York, USA",
    funding: "Partially Funded",
    statusChip: "Partially Funded",
    deadline: "Feb 15, 2025",
    posterUrl: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=600&q=80",
  },
  {
    id: "demo-4",
    type: "Conference",
    title: "Web Summit 2025",
    organization: "Web Summit",
    location: "Lisbon, Portugal",
    funding: "Paid (Selected)",
    statusChip: "Applications Open",
    deadline: "Nov 11, 2025",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    id: "demo-5",
    type: "Exchange Program",
    title: "Erasmus+ Exchange 2025",
    organization: "European Union",
    location: "Multiple Countries",
    funding: "Fully / Partially Funded",
    statusChip: "Popular",
    deadline: "Feb 28, 2025",
    posterUrl: "https://images.unsplash.com/photo-1467269204594-f71cda8b6a47?w=600&q=80",
  },
  {
    id: "demo-6",
    type: "Research",
    title: "CERN Research Programme",
    organization: "CERN",
    location: "Geneva, Switzerland",
    funding: "Fully Funded",
    statusChip: "Fully Funded",
    deadline: "Apr 1, 2025",
    posterUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80",
  },
  {
    id: "demo-7",
    type: "Volunteering",
    title: "UNICEF Volunteer Programme",
    organization: "UNICEF",
    location: "Global",
    funding: "Unpaid (Benefits Provided)",
    statusChip: "Open Now",
    deadline: "Jan 20, 2025",
    posterUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
  },
  {
    id: "demo-8",
    type: "Competition",
    title: "Hult Prize 2025",
    organization: "Hult International Business School",
    location: "Global",
    funding: "Prize + Mentorship",
    statusChip: "Applications Open",
    deadline: "Feb 28, 2025",
    posterUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  },
  {
    id: "demo-9",
    type: "Hackathon",
    title: "NASA Space Apps Challenge",
    organization: "NASA",
    location: "Global",
    funding: "Prizes + Certification",
    statusChip: "Open Now",
    deadline: "Oct 5, 2025",
    posterUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80",
  },
  {
    id: "demo-10",
    type: "Remote",
    title: "Remote Internships Worldwide",
    organization: "Various Organizations",
    location: "Global",
    funding: "Stipend / Unpaid",
    statusChip: "Flexible",
    deadline: "Rolling Basis",
    posterUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
  },
]

// Type badge colors (matching reference exactly)
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Scholarship:         { bg: "#EDE9FE", text: "#7C3AED" },
  Internship:          { bg: "#FEF3C7", text: "#D97706" },
  Fellowship:          { bg: "#DBEAFE", text: "#2563EB" },
  Conference:          { bg: "#FEE2E2", text: "#DC2626" },
  "Exchange Program":  { bg: "#D1FAE5", text: "#059669" },
  Research:            { bg: "#DBEAFE", text: "#1D4ED8" },
  Volunteering:        { bg: "#FEF9C3", text: "#CA8A04" },
  Competition:         { bg: "#FCE7F3", text: "#DB2777" },
  Hackathon:           { bg: "#CFFAFE", text: "#0891B2" },
  Remote:              { bg: "#D1FAE5", text: "#047857" },
}

// Status chip colors (matching reference exactly)
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Fully Funded":                { bg: "#D1FAE5", text: "#065F46" },
  "Partially Funded":            { bg: "#FEF3C7", text: "#92400E" },
  "Fully / Partially Funded":    { bg: "#D1FAE5", text: "#065F46" },
  "Paid (Selected)":             { bg: "#EDE9FE", text: "#5B21B6" },
  "Stipend Provided":            { bg: "#FEF3C7", text: "#92400E" },
  "Competitive":                 { bg: "#FFEDD5", text: "#C2410C" },
  "Applications Open":           { bg: "#FEE2E2", text: "#B91C1C" },
  "Popular":                     { bg: "#FEF9C3", text: "#713F12" },
  "Open Now":                    { bg: "#D1FAE5", text: "#065F46" },
  "Flexible":                    { bg: "#EDE9FE", text: "#7C3AED" },
  "Unpaid (Benefits Provided)":  { bg: "#F3F4F6", text: "#374151" },
  "Prize + Mentorship":          { bg: "#FCE7F3", text: "#DB2777" },
  "Prizes + Certification":      { bg: "#CFFAFE", text: "#0891B2" },
  "Stipend / Unpaid":            { bg: "#F3F4F6", text: "#374151" },
}

function OppCard({ item }: { item: any }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (!auth.currentUser) return
      const ref = doc(db, "savedOpportunities", `${auth.currentUser.uid}_${item.id}`)
      const snap = await getDoc(ref)
      setSaved(snap.exists())
    }
    check()
  }, [item.id])

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!auth.currentUser) { router.push(`/login?redirect=/opportunity/${item.id}`); return }
    const ref = doc(db, "savedOpportunities", `${auth.currentUser.uid}_${item.id}`)
    if (saved) { await deleteDoc(ref); setSaved(false) }
    else { await setDoc(ref, { userId: auth.currentUser.uid, opportunityId: item.id, savedAt: new Date() }); setSaved(true) }
  }

  const typeStyle = TYPE_COLORS[item.type] || { bg: "#F3F4F6", text: "#374151" }
  const statusKey = item.statusChip || item.funding || item.mode || "Open Now"
  const statusStyle = STATUS_COLORS[statusKey] || { bg: "#F3F4F6", text: "#374151" }
  const isDemoCard = item.id.startsWith("demo-")

  const handleClick = () => {
    if (!isDemoCard) router.push(`/opportunity/${item.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`group overflow-hidden rounded-[18px] border border-[#E8E8E8] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${!isDemoCard ? "cursor-pointer" : ""}`}
    >
      {/* Image */}
      <div className="relative h-[150px] w-full overflow-hidden bg-gray-100">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${item.id}/400/300`
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Globe className="h-10 w-10 text-blue-200" />
          </div>
        )}
        {/* Type badge — top left */}
        <span
          className="absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
        >
          {item.type}
        </span>
        {/* Save button — top right */}
        <button
          onClick={handleSave}
          className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full transition ${
            saved ? "bg-[#2563EB] text-white" : "bg-white/90 text-gray-500 hover:text-[#2563EB]"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" strokeWidth={saved ? 2.5 : 1.8} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[13px] font-bold leading-snug text-[#1A1A2E] line-clamp-1">{item.title}</h3>

        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#6B6B6B]">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.organization}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#6B6B6B]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#6B6B6B]">
            <Globe className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.funding || item.mode}</span>
          </div>
        </div>

        {/* Status chip + deadline */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold whitespace-nowrap"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {statusKey}
          </span>
          <div className="flex items-center gap-1 text-[10.5px] text-[#8A8A8A]">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="whitespace-nowrap">{item.deadline || "Rolling Basis"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#E8E8E8] bg-white">
      <div className="h-[150px] bg-gray-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-3/4 rounded-full bg-gray-100" />
        <div className="h-2.5 w-1/2 rounded-full bg-gray-100" />
        <div className="h-2.5 w-2/3 rounded-full bg-gray-100" />
        <div className="mt-3 h-6 w-full rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

export default function FeaturedOpportunities() {
  const [loading, setLoading] = useState(true)
  const [opps, setOpps] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "opportunities"), orderBy("createdAt", "desc"), limit(10))
        const snap = await getDocs(q)
        if (!snap.empty) {
          setOpps(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        } else {
          // Use demo data when Firebase has no data (matches reference design)
          setOpps(DEMO_OPPORTUNITIES)
        }
      } catch {
        // Firebase error — show demo data
        setOpps(DEMO_OPPORTUNITIES)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <section className="bg-white px-5 py-5 lg:px-8">
      {/* Light blue rounded container */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#EEF3FF] px-6 py-10 lg:px-10 lg:py-12">

        {/* Subtle dotted world-map pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #2563EB 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
              Global Opportunities, Real Impact.
            </p>
            <h2 className="mt-2 text-[38px] sm:text-[48px] font-black leading-tight tracking-tight text-[#1A1A2E]">
              Featured Opportunities{" "}
              <span className="text-[#2563EB]">Top 10</span>
            </h2>
            <p className="mt-2 text-[14px] text-[#5A5A6A]">
              Handpicked scholarships, internships, fellowships, and programs from around the world.
            </p>
          </div>

          {/* Right side — italic note + View All button */}
          <div className="hidden lg:flex flex-col items-end gap-3 shrink-0">
            <p
              className="text-right text-[13px] font-semibold italic text-[#2563EB] opacity-70 leading-snug"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              Your next<br />opportunity<br />could be anywhere<br />in the world.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-[#2563EB] bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
            >
              View All Opportunities <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 5-column × 2-row grid */}
        <div className="relative grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : opps.slice(0, 10).map((item) => <OppCard key={item.id} item={item} />)
          }
        </div>

        {/* Mobile View All */}
        <div className="mt-6 flex justify-center lg:hidden">
          <Link href="/explore" className="inline-flex items-center gap-2 rounded-full border border-[#2563EB] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#2563EB]">
            View All Opportunities <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}