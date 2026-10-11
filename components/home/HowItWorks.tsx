"use client"
import { Search, BookOpen, FileText, Users, Rocket, ArrowRight } from "lucide-react"

const STEPS = [
  {
    num: "01",
    numColor: "#2563EB",
    Icon: Search,
    iconColor: "#2563EB",
    iconBg: "#EEF3FF",
    title: "Explore Opportunities",
    desc: "Browse scholarships, internships, fellowships, conferences and more from across the world.",
    // Mini illustration hint
    preview: "search",
  },
  {
    num: "02",
    numColor: "#F97316",
    Icon: BookOpen,
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
    title: "Learn & Compare",
    desc: "View details, eligibility, deadlines and compare multiple opportunities easily.",
    preview: "compare",
  },
  {
    num: "03",
    numColor: "#8B5CF6",
    Icon: FileText,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    title: "Apply with Confidence",
    desc: "Get step-by-step guidance, required documents and tips to create a strong application.",
    preview: "apply",
  },
  {
    num: "04",
    numColor: "#EC4899",
    Icon: Users,
    iconColor: "#EC4899",
    iconBg: "#FDF2F8",
    title: "Connect & Learn",
    desc: "Interact with global peers, join communities and learn from expert mentors.",
    preview: "connect",
  },
  {
    num: "05",
    numColor: "#F59E0B",
    Icon: Rocket,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    title: "Achieve & Grow",
    desc: "Track your applications, receive updates and take the next step towards your global future.",
    preview: "achieve",
  },
]

// Mini card previews matching the reference illustrations
function MiniPreview({ type }: { type: string }) {
  if (type === "search") return (
    <div className="mt-auto space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1.5 text-[10px] text-[#888]">
        <Search className="h-3 w-3" /> Search opportunities...
        <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-md bg-[#2563EB]">
          <ArrowRight className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
      {["", ""].map((_, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white p-2">
          <div className="h-8 w-8 rounded-md bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-full rounded-full bg-gray-100" />
            <div className="h-2 w-2/3 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
  if (type === "compare") return (
    <div className="mt-auto space-y-2">
      {[GradCap, CalIcon, PinIcon].map((Icon, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white p-2">
          <Icon className="h-3.5 w-3.5 text-[#F97316]" />
          <div className="flex-1 space-y-1">
            <div className="h-2 rounded-full bg-gray-100" style={{ width: `${75 - i * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
  if (type === "apply") return (
    <div className="mt-auto rounded-xl border border-[#E5E5E5] bg-white p-3 space-y-2">
      <p className="text-[10px] font-semibold text-[#1A1A2E]">Your Application</p>
      {[80, 60, 90, 70].map((w, i) => <div key={i} className="h-2 rounded-full bg-gray-100" style={{ width: `${w}%` }} />)}
      <div className="mt-2 rounded-lg bg-[#2563EB] py-1.5 text-center text-[10px] font-semibold text-white">Submit Application</div>
    </div>
  )
  if (type === "connect") return (
    <div className="mt-auto flex items-center justify-center py-2">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {[
          { top: "0", left: "50%", img: "https://i.pravatar.cc/30?img=1" },
          { top: "50%", left: "0", img: "https://i.pravatar.cc/30?img=2" },
          { top: "50%", left: "100%", img: "https://i.pravatar.cc/30?img=3" },
          { top: "100%", left: "50%", img: "https://i.pravatar.cc/30?img=4" },
        ].map((p, i) => (
          <img
            key={i}
            src={p.img}
            className="absolute h-7 w-7 rounded-full border-2 border-white object-cover"
            style={{ top: p.top, left: p.left, transform: "translate(-50%, -50%)" }}
          />
        ))}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white text-[8px]">💬</div>
      </div>
    </div>
  )
  // achieve
  return (
    <div className="mt-auto space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white p-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
          <span className="text-[10px] text-white">✓</span>
        </div>
        <p className="text-[10px] font-medium text-[#1A1A2E]">Application Submitted!</p>
      </div>
      <div className="flex items-center gap-1.5 px-1">
        {[true, true, false, true].map((done, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${done ? "bg-[#2563EB]" : "bg-gray-200"}`} />
        ))}
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-[8px] text-white">🌐</div>
      </div>
    </div>
  )
}

function GradCap(props: any) {
  return <BookOpen {...props} />
}
function CalIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function PinIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function HowItWorks() {
  return (
    <section className="bg-white px-5 py-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] bg-[#EEF3FF] px-6 py-10 lg:px-10 lg:py-12">

        {/* Dotted bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #2563EB 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2563EB]">Simple Steps. Global Possibilities.</p>
            <h2 className="mt-2 text-[36px] sm:text-[44px] font-black leading-tight tracking-tight text-[#1A1A2E]">
              How Gonn&apos;a Global <span className="text-[#2563EB]">Works</span>
            </h2>
            <p className="mt-2 text-[14px] text-[#5A5A6A]">Your journey to global opportunities, simplified.</p>
          </div>
          {/* Decorative handwriting */}
          <div className="hidden lg:block text-right mr-4 mt-2" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
            <p className="text-[14px] font-bold italic text-[#2563EB] leading-snug opacity-70">
              Explore<br />Apply<br />Learn<br />Grow
            </p>
            {/* Dashed curve arrow hint */}
            <div className="mt-1 text-[20px]">↗</div>
          </div>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="relative flex flex-col gap-3 rounded-[20px] bg-white p-5 shadow-sm border border-[#E8EFF8] min-h-[280px]"
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[13px] font-black rounded-full px-2 py-0.5"
                  style={{ color: step.numColor, backgroundColor: step.iconBg }}
                >
                  {step.num}
                </span>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: step.iconBg }}
                >
                  <step.Icon className="h-4.5 w-4.5" style={{ color: step.iconColor }} />
                </div>
              </div>

              {/* Title + desc */}
              <div>
                <h3 className="text-[14px] font-bold text-[#1A1A2E]">{step.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B6B6B]">{step.desc}</p>
              </div>

              {/* Mini preview illustration */}
              <MiniPreview type={step.preview} />

              {/* Arrow between steps */}
              {i < STEPS.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#E0E8F5] shadow-sm">
                  <ArrowRight className="h-3 w-3 text-[#A0B0C8]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}