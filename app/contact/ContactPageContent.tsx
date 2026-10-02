"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Mail, Handshake, AlertTriangle, Clock, ArrowRight, Send, ChevronDown, Users } from "lucide-react"

export default function ContactPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setFullName(""); setEmail(""); setSubject(""); setMessage("")
  }

  const inputCls = "w-full rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-[13px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] placeholder:text-gray-400"

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Sidebar />
      <div className="lg:ml-24">
        <Topbar />
        <section className="px-5 py-8 sm:px-8 lg:px-10">

          {/* Breadcrumb */}
          <p className="mb-4 text-[12px] text-gray-500">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-1.5 text-gray-400">›</span>
            Contact
          </p>

          {/* Hero row */}
          <div className="flex items-start justify-between">
            <div className="max-w-xl">
              <h1 className="text-[42px] font-black leading-tight tracking-tight text-gray-900">
                Let&apos;s <span className="text-[#0066FF]">connect.</span>
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
                Have a question, partnership idea, or need help finding an opportunity?<br />We&apos;re here to help.
              </p>
            </div>
            {/* Globe illustration */}
            <div className="relative hidden lg:block">
              <Image src="/contact-globe.jpg" alt="Globe" width={340} height={240} className="h-auto w-[320px] rounded-2xl object-contain" />
              <div
                className="absolute bottom-4 right-4 -rotate-[8deg] text-[18px] leading-tight text-gray-800"
                style={{ fontFamily: "'Caveat','Comic Sans MS',cursive" }}
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

                <button type="submit" className="flex items-center gap-2 rounded-[10px] bg-[#0066FF] px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0055e6]">
                  <Send className="h-4 w-4" /> Send Message <ArrowRight className="h-4 w-4" />
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
                    { icon: <Mail className="h-5 w-5 text-[#0066FF]" />, bg: "bg-blue-50", title: "General Support", sub: "For any general queries or help.", email: "support@gonnaglobal.com" },
                    { icon: <Handshake className="h-5 w-5 text-[#B8A08A]" />, bg: "bg-amber-50", title: "Partnerships", sub: "For collaborations, institutional tie-ups or partnership opportunities.", email: "partnerships@gonnaglobal.com" },
                    { icon: <AlertTriangle className="h-5 w-5 text-green-600" />, bg: "bg-green-50", title: "Report an Issue", sub: "Found a bug or something not working? Let us know.", email: "tech@gonnaglobal.com" },
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
          <div className="mt-5 grid grid-cols-2 gap-5">
            <div className="flex items-center gap-4 rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-blue-50">
                <span className="text-[20px]">❓</span>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-gray-900">Frequently Asked Questions</p>
                <p className="text-[12px] text-gray-500">Find quick answers to common questions about Gonn&apos;a Global, opportunities, applications and more.</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#0066FF]" />
            </div>

            <div className="flex items-center gap-4 rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-blue-50">
                <Users className="h-5 w-5 text-[#0066FF]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-gray-900">Join Our Community</p>
                <p className="text-[12px] text-gray-500">Stay updated with the latest opportunities and announcements.</p>
              </div>
              <div className="flex items-center gap-2">
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                {/* X/Twitter */}
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.213 5.567 5.951-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF0000] text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

        </section>
      </div>
    </main>
  )
}

