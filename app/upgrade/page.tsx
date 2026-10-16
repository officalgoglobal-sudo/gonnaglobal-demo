"use client"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Crown, Star, Zap, Globe, Shield, ArrowRight } from "lucide-react"

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />
        <section className="flex flex-col items-center justify-center px-8 py-16 text-center min-h-[calc(100vh-60px)]">

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-4">
            Upgrade Plan
          </p>

          {/* Heading */}
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            className="text-[36px] sm:text-[44px] font-black text-[#1A1A2E] text-center mb-2 max-w-2xl">
            More Opportunities. Greater Possibilities.
          </h1>
          <p className="text-[15px] text-[#6B6B6B] text-center mb-10 max-w-md">
            Unlock premium features to accelerate your global journey.
          </p>

          {/* Illustration */}
          <div className="flex items-center justify-center mb-10">
            <svg width="220" height="180" viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="20" width="160" height="130" rx="10" fill="#DBEAFE" />
              <rect x="50" y="20" width="160" height="28" rx="10" fill="#BFDBFE" />
              <circle cx="68" cy="34" r="5" fill="#93C5FD" />
              <circle cx="84" cy="34" r="5" fill="#93C5FD" />
              <circle cx="100" cy="34" r="5" fill="#93C5FD" />
              <polygon points="100,110 115,80 130,100 145,80 160,110" fill="#F59E0B" />
              <rect x="98" y="108" width="64" height="14" rx="3" fill="#D97706" />
              <circle cx="100" cy="110" r="5" fill="#FCD34D" />
              <circle cx="130" cy="102" r="5" fill="#FCD34D" />
              <circle cx="160" cy="110" r="5" fill="#FCD34D" />
              <rect x="72" y="150" width="60" height="32" rx="4" fill="#93C5FD" />
              <line x1="72" y1="158" x2="132" y2="158" stroke="white" strokeWidth="6" />
              <line x1="72" y1="172" x2="132" y2="172" stroke="white" strokeWidth="6" />
              <rect x="94" y="182" width="16" height="12" fill="#60A5FA" />
              <polygon points="168,182 196,182 182,138" fill="#93C5FD" />
              <rect x="162" y="182" width="40" height="8" rx="2" fill="#60A5FA" />
              <line x1="173" y1="166" x2="191" y2="166" stroke="white" strokeWidth="4" />
              <ellipse cx="52" cy="60" rx="24" ry="14" fill="#BFDBFE" opacity="0.7" />
              <ellipse cx="205" cy="75" rx="20" ry="12" fill="#BFDBFE" opacity="0.7" />
            </svg>
          </div>

          {/* Coming soon */}
          <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            className="text-[36px] font-black text-[#1A1A2E] text-center mb-2">
            Coming Soon
          </h2>
          <p className="text-[17px] font-semibold text-[#6B6B6B] text-center mb-3">Under Construction</p>
          <p className="text-[14px] text-[#888] text-center max-w-md leading-relaxed mb-12">
            We&apos;re working on an improved premium experience with exciting features, plans, and benefits. Stay tuned!
          </p>

          {/* Feature preview cards */}
          <div className="flex flex-wrap items-start justify-center gap-6 max-w-2xl">
            {[
              { icon: Zap, bg: "#FEF3C7", ic: "#D97706", label: "Priority Access", sub: "Get early access to top opportunities" },
              { icon: Globe, bg: "#DBEAFE", ic: "#2563EB", label: "Global Reach", sub: "Unlock worldwide listings" },
              { icon: Star, bg: "#EDE9FE", ic: "#7C3AED", label: "AI Recommendations", sub: "Smart personalized suggestions" },
              { icon: Shield, bg: "#D1FAE5", ic: "#059669", label: "Verified Badge", sub: "Stand out with a premium profile" },
            ].map(({ icon: Icon, bg, ic, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center w-[130px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: bg }}>
                  <Icon className="h-5 w-5" style={{ color: ic }} />
                </div>
                <p className="text-[13px] font-semibold text-[#1A1A2E]">{label}</p>
                <p className="text-[11px] text-[#687995]">{sub}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="mt-10 flex items-center gap-2 rounded-full bg-[#2563EB] px-7 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8] shadow-lg">
            <Crown className="h-4 w-4" /> Notify Me When It Launches <ArrowRight className="h-4 w-4" />
          </button>

        </section>
      </div>
    </main>
  )
}