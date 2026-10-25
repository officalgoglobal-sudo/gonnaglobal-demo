"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Footer from "@/components/home/Footer"
import { Mail, Handshake, AlertTriangle, Clock, ArrowRight, Send, ChevronDown, Users } from "lucide-react"

export default function ContactPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState("")

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return

    setSending(true)
    setSendError("")
    setSent(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, subject, message }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Could not send your message.")
      }

      setSent(true)
      setFullName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Unable to send your message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const inputCls = "w-full rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-[13px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] placeholder:text-gray-400"

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Sidebar />
      <div className="lg:ml-24">
        <Topbar />
        <section className="px-5 py-8 sm:px-8 lg:px-10">

          {/* Hero — full-width image background */}
          <div className="relative overflow-hidden rounded-[20px] shadow-sm" style={{ minHeight: "240px" }}>
            {/* Background photo — clean Florence panorama, no baked-in text */}
            <img
              src="/login-bg.jpg"
              alt="Contact background"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 35%" }}
            />
            {/* Strong gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Content over image */}
            <div className="relative z-10 flex items-center justify-between px-8 py-10 sm:px-10 sm:py-12">
              <div className="max-w-xl">
                {/* Eyebrow */}
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Contact Us</p>
                <h1 className="text-[38px] font-black leading-tight tracking-tight text-white sm:text-[46px]" style={{ fontFamily: "Georgia, serif" }}>
                  Let&apos;s <span className="text-[#60a5fa]">connect.</span>
                </h1>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/75">
                  Have a question, partnership idea, or need help finding an opportunity? We&apos;re here to help.
                </p>
              </div>
              {/* Handwritten note — right side */}
              <div
                className="hidden lg:block -rotate-[6deg] text-[24px] leading-snug text-white/85 mr-8"
                style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                A global<br />you tomorrow.
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]">

            {/* LEFT — form */}
            <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-blue-50">
                  <Mail className="h-5 w-5 text-[#0066FF]" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-gray-900">Send us a message</h2>
                  <p className="text-[12px] text-gray-500">Fill in the details below and we&apos;ll get back to you soon.</p>
                </div>
              </div>

              {sendError && (
                <div role="alert" className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                  {sendError}
                </div>
              )}

              {sent && (
                <div className="mb-4 rounded-[10px] bg-green-50 border border-green-200 px-4 py-3 text-[13px] font-medium text-green-700">
                  ✅ Message sent! We&apos;ll get back to you within 1–2 business days.
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-4">
                {/* Full Name + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" required className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select value={subject} onChange={e => setSubject(e.target.value)} required className={`${inputCls} appearance-none pr-9`}>
                      <option value="">Select a subject</option>
                      <option>General Inquiry</option>
                      <option>Partnership Opportunity</option>
                      <option>Report an Issue</option>
                      <option>Feature Request</option>
                      <option>Press & Media</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-700">Message <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value.slice(0, 1000))}
                      placeholder="Write your message here..."
                      rows={5}
                      required
                      className={`${inputCls} resize-none`}
                    />
                    <span className="absolute bottom-2.5 right-3 text-[11px] text-gray-400">{message.length}/1000</span>
                  </div>
                </div>

                <button type="submit" disabled={sending} className="flex items-center gap-2 rounded-[10px] bg-[#0066FF] px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0055e6] disabled:cursor-not-allowed disabled:opacity-60">
                  <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Message"} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* RIGHT — get in touch */}
            <div className="space-y-3">
              <div className="rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-[16px] font-bold text-gray-900">Get in touch directly</h2>
                <p className="mt-1 text-[12px] text-gray-500">You can also reach us through the following channels.</p>

                <div className="mt-4 space-y-3">
                  {[
                    { icon: <Mail className="h-5 w-5 text-[#0066FF]" />, bg: "bg-blue-50", title: "General Support", sub: "For any general queries or help.", email: "official@gonnaglobal.com" },
                    { icon: <Handshake className="h-5 w-5 text-[#B8A08A]" />, bg: "bg-amber-50", title: "Partnerships", sub: "For collaborations, institutional tie-ups or partnership opportunities.", email: "official@gonnaglobal.com" },
                    { icon: <AlertTriangle className="h-5 w-5 text-green-600" />, bg: "bg-green-50", title: "Report an Issue", sub: "Found a bug or something not working? Let us know.", email: "official@gonnaglobal.com" },
                  ].map(({ icon, bg, title, sub, email }) => (
                    <div key={title} className="flex items-start gap-3 rounded-[10px] border border-gray-100 p-3 transition hover:border-blue-100 hover:bg-gray-50">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] ${bg}`}>{icon}</div>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-gray-900">{title}</p>
                        <p className="mt-0.5 text-[11px] text-gray-500">{sub}</p>
                        <a href={`mailto:${email}`} className="mt-1 block text-[12px] font-medium text-[#0066FF] hover:underline">{email}</a>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300" />
                    </div>
                  ))}
                </div>

                {/* Response time */}
                <div className="mt-3 flex items-center gap-2.5 rounded-[10px] bg-blue-50 px-4 py-3">
                  <Clock className="h-4 w-4 shrink-0 text-[#0066FF]" />
                  <p className="text-[12px] text-gray-700">
                    <span className="font-semibold">We usually respond within 1–2 business days.</span><br />
                    For urgent matters, please mention it in the subject.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-5 grid grid-cols-1"><Link href="/faq" className="flex items-center gap-4 rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-blue-50">
                <span className="text-[20px]">❓</span>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-gray-900">Frequently Asked Questions</p>
                <p className="text-[12px] text-gray-500">Find quick answers to common questions about Gonn&apos;a Global, opportunities, applications and more.</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#0066FF]" />
            </Link></div>

        </section>
        <div className="-mx-5 sm:-mx-8 lg:-mx-10">
          <Footer />
        </div>
      </div>
    </main>
  )
}

