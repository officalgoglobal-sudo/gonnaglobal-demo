"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ChevronRight, GraduationCap, BookOpen, Users } from "lucide-react"

// ─── These image URLs are verified to load from Unsplash ─────────────────────
const FALLBACK_UNIVERSITIES = [
  {
    id: "oxford",
    name: "University of Oxford",
    shortName: "University of Oxford",
    country: "United Kingdom",
    countryCode: "gb",
    opportunities: "450+",
    image: "https://images.unsplash.com/photo-1548637870-0ccabfe24dca?w=500&q=80",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/120px-Oxford-University-Circlet.svg.png",
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    shortName: "Massachusetts Institute of Technology",
    country: "United States",
    countryCode: "us",
    opportunities: "320+",
    image: "https://images.unsplash.com/photo-1569447891824-5f9d0fc576ea?w=500&q=80",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/150px-MIT_logo.svg.png",
  },
  {
    id: "stanford",
    name: "Stanford University",
    shortName: "Stanford University",
    country: "United States",
    countryCode: "us",
    opportunities: "280+",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/120px-Stanford_Cardinal_logo.svg.png",
  },
  {
    id: "nus",
    name: "National University of Singapore",
    shortName: "NUS",
    country: "Singapore",
    countryCode: "sg",
    opportunities: "200+",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=500&q=80",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/100px-NUS_coat_of_arms.svg.png",
  },
  {
    id: "toronto",
    name: "University of Toronto",
    shortName: "University of Toronto",
    country: "Canada",
    countryCode: "ca",
    opportunities: "180+",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/University_of_Toronto_coat_of_arms.svg/100px-University_of_Toronto_coat_of_arms.svg.png",
  },
  {
    id: "melbourne",
    name: "The University of Melbourne",
    shortName: "THE UNIVERSITY OF MELBOURNE",
    country: "Australia",
    countryCode: "au",
    opportunities: "150+",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/10/University_of_Melbourne_logo.svg/150px-University_of_Melbourne_logo.svg.png",
  },
]

const FLAG = (code: string) => `https://flagcdn.com/w20/${code.toLowerCase()}.png`


export default function Universities() {
  const [universities, setUniversities] = useState<any[]>(FALLBACK_UNIVERSITIES)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "universities"), orderBy("opportunities", "desc"), limit(10))
        const snap = await getDocs(q)
        if (!snap.empty) setUniversities(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch { /* use fallback */ }
    }
    fetch()
  }, [])

  return (
    <section className="bg-white">

      {/* ── Top part: light blue bg with world map visual ── */}
      <div className="relative overflow-hidden bg-[#EDF3FF] px-8 py-12 lg:px-12 lg:py-14">
        {/* Dotted world-map watermark */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #2563EB 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] items-center">

          {/* LEFT */}
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
              Global Universities. Brighter Futures.
            </p>
            <h2 className="mt-3 text-[32px] sm:text-[36px] lg:text-[40px] font-black leading-tight tracking-tight text-[#1A1A2E]" style={{ whiteSpace: 'nowrap' }}>
              Explore Top Universities{" "}
              <span className="text-[#2563EB]">Worldwide</span>
            </h2>
            <p className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-[#5A5A6A]">
              Discover leading universities, programs, and resources to take the next step in your academic journey.
            </p>

            <Link
              href="/explore?type=University"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#2563EB] px-6 py-2.5 text-[13.5px] font-semibold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
            >
              View All Universities <span className="ml-1">→</span>
            </Link>

            {/* Feature boxes */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: GraduationCap, color: "text-[#2563EB]", bg: "bg-[#EEF3FF]", label: "Discover", sub: "Top-ranked global universities and programs." },
                { icon: BookOpen, color: "text-green-600", bg: "bg-green-50", label: "Compare", sub: "Courses, deadlines, scholarships and more." },
                { icon: Users, color: "text-orange-500", bg: "bg-orange-50", label: "Get Guidance", sub: "Access resources and connect with current students." },
              ].map((f) => (
                <div key={f.label} className="rounded-2xl bg-white/90 p-4 shadow-sm">
                  <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${f.bg}`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <p className="text-[13px] font-bold text-[#1A1A2E]">{f.label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-[#6B6B6B]">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — floating university cards on world map */}
          <div className="relative flex items-center justify-end min-h-[360px] overflow-hidden">

            {/* ── World map + connection arcs + pins SVG background ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 560 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Continent silhouettes — light fill */}
              {/* Europe/UK region */}
              <path d="M155 60 Q165 52 178 55 Q185 48 195 52 Q200 58 193 64 Q198 68 190 74 Q182 78 172 73 Q162 76 157 70 Z" fill="#C8D8F0" opacity="0.6"/>
              {/* North America */}
              <path d="M30 55 Q45 40 75 42 Q100 38 120 50 Q130 62 118 78 Q108 92 90 98 Q70 102 55 90 Q35 80 28 65 Z" fill="#C8D8F0" opacity="0.6"/>
              {/* Africa */}
              <path d="M205 115 Q220 108 235 112 Q245 118 248 135 Q250 155 242 170 Q232 182 218 178 Q205 172 200 155 Q195 138 200 122 Z" fill="#C8D8F0" opacity="0.6"/>
              {/* Asia */}
              <path d="M270 55 Q310 42 360 48 Q395 52 420 65 Q430 78 415 90 Q395 100 365 98 Q335 96 310 88 Q280 80 268 68 Z" fill="#C8D8F0" opacity="0.6"/>
              {/* Australia */}
              <path d="M390 155 Q412 148 428 155 Q438 162 436 175 Q432 185 418 188 Q405 190 395 183 Q385 174 386 163 Z" fill="#C8D8F0" opacity="0.6"/>
              {/* South America */}
              <path d="M95 130 Q110 124 122 130 Q130 140 126 158 Q120 172 108 176 Q96 178 88 168 Q82 155 84 142 Q86 132 95 130 Z" fill="#C8D8F0" opacity="0.6"/>

              {/* Dotted curved arc connection lines */}
              <path d="M185 62 Q240 30 310 72" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.6"/>
              <path d="M310 72 Q370 50 410 80" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.6"/>
              <path d="M310 72 Q330 140 350 190" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.6"/>
              <path d="M185 62 Q220 130 250 170" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.6"/>

              {/* Teardrop location pins */}
              {/* UK pin (Oxford) */}
              <ellipse cx="185" cy="56" rx="8" ry="9" fill="#2563EB" opacity="0.9"/>
              <path d="M185 56 L181 64 Q185 70 189 64 Z" fill="#2563EB" opacity="0.9"/>
              <circle cx="185" cy="54" r="3" fill="white" opacity="0.9"/>
              {/* Central Europe pin */}
              <ellipse cx="310" cy="66" rx="8" ry="9" fill="#2563EB" opacity="0.9"/>
              <path d="M310 66 L306 74 Q310 80 314 74 Z" fill="#2563EB" opacity="0.9"/>
              <circle cx="310" cy="64" r="3" fill="white" opacity="0.9"/>
              {/* East Asia pin */}
              <ellipse cx="410" cy="74" rx="7" ry="8" fill="#2563EB" opacity="0.9"/>
              <path d="M410 74 L407 81 Q410 86 413 81 Z" fill="#2563EB" opacity="0.9"/>
              <circle cx="410" cy="72" r="2.5" fill="white" opacity="0.9"/>
              {/* South Asia pin */}
              <ellipse cx="350" cy="185" rx="7" ry="8" fill="#2563EB" opacity="0.9"/>
              <path d="M350 185 L347 192 Q350 197 353 192 Z" fill="#2563EB" opacity="0.9"/>
              <circle cx="350" cy="183" r="2.5" fill="white" opacity="0.9"/>
              {/* Americas pin */}
              <ellipse cx="250" cy="165" rx="6" ry="7" fill="#2563EB" opacity="0.8"/>
              <path d="M250 165 L247 171 Q250 176 253 171 Z" fill="#2563EB" opacity="0.8"/>
              <circle cx="250" cy="163" r="2" fill="white" opacity="0.9"/>

              {/* Pine tree silhouette at bottom */}
              <g opacity="0.12" fill="#2563EB">
                <path d="M20 340 L28 310 L36 340 Z"/>
                <path d="M22 325 L28 300 L34 325 Z"/>
                <path d="M50 340 L60 305 L70 340 Z"/>
                <path d="M53 320 L60 290 L67 320 Z"/>
                <path d="M88 340 L96 318 L104 340 Z"/>
                <path d="M90 328 L96 308 L102 328 Z"/>
                <path d="M125 340 L133 312 L141 340 Z"/>
                <path d="M127 326 L133 300 L139 326 Z"/>
                <path d="M160 340 L166 322 L172 340 Z"/>
                <path d="M162 330 L166 314 L170 330 Z"/>
                <path d="M490 340 L498 312 L506 340 Z"/>
                <path d="M492 326 L498 302 L504 326 Z"/>
                <path d="M516 340 L522 320 L528 340 Z"/>
                <path d="M518 330 L522 314 L526 330 Z"/>
                <rect x="26" y="340" width="4" height="12"/>
                <rect x="58" y="340" width="4" height="12"/>
                <rect x="94" y="340" width="4" height="12"/>
                <rect x="131" y="340" width="4" height="12"/>
                <rect x="164" y="340" width="4" height="12"/>
                <rect x="496" y="340" width="4" height="12"/>
                <rect x="520" y="340" width="4" height="12"/>
              </g>
            </svg>

            {/* Handwriting italic note — bottom left with signature underline */}
            <div
              className="absolute bottom-8 left-2 z-10"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              <p className="text-[17px] font-semibold italic text-[#1A1A2E] leading-snug">
                Better<br />Universities.<br />Brighter<br />Futures.
              </p>
              {/* Handwritten signature squiggle */}
              <svg width="60" height="18" viewBox="0 0 60 18" fill="none" style={{ marginTop: "4px" }}>
                <path d="M2 12 Q8 4 16 10 Q24 16 32 8 Q40 2 50 10 Q56 14 58 10" stroke="#2563EB" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Oxford floating card — top LEFT, tilted left */}
            <div
              className="absolute top-6 left-16 w-[185px] overflow-hidden rounded-[18px] bg-white shadow-2xl z-20"
              style={{ transform: "rotate(-6deg)", boxShadow: "0 8px 32px rgba(37,99,235,0.15), 0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <img
                src="/uni-oxford.jpg"
                alt="University of Oxford"
                className="h-[110px] w-full object-cover"
              />
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <img src={FLAG("gb")} alt="UK" className="h-3.5 w-5 rounded-sm object-cover flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                  <p className="text-[11px] font-bold text-[#1A1A2E]">University of Oxford</p>
                </div>
              </div>
            </div>

            {/* Graduation cap icon — top right */}
            <div className="absolute top-6 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-lg z-20">
              <GraduationCap className="h-5 w-5" />
            </div>

            {/* MIT floating card — bottom RIGHT, tilted right */}
            <div
              className="absolute bottom-4 right-4 w-[200px] overflow-hidden rounded-[18px] bg-white shadow-2xl z-20"
              style={{ transform: "rotate(5deg)", boxShadow: "0 8px 32px rgba(37,99,235,0.15), 0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <img
                src="/uni-mit.jpg"
                alt="MIT"
                className="h-[110px] w-full object-cover"
              />
              <div className="px-3 py-2.5 flex items-center gap-2">
                {/* MIT logo style */}
                <div style={{ fontFamily: "'Times New Roman', Georgia, serif", fontWeight: 900, fontSize: "14px", color: "#A31F34", letterSpacing: "1px", flexShrink: 0, lineHeight: 1, border: "2px solid #A31F34", padding: "1px 4px" }}>MIT</div>
                <div>
                  <img src={FLAG("us")} alt="US" className="h-3 w-[18px] rounded-sm object-cover mb-0.5" onError={(e) => (e.currentTarget.style.display="none")} />
                  <p className="text-[10px] font-bold text-[#1A1A2E] leading-tight">Massachusetts Institute<br />of Technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured Universities row ── */}
      <div className="bg-white px-8 py-8 lg:px-12">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[22px] font-bold text-[#1A1A2E]">Featured Universities</h3>
          <Link href="/explore?type=University" className="flex items-center gap-1 text-[13px] font-semibold text-[#2563EB] hover:underline">
            View All Universities <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {universities.map((uni) => (
              <div
                key={uni.id}
                className="group min-w-[210px] w-[210px] shrink-0 overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-white transition hover:shadow-md cursor-pointer"
              >
                {/* Campus image */}
                <div className="h-[120px] overflow-hidden bg-gray-100">
                  <img
                    src={uni.image || uni.imageUrl}
                    alt={uni.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${uni.id}/400/300`
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-3.5">
                  {/* Logo + name row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    {uni.logoUrl ? (
                      <img
                        src={uni.logoUrl}
                        alt={`${uni.name} logo`}
                        className="h-7 w-7 object-contain flex-shrink-0"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : null}
                    <p className="text-[11.5px] font-bold leading-snug text-[#1A1A2E] line-clamp-2">
                      {uni.shortName || uni.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    {uni.countryCode && (
                      <img
                        src={FLAG(uni.countryCode)}
                        alt={uni.country}
                        className="h-3 w-[18px] rounded-sm object-cover flex-shrink-0"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                    <span className="text-[11px] text-[#8A8A8A]">{uni.country}</span>
                  </div>
                  <div className="rounded-full bg-[#EEF3FF] py-1.5 text-center text-[11px] font-semibold text-[#2563EB]">
                    {uni.opportunities || "—"} Opportunities
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll arrow */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })}
            className="absolute -right-2 top-[60px] flex h-9 w-9 items-center justify-center rounded-full border border-[#EBEBEB] bg-white shadow-md transition hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
