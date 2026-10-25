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
const [popup, setPopup] = useState({ show: false, title: "", message: "", type: "success" })

  const handleSubscribe = async () => {
    if (!email.trim()) return
    setLoading(true)
    try {
      const clean = email.trim().toLowerCase()
      const ref = doc(db, "newsletterSubscribers", clean)
      const existing = await getDoc(ref)
      if (existing.exists()) {
  setPopup({
    show: true,
    title: "You're already on the list! 💙",
    message: "This email is already subscribed. Keep an eye out for new opportunities!",
    type: "info",
  })
  setLoading(false)
  return
}
      await setDoc(ref, { email: clean, createdAt: serverTimestamp() })
      setSuccess(true)
setEmail("")
setPopup({
  show: true,
  title: "You're subscribed! 🎉",
  message: "You'll be the first to hear about new scholarships, events and internships.",
  type: "success",
})
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
            <div className="mt-6 flex w-full items-center gap-3 rounded-[16px] border border-[#D0DCF5] bg-white px-4 py-3 pr-6 shadow-sm">
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
            

<div className="absolute left-60 top-[-25] flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#EEF3FF] bg-white shadow-lg">


              <span className="text-[22px]">🔔</span>
            </div>

           <div className="flex w-1/2 flex-col gap-3 ml-auto mr-25">
              {ALERT_CARDS.map((card) => (
                <div
                  key={card.title}
                  
className="flex items-center gap-3 rounded-[16px] border border-[#D8E6FF] bg-white px-4 py-3 shadow-sm"

                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${card.iconBg}`}>

                    <card.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-[#1A1A2E]">{card.title}</p>
                    <p className="text-[11.5px] text-[#8A8A8A]">{card.sub}</p>
                  </div>
                  
                </div>
              ))}
            </div>

            
{/* Notification reminder */}

<p
  className="mt-4 mr-25 w-1/2 ml-auto text-left text-[13px] font-semibold italic text-[#2563EB] opacity-80 leading-relaxed"
  style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
>
  🔔 Don&apos;t miss out!<br />
  Keep notifications on for the latest<br />
  Opportunities.
</p>


          </div>

        </div>
      </div>
  
      {popup.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-blue-100 bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              {popup.type === "success" ? "🎉" : "💙"}
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E]">
              {popup.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6B6B7A]">
              {popup.message}
            </p>
            <button
              onClick={() => setPopup({ show: false, title: "", message: "", type: "success" })}
              className="mt-6 w-full rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Got it 💙
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
