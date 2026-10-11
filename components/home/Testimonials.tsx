"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const STATS = [
  { number: "10K+", label: "Students on Platform" },
  { number: "500+", label: "Partner Organizations" },
  { number: "195+", label: "Countries Covered" },
  { number: "95%", label: "Positive Feedback" },
]

const TESTIMONIALS = [
  {
    quote: "Gonn'a Global helped me find the perfect internship in Germany. The resources and community support made the entire process so much easier!",
    name: "Priya Sharma",
    role: "Mechanical Engineering Student",
    avatar: "https://i.pravatar.cc/80?img=47",
    bg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    quote: "I discovered a fully-funded fellowship I never would have found otherwise. This platform genuinely changed my trajectory.",
    name: "Arjun Patel",
    role: "Computer Science Undergraduate",
    avatar: "https://i.pravatar.cc/80?img=12",
    bg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  },
  {
    quote: "Within a week of signing up, I found three scholarship opportunities matching my profile. The search filters are incredibly precise.",
    name: "Amara Osei",
    role: "International Relations Student",
    avatar: "https://i.pravatar.cc/80?img=32",
    bg: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
  },
  {
    quote: "The platform feels curated and clean — none of the noise from random Google searches. Exactly what students need.",
    name: "Sofia Chen",
    role: "AI Research Enthusiast",
    avatar: "https://i.pravatar.cc/80?img=25",
    bg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
]

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIALS[idx]
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length)

  return (
    <section className="bg-[#FAFAF8] px-8 py-12 lg:px-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 items-center">

        {/* ── LEFT: label + headline + stats ── */}
        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.22em] text-[#8B7355]">
            Real People. Global Stories.
          </p>
          <h2 className="mt-3 text-[30px] sm:text-[38px] font-black leading-tight tracking-tight text-[#1A1A2E]">
            Students Worldwide<br />
            Are Growing with{" "}
            <span className="text-[#2563EB]">Gonn&apos;a Global</span>
          </h2>
          <p className="mt-3 max-w-[400px] text-[13.5px] leading-relaxed text-[#5A5A6A]">
            From scholarships to internships, our community is creating real impact across the globe.
          </p>

          {/* Stats 2×2 */}
          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-[34px] font-black leading-none text-[#1A1A2E]">{s.number}</p>
                <p className="mt-1 text-[12.5px] text-[#8A8A8A]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: testimonial card with background photo ── */}
        <div className="relative overflow-hidden rounded-[28px] min-h-[340px]">
          {/* Person background image */}
          <img
            src={t.bg}
            alt={t.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Quote card overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="rounded-[20px] bg-white p-5 shadow-xl">
              <Quote className="h-6 w-6 text-[#2563EB] mb-2" strokeWidth={1.5} />
              <p className="text-[13.5px] leading-relaxed text-[#2B2B2B] font-medium">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover border-2 border-white" />
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A2E]">{t.name}</p>
                  <p className="text-[11px] text-[#8A8A8A]">{t.role}</p>
                </div>
              </div>
            </div>

            {/* Dots + arrows */}
            <div className="mt-3 flex items-center gap-2 justify-between px-1">
              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-2 rounded-full transition-all duration-200 ${i === idx ? "w-5 bg-white" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1A1A2E] transition hover:bg-white shadow-sm">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={next} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1A1A2E] transition hover:bg-white shadow-sm">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}