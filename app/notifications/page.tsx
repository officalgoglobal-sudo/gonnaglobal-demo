"use client"
import { useState } from "react"
import { Bell, Briefcase, Calendar, Users, FileText, Settings, ChevronRight, CheckCircle } from "lucide-react"

const CATEGORIES = [
  { label: "All", count: 12, icon: Bell },
  { label: "Opportunities", count: 4, icon: Briefcase },
  { label: "Events", count: 3, icon: Calendar },
  { label: "Communities", count: 2, icon: Users },
  { label: "Application Updates", count: 2, icon: FileText },
  { label: "Mentorship", count: 1, icon: Users },
  { label: "System", count: 1, icon: Settings },
]

const NOTIFICATIONS = [
  { id: 1, icon: Briefcase, iconBg: "bg-green-50 text-green-600", title: "New Scholarship Opportunity", tag: "New", desc: "The Global Excellence Scholarship 2026 is now open for applications. Don't miss this opportunity!", time: "", isNew: true },
  { id: 2, icon: Calendar, iconBg: "bg-red-50 text-red-500", title: "Upcoming Event", desc: "Webinar: Study in Germany - Admission Process and Scholarships. Registration is now open.", time: "5h ago", isNew: true },
  { id: 3, icon: Users, iconBg: "bg-purple-50 text-purple-600", title: "New Post in AI & Tech Community", desc: "Someone replied to your post: \"Best resources for learning Machine Learning\".", time: "1d ago", isNew: true },
  { id: 4, icon: FileText, iconBg: "bg-yellow-50 text-yellow-600", title: "Application Update", desc: "Your application for Global Summer Research Program has been shortlisted!", time: "2d ago", isNew: true },
  { id: 5, icon: Calendar, iconBg: "bg-red-50 text-red-500", title: "Event Reminder", desc: "Career Guidance Session starts in 2 hours. Don't forget to join!", time: "2d ago", isNew: false },
  { id: 6, icon: Users, iconBg: "bg-purple-50 text-purple-600", title: "New Community Member", desc: "A new member joined the International Students community.", time: "3d ago", isNew: false },
  { id: 7, icon: Settings, iconBg: "bg-gray-100 text-gray-500", title: "System Notification", desc: "We've updated our Terms of Service. Please review the changes.", time: "5d ago", isNew: false },
]

export default function NotificationsPage() {
  const [active, setActive] = useState("All")
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 lg:px-12">
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
            <button className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-4 py-2 text-[12.5px] font-semibold text-[#2563EB] hover:bg-[#EEF3FF] transition">
              <CheckCircle className="h-3.5 w-3.5" /> Mark all as read
            </button>
          </div>

          {NOTIFICATIONS.map(({ id, icon: Icon, iconBg, title, tag, desc, time, isNew }) => (
            <div key={id} className="flex items-start gap-4 rounded-2xl border border-[#EBEBEB] bg-white px-5 py-4 shadow-sm transition hover:shadow-md">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13.5px] font-bold text-[#1A1A2E]">{title}</p>
                  {tag && <span className="rounded-full bg-[#DBEAFE] px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB]">{tag}</span>}
                </div>
                <p className="mt-0.5 text-[12.5px] text-[#8A8A8A] leading-relaxed">{desc}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {time && <span className="text-[11.5px] text-[#B0B0B0]">{time}</span>}
                <div className={`h-2.5 w-2.5 rounded-full ${isNew ? "bg-[#2563EB]" : "border border-[#DEDED8]"}`} />
                <ChevronRight className="h-4 w-4 text-[#CCCCCC]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}