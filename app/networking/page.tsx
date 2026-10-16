"use client"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Users, Globe, MessageCircle, Share2, UserPlus } from "lucide-react"

export default function NetworkingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />
        <section className="flex flex-col items-center justify-center px-8 py-16 text-center min-h-[calc(100vh-60px)]">

          {/* Illustration */}
          <div className="relative mx-auto mb-10 w-full max-w-[420px]">
            <div className="absolute inset-0 rounded-full bg-[#EEF4FF] blur-[60px] opacity-60" />
            <svg viewBox="0 0 420 280" className="relative w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background shapes */}
              <ellipse cx="210" cy="240" rx="180" ry="50" fill="#EEF4FF" opacity="0.7"/>

              {/* Central hub */}
              <circle cx="210" cy="130" r="38" fill="#DBEAFE" />
              <circle cx="210" cy="130" r="26" fill="#93C5FD" />
              <circle cx="210" cy="130" r="14" fill="#2563EB" />

              {/* Person icons around the hub */}
              {/* Top left person */}
              <circle cx="90" cy="80" r="22" fill="#EDE9FE" />
              <circle cx="90" cy="72" r="10" fill="#7C3AED" />
              <path d="M68 100 Q90 88 112 100" stroke="#7C3AED" strokeWidth="3" fill="none"/>
              {/* Connection line */}
              <line x1="112" y1="90" x2="180" y2="120" stroke="#DBEAFE" strokeWidth="2" strokeDasharray="5 3"/>

              {/* Top right person */}
              <circle cx="330" cy="80" r="22" fill="#D1FAE5" />
              <circle cx="330" cy="72" r="10" fill="#059669" />
              <path d="M308 100 Q330 88 352 100" stroke="#059669" strokeWidth="3" fill="none"/>
              <line x1="308" y1="90" x2="240" y2="120" stroke="#DBEAFE" strokeWidth="2" strokeDasharray="5 3"/>

              {/* Left person */}
              <circle cx="60" cy="160" r="22" fill="#FCE7F3" />
              <circle cx="60" cy="152" r="10" fill="#DB2777" />
              <path d="M38 180 Q60 168 82 180" stroke="#DB2777" strokeWidth="3" fill="none"/>
              <line x1="82" y1="162" x2="172" y2="140" stroke="#DBEAFE" strokeWidth="2" strokeDasharray="5 3"/>

              {/* Right person */}
              <circle cx="360" cy="160" r="22" fill="#FEF3C7" />
              <circle cx="360" cy="152" r="10" fill="#D97706" />
              <path d="M338 180 Q360 168 382 180" stroke="#D97706" strokeWidth="3" fill="none"/>
              <line x1="338" y1="162" x2="248" y2="140" stroke="#DBEAFE" strokeWidth="2" strokeDasharray="5 3"/>

              {/* Bottom person */}
              <circle cx="210" cy="220" r="22" fill="#FEE2E2" />
              <circle cx="210" cy="212" r="10" fill="#EF4444" />
              <path d="M188 240 Q210 228 232 240" stroke="#EF4444" strokeWidth="3" fill="none"/>
              <line x1="210" y1="198" x2="210" y2="168" stroke="#DBEAFE" strokeWidth="2" strokeDasharray="5 3"/>

              {/* Sparkles */}
              <path d="M150 40 L154 52 L150 64 L146 52Z" fill="#60A5FA" opacity="0.7"/>
              <path d="M275 50 L278 59 L275 68 L272 59Z" fill="#93C5FD" opacity="0.6"/>
              <path d="M380 110 L383 118 L380 126 L377 118Z" fill="#A5B4FC" opacity="0.6"/>
            </svg>
          </div>

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-4">Networking</p>

          {/* Heading */}
          <h1 className="text-[44px] font-black text-[#1A1A2E] leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            Coming Soon
          </h1>
          <h2 className="mt-2 text-[18px] font-semibold text-[#6B6B6B]">Under Construction</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#888]">
            We&apos;re building something great. The Networking section will let you connect with students, mentors, and professionals globally. Stay tuned!
          </p>

          {/* Feature icons */}
          <div className="mt-12 flex flex-wrap items-start justify-center gap-8 sm:gap-14">
            {[
              { icon: Users, bg: "#DBEAFE", ic: "#2563EB", label: "Find Peers", sub: "Connect with students globally" },
              { icon: UserPlus, bg: "#D1FAE5", ic: "#059669", label: "Follow Mentors", sub: "Learn from the best" },
              { icon: MessageCircle, bg: "#EDE9FE", ic: "#7C3AED", label: "Community Chat", sub: "Join interest groups" },
              { icon: Share2, bg: "#FEF3C7", ic: "#D97706", label: "Share Opportunities", sub: "Help others grow too" },
            ].map(({ icon: Icon, bg, ic, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center w-[130px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: bg }}>
                  <Icon className="h-6 w-6" style={{ color: ic }} />
                </div>
                <p className="text-[14px] font-semibold text-[#1A1A2E]">{label}</p>
                <p className="text-[12px] text-[#687995]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Stay tuned */}
          <div className="mt-12 flex items-center gap-4 rounded-2xl bg-[#F0F5FF] border border-[#DBEAFE] px-6 py-4 max-w-md w-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]">
              <Globe className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-[#1A1A2E]">Stay Tuned</p>
              <p className="text-[13px] text-[#687995]">We&apos;ll notify you as soon as Networking goes live.</p>
            </div>
          </div>

        </section>
      </div>
    </main>
  )
}