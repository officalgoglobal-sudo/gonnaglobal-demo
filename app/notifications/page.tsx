"use client"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Bell, Briefcase, Calendar, Users, FileText, Settings, ChevronRight, CheckCircle } from "lucide-react"


const CATEGORIES = [
  { label: "All", count: 0, icon: Bell },
  { label: "Opportunities", count: 0, icon: Briefcase },
  { label: "Events", count: 0, icon: Calendar },
  { label: "Communities", count: 0, icon: Users },
  { label: "Application Updates", count: 0, icon: FileText },
  { label: "Mentorship", count: 0, icon: Users },
  { label: "System", count: 0, icon: Settings },
]

export default function NotificationsPage() {
  const [active, setActive] = useState("All")
const [allRead, setAllRead] = useState(false)
return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-[#FAFAFA] lg:ml-20">
        <Topbar />
        <main className="px-6 py-10 lg:px-12">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF3FF] to-[#DBEAFE] px-8 py-10">
        <div className="absolute right-8 top-4 opacity-20">
          <Bell className="h-40 w-40 text-[#2563EB]" strokeWidth={1} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-2">Notifications</p>
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} className="text-[36px] font-black text-[#1A1A2E] mb-1">
          Your Notifications
        </h1>
        <p className="text-[14px] text-[#6B6B6B]">Stay updated with the latest opportunities, events, and activities.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar categories */}
        <div className="space-y-1">
          {CATEGORIES.map(({ label, count, icon: Icon }) => (
            <button
              key={label}
             onClick={() => setActive(label)}
aria-pressed={active === label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                active === label ? "bg-[#EEF3FF] text-[#2563EB]" : "text-[#5A5A6A] hover:bg-[#F4F4F4]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-[13.5px] font-medium">{label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active === label ? "bg-[#2563EB] text-white" : "bg-[#EAEAEA] text-[#888]"}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-2">
          {/* Mark all read */}
          <div className="flex justify-end mb-2">
            <button
  onClick={() => setAllRead(true)}
  disabled={allRead}
  className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-4 py-2 text-[12.5px] font-semibold text-[#2563EB] hover:bg-[#EEF3FF] transition disabled:cursor-default disabled:opacity-60"
>
  <CheckCircle className="h-3.5 w-3.5" />
  {allRead ? "All caught up" : "Mark all as read"}
</button>
          </div>

          <div className="rounded-2xl border border-dashed border-[#DADDE5] bg-white px-6 py-16 text-center">
  <Bell className="mx-auto mb-4 h-10 w-10 text-[#A0A8B8]" />
  <h2 className="text-lg font-bold text-[#1A1A2E]">
  {active === "All" ? "No notifications yet" : `No ${active.toLowerCase()} notifications`}
</h2>
<p className="mt-2 text-sm text-[#8A8A8A]">
  {active === "All"
    ? "Your updates will appear here when you receive them."
    : `Your ${active.toLowerCase()} updates will appear here when you receive them.`}
</p>
</div>
        </div>
      </div>
            </main>
      </div>
    </>
  )
}