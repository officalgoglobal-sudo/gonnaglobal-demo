"use client"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { CalendarDays, Users, Share2, Globe } from "lucide-react"

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />
        <section className="flex flex-col items-center justify-center px-5 py-16 sm:px-8 lg:px-12 text-center min-h-[calc(100vh-60px)]">

          {/* Illustration */}
          <div className="relative mx-auto mb-10 w-full max-w-[480px]">
            {/* Cloud background */}
            <div className="absolute inset-0 rounded-full bg-[#EEF3FF] blur-[60px] opacity-70" />
            <div className="relative flex items-center justify-center">
              {/* Calendar SVG illustration */}
              <svg viewBox="0 0 480 360" className="w-full max-w-[420px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background clouds */}
                <ellipse cx="240" cy="280" rx="200" ry="60" fill="#EEF4FF" opacity="0.7"/>
                <ellipse cx="120" cy="240" rx="80" ry="40" fill="#E8F0FF" opacity="0.5"/>
                <ellipse cx="360" cy="250" rx="90" ry="40" fill="#E8F0FF" opacity="0.5"/>

                {/* Books stack */}
                <rect x="340" y="220" width="90" height="18" rx="4" fill="#D97706"/>
                <rect x="345" y="205" width="82" height="18" rx="4" fill="#B45309"/>
                <rect x="338" y="190" width="94" height="18" rx="4" fill="#92400E"/>

                {/* Globe */}
                <circle cx="360" cy="240" r="35" fill="#3B82F6" opacity="0.9"/>
                <ellipse cx="360" cy="240" rx="35" ry="18" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                <line x1="360" y1="205" x2="360" y2="275" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                <ellipse cx="360" cy="240" rx="18" ry="35" stroke="white" strokeWidth="1.5" opacity="0.5"/>

                {/* Paper plane */}
                <path d="M390 60L430 80L390 95L385 75Z" fill="#60A5FA"/>
                <path d="M390 95L400 110L430 80L390 95Z" fill="#3B82F6"/>
                {/* Dashed trail */}
                <path d="M390 80 Q350 100 320 140 Q300 160 280 190" stroke="#93C5FD" strokeWidth="2" strokeDasharray="6 4" fill="none"/>

                {/* Calendar body */}
                <rect x="140" y="100" width="200" height="200" rx="16" fill="#2563EB"/>
                {/* Calendar top */}
                <rect x="140" y="100" width="200" height="50" rx="16" fill="#1D4ED8"/>
                <rect x="140" y="130" width="200" height="20" fill="#1D4ED8"/>

                {/* Calendar rings */}
                <rect x="185" y="85" width="14" height="30" rx="7" fill="#93C5FD"/>
                <rect x="285" y="85" width="14" height="30" rx="7" fill="#93C5FD"/>

                {/* Calendar grid */}
                {[0,1,2,3,4,5].map((col) =>
                  [0,1,2].map((row) => (
                    <rect
                      key={`${col}-${row}`}
                      x={155 + col * 31}
                      y={165 + row * 40}
                      width="22"
                      height="22"
                      rx="5"
                      fill={col === 3 && row === 1 ? "#FFFFFF" : "rgba(255,255,255,0.2)"}
                    />
                  ))
                )}

                {/* Star on featured cell */}
                <text x="237" y="194" textAnchor="middle" fill="#2563EB" fontSize="14" fontWeight="bold">★</text>

                {/* Shine sparkles */}
                <path d="M115 120 L120 130 L115 140 L110 130Z" fill="#60A5FA" opacity="0.8"/>
                <path d="M365 110 L370 118 L365 126 L360 118Z" fill="#93C5FD" opacity="0.7"/>
              </svg>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A2E] sm:text-5xl">
            Events Coming Soon
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.75] text-[#687995]">
            We're curating global events, webinars, workshops, and networking sessions<br />
            to help you learn, connect, and grow.
          </p>

          {/* Feature icons */}
          <div className="mt-12 flex flex-wrap items-start justify-center gap-8 sm:gap-14">
            {[
              { icon: CalendarDays, color: "#DBEAFE", iconColor: "#2563EB", label: "Global Webinars", sub: "Learn from industry experts" },
              { icon: Users, color: "#D1FAE5", iconColor: "#059669", label: "Workshops", sub: "Gain new skills" },
              { icon: Share2, color: "#EDE9FE", iconColor: "#7C3AED", label: "Networking Events", sub: "Connect with peers & mentors" },
              { icon: Globe, color: "#FEF3C7", iconColor: "#D97706", label: "Campus Events", sub: "Discover local & global events" },
            ].map(({ icon: Icon, color, iconColor, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center w-[130px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
                  <Icon className="h-6 w-6" style={{ color: iconColor }} />
                </div>
                <p className="text-[14px] font-semibold text-[#1A1A2E]">{label}</p>
                <p className="text-[12px] text-[#687995]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Stay tuned banner */}
          <div className="mt-12 flex items-center gap-4 rounded-2xl bg-[#F0F5FF] border border-[#DBEAFE] px-6 py-4 max-w-md w-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-[#1A1A2E]">Stay Tuned</p>
              <p className="text-[13px] text-[#687995]">We'll notify you as soon as events go live.</p>
            </div>
          </div>

        </section>
      </div>
    </main>
  )
}