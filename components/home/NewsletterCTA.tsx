"use client"
import { useState } from "react"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CheckCircle, ArrowRight, Mail, GraduationCap, Calendar, Briefcase } from "lucide-react"

const ALERT_CARDS = [
  {
    Icon: GraduationCap,
    iconBg: "bg-blue-50 text-blue-600",
    title: "New Scholarships",
    sub: "Top global scholarships just for you",
  },
  {
    Icon: Calendar,
    iconBg: "bg-red-50 text-red-500",
    title: "Upcoming Events",
    sub: "Conferences, webinars and more",
  },
  {
    Icon: Briefcase,
    iconBg: "bg-green-50 text-green-600",
    title: "Internship Alerts",
    sub: "Internships from leading organizations",
  },
]

export default function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {
    if (!email.trim()) return
    setLoading(true)
    try {
      const clean = email.trim().toLowerCase()
      const ref = doc(db, "newsletterSubscribers", clean)
      const existing = await getDoc(ref)
      if (existing.exists()) { alert("Email already subscribed."); setLoading(false); return }
      await setDoc(ref, { email: clean, createdAt: serverTimestamp() })
      setSuccess(true)
      setEmail("")
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <section className="bg-white px-5 py-6 lg:px-8">
      {/* Light blue rounded container — matches ref image 5 */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#EEF3FF] px-8 py-12 lg:px-12 lg:py-14">

        {/* Dotted world map bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #2563EB 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Subtle clouds/shape at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none opacity-20"
          style={{ background: "radial-gradient(ellipse at 50% 100%, #BFDBFE 0%, transparent 70%)" }}
        />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] items-center">

          {/* ── LEFT ── */}
          <div className="max-w-lg">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">
              Stay Ahead. Get Global Opportunities.
            </p>
            <h2 className="mt-3 text-[34px] sm:text-[40px] font-black leading-tight tracking-tight text-[#1A1A2E]">
              Stay Updated<br />
              with{" "}
              <span className="text-[#2563EB]">Gonn&apos;a Global</span>
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5A5A6A]">
              Get the latest scholarships, internships, events, and resources delivered straight to your inbox. No spam, just opportunities.
            </p>

            {/* Email form */}
            <div className="mt-6 flex w-full items-center gap-3 rounded-[16px] border border-[#D0DCF5] bg-white px-4 py-3 shadow-sm">
              <Mail className="h-4 w-4 shrink-0 text-[#ABABAB]" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 bg-transparent text-[13.5px] text-[#2B2B2B] outline-none placeholder:text-[#B0B0B0]"
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-full bg-[#2563EB] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50 shrink-0"
              >
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {success && (
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-green-600">
                <CheckCircle className="h-4 w-4" /> Successfully subscribed!
              </p>
            )}

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-5">
              {["Curated opportunities", "Weekly updates", "No spam, ever"].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-[12.5px] text-[#5A5A6A]">
                  <CheckCircle className="h-4 w-4 text-[#2563EB]" />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — alert cards ── */}
          <div className="relative">
            {/* Bell icon floating */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#EEF3FF] bg-white shadow-lg">
              <span className="text-[22px]">🔔</span>
            </div>

            <div className="flex flex-col gap-3 ml-8">
              {ALERT_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="flex items-center gap-4 rounded-[18px] border border-[#D8E6FF] bg-white px-4 py-4 shadow-sm"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${card.iconBg}`}>
                    <card.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-[#1A1A2E]">{card.title}</p>
                    <p className="text-[11.5px] text-[#8A8A8A]">{card.sub}</p>
                  </div>
                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8E6FF] bg-[#EEF3FF] transition hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]">
                    <ArrowRight className="h-3.5 w-3.5 text-[#2563EB] group-hover:text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Handwriting note */}
            <p
              className="mt-4 text-right text-[13px] font-semibold italic text-[#2563EB] opacity-70 leading-snug"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              Don&apos;t miss<br />opportunities<br />that can change<br />your future.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}