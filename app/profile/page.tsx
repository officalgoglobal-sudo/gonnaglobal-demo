"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import {
  MapPin, Mail, Link2, Camera, Share2, ChevronDown,
  Pencil, Download, ExternalLink, Plus, CheckCircle2,
  Circle, FileText, Bookmark, CalendarDays, Users,
  ArrowRight
} from "lucide-react"

// ── Student Profile Sub-Component
function StudentProfileView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Overview")

  const completionItems = [
    { label: "Basic Information", done: true },
    { label: "Education Details", done: true },
    { label: "Interests (3/3)", done: true },
    { label: "Languages (2/2)", done: true },
    { label: "Add Skills", done: false },
    { label: "Add Resume", done: true },
  ]
  const completedCount = completionItems.filter(c => c.done).length
  const pct = Math.round((completedCount / completionItems.length) * 100)

  return (
    <div>
      {/* Cover photo */}
      <div className="relative h-[200px] overflow-hidden rounded-none bg-gradient-to-r from-sky-200 via-blue-300 to-blue-400 lg:rounded-t-none">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent" />
        {/* Overlay text */}
        <div className="absolute left-1/2 top-8 -translate-x-1/4 text-center">
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Explore</p>
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Learn</p>
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Grow</p>
        </div>
        <div className="absolute right-16 top-8 text-right text-white drop-shadow">
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Global Opportunities</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Brighter Futures</p>
          <svg viewBox="0 0 80 20" className="ml-auto w-16 mt-1">
            <path d="M5 15 Q40 3 75 10" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M65 6L75 10L68 17" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        {/* Edit cover */}
        <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[#1A1A2E] shadow hover:bg-white transition">
          <Camera className="h-3.5 w-3.5" /> Edit Cover
        </button>
      </div>

      {/* Profile info row */}
      <div className="relative bg-white px-6 pb-0 pt-0 border-b border-[#EBEBEB]">
        {/* Avatar */}
        <div className="absolute -top-14 left-6">
          <div className="relative h-[108px] w-[108px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            <img src={user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"} alt="Avatar" className="h-full w-full object-cover" />
            <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
              <Camera className="h-3.5 w-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        <div className="ml-[130px] flex flex-wrap items-start justify-between gap-4 pb-4 pt-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-bold text-[#1A1A2E]">{user?.fullName || "Krish Panwar"}</h1>
              <span className="text-[#2563EB]">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 15l-6.2 4.3 2.4-7.4L0 7.4h7.6z"/></svg>
              </span>
            </div>
            <p className="text-[13.5px] text-[#687995]">B.Tech IT Student &nbsp;|&nbsp; MIT Jaipur</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#687995]">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Jaipur, India</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user?.email || "krishpanwar@example.com"}</span>
              <span className="flex items-center gap-1"><Link2 className="h-3.5 w-3.5" /> linkedin.com/in/krishpanwar</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#1A1A2E] hover:border-[#2563EB] transition">
              <Users className="h-4 w-4" /> Student <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#1A1A2E] hover:border-[#2563EB] transition">
              <Share2 className="h-4 w-4" /> Share Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#EBEBEB]">
          {["Overview", "Details", "Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-medium transition ${activeTab === tab ? "border-b-2 border-[#2563EB] text-[#2563EB]" : "text-[#687995] hover:text-[#1A1A2E]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[240px_1fr_280px]">

        {/* LEFT — Profile Completion */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Profile Completion</h3>
            {/* Circle */}
            <div className="my-5 flex justify-center">
              <div className="relative h-[110px] w-[110px]">
                <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#F0F0F0" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#2563EB" strokeWidth="10"
                    strokeDasharray={`${(pct / 100) * 301.6} 301.6`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-bold text-[#1A1A2E]">{pct}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#687995] mb-4">{completedCount}/{completionItems.length} sections completed</p>
            <div className="space-y-2.5">
              {completionItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[13px]">
                  {item.done
                    ? <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                    : <Circle className="h-4 w-4 text-[#D0D0D0] shrink-0" />}
                  <span className={item.done ? "text-[#1A1A2E]" : "text-[#ABABAB]"}>{item.label}</span>
                </div>
              ))}
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition">
              Complete Your Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="space-y-5">
          {/* About Me */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">About Me</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB] hover:text-[#2563EB]" /></button>
            </div>
            <p className="text-[13.5px] leading-[1.7] text-[#687995]">
              I'm a Computer Science student passionate about technology, global opportunities, and building impactful solutions. I'm interested in AI, product development, and exploring international education and research opportunities.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Open to Internships", color: "bg-green-50 text-green-700 border-green-200" },
                { label: "Open to Study Abroad", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "Looking for Mentorship", color: "bg-purple-50 text-purple-700 border-purple-200" },
              ].map(({ label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium ${color}`}>
                  ✈ {label}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">My Interests</h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Plus className="h-3.5 w-3.5"/> Add Interest</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Artificial Intelligence", "Machine Learning", "Web Development", "Data Science", "Study Abroad", "Entrepreneurship"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12.5px] text-[#555]">
                  {tag} <span className="text-[#ABABAB] cursor-pointer hover:text-red-500">×</span>
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Education</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]" /></button>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1A1A2E] text-white text-[11px] font-bold">MI</div>
              <div>
                <p className="text-[14px] font-bold text-[#1A1A2E]">MIT Jaipur</p>
                <p className="text-[13px] text-[#687995]">B.Tech in Information Technology</p>
                <p className="text-[12px] text-[#ABABAB]">2024 – 2028 &nbsp;|&nbsp; Jaipur, India</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-[#F0F0F0] px-3 py-1 text-[12px] text-[#555]">CGPA: 8.5</span>
                  <span className="rounded-full bg-[#F0F0F0] px-3 py-1 text-[12px] text-[#555]">5th Semester</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Skills</h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Plus className="h-3.5 w-3.5"/> Add Skill</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Python", "Java", "Next.js", "React", "SQL", "Problem Solving", "Git", "Figma"].map((s) => (
                <span key={s} className="rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12.5px] text-[#555]">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Pencil, label: "Edit Profile", primary: true },
                { icon: Share2, label: "Share Profile" },
                { icon: Download, label: "Download Resume" },
                { icon: ExternalLink, label: "View Public Profile" },
              ].map(({ icon: Icon, label, primary }) => (
                <button key={label} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${primary ? "bg-[#EEF3FF] text-[#2563EB] hover:bg-[#DBEAFE]" : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Languages Known</h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Plus className="h-3.5 w-3.5"/> Add Language</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { flag: "🇬🇧", lang: "English", level: "Native" },
                { flag: "🇮🇳", lang: "Hindi", level: "Native" },
                { flag: "🇪🇸", lang: "Spanish", level: "Intermediate" },
                { flag: "🇫🇷", lang: "French", level: "Beginner" },
              ].map(({ flag, lang, level }) => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-[20px]">{flag}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A2E]">{lang}</p>
                    <p className="text-[11px] text-[#ABABAB]">{level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Recent Activity</h3>
              <button className="text-[12px] font-semibold text-[#2563EB] flex items-center gap-1">View All →</button>
            </div>
            <div className="space-y-4">
              {[
                { icon: FileText, color: "#DBEAFE", iconColor: "#2563EB", title: "Applied for AI Research Intern", sub: "Stanford University", time: "2 days ago" },
                { icon: Bookmark, color: "#D1FAE5", iconColor: "#059669", title: "Saved an opportunity", sub: "Google Summer of Code 2026", time: "3 days ago" },
                { icon: CalendarDays, color: "#EDE9FE", iconColor: "#7C3AED", title: "Registered for Event", sub: "Study in Canada Webinar", time: "5 days ago" },
                { icon: Users, color: "#FEF3C7", iconColor: "#D97706", title: "Joined Community", sub: "AI & ML Enthusiasts", time: "1 week ago" },
              ].map(({ icon: Icon, color, iconColor, title, sub, time }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: color }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1A1A2E] line-clamp-1">{title}</p>
                    <p className="text-[12px] text-[#687995]">{sub}</p>
                  </div>
                  <span className="text-[11px] text-[#ABABAB] shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">My Resume</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]" /></button>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#E0E0E0] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DBEAFE]">
                <FileText className="h-4 w-4 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A2E] truncate">Krish_Panwar_Resume.pdf</p>
                <p className="text-[11px] text-[#ABABAB]">Updated on 12 Sep 2026</p>
              </div>
              <button className="text-[#ABABAB] hover:text-[#555]">⋮</button>
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] py-2.5 text-[13px] font-semibold text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">
              <Download className="h-4 w-4" /> Update Resume
            </button>
          </div>

          {/* Career Goals */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Career Goals</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]" /></button>
            </div>
            <p className="text-[13px] leading-[1.7] text-[#687995]">
              I aim to pursue higher studies in AI and work on real-world applications that create social impact. I'm also interested in global internships and research opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Mentor Profile Sub-Component
function MentorProfileView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Overview")

  return (
    <div>
      {/* Cover */}
      <div className="relative h-[200px] overflow-hidden bg-gradient-to-r from-slate-300 to-blue-300">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80" alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/20" />
        <div className="absolute left-1/2 top-8 -translate-x-1/4 text-center">
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Empowering</p>
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Global Talent</p>
        </div>
        <div className="absolute right-16 top-8 text-right text-white drop-shadow">
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Mentor</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Guide</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Support</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Grow</p>
        </div>
        <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold shadow hover:bg-white transition">
          <Camera className="h-3.5 w-3.5" /> Edit Cover
        </button>
      </div>

      {/* Info row */}
      <div className="relative bg-white px-6 pb-0 border-b border-[#EBEBEB]">
        <div className="absolute -top-14 left-6">
          <div className="relative h-[108px] w-[108px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" alt="Avatar" className="h-full w-full object-cover" />
            <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
              <Camera className="h-3.5 w-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        <div className="ml-[130px] flex flex-wrap items-start justify-between gap-4 pb-4 pt-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-bold text-[#1A1A2E]">Rahul Mehta</h1>
              <span className="text-[#2563EB]">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 15l-6.2 4.3 2.4-7.4L0 7.4h7.6z"/></svg>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 text-[12px] font-semibold text-[#92400E]">
                🏅 Mentor
              </span>
            </div>
            <p className="text-[13.5px] text-[#687995]">Product Manager &nbsp;|&nbsp; Ex-Google &nbsp;|&nbsp; Career & Tech Mentor</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#687995]">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Bengaluru, India</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> rahul.mehta@example.com</span>
              <span className="flex items-center gap-1"><Link2 className="h-3.5 w-3.5" /> linkedin.com/in/rahulmehta</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#1A1A2E] hover:border-[#2563EB] transition">
              <Users className="h-4 w-4" /> Mentor <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#1A1A2E] hover:border-[#2563EB] transition">
              <Share2 className="h-4 w-4" /> Share Profile
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {["Overview", "Details", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-[14px] font-medium transition ${activeTab === tab ? "border-b-2 border-[#2563EB] text-[#2563EB]" : "text-[#687995] hover:text-[#1A1A2E]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[240px_1fr_280px]">
        {/* Left */}
        <div>
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Profile Completion</h3>
            <div className="my-5 flex justify-center">
              <div className="relative h-[110px] w-[110px]">
                <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#F0F0F0" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#2563EB" strokeWidth="10" strokeDasharray="254.5 301.6" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[22px] font-bold text-[#1A1A2E]">85%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#687995] mb-4">5/6 sections completed</p>
            <div className="space-y-2.5">
              {["Basic Information", "Professional Details", "Areas of Mentorship (4/4)", "Languages (2/2)", "Add Experience", "Add Website / Portfolio"].map((item, i) => (
                <div key={item} className="flex items-center gap-2 text-[13px]">
                  {i < 5 ? <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" /> : <Circle className="h-4 w-4 text-[#D0D0D0] shrink-0" />}
                  <span className={i < 5 ? "text-[#1A1A2E]" : "text-[#ABABAB]"}>{item}</span>
                </div>
              ))}
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition">
              Complete Your Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Middle */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">About Me</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]" /></button>
            </div>
            <p className="text-[13.5px] leading-[1.7] text-[#687995]">
              I'm a Product Manager at Google with 5+ years of experience in building scalable products. I'm passionate about mentoring students and early professionals in career growth, product management, and tech opportunities.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Career Guidance", "Industry Insights", "Resume Review", "Interview Preparation"].map((tag) => (
                <span key={tag} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[12px] font-medium text-green-700">✦ {tag}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Areas of Mentorship</h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Plus className="h-3.5 w-3.5"/> Add Area</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Product Management", "Career Guidance", "Resume Review", "Interview Preparation", "Tech Industry Insights", "Study Abroad Guidance"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12.5px] text-[#555]">
                  {tag} <span className="text-[#ABABAB] cursor-pointer hover:text-red-500">×</span>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Professional Experience</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]" /></button>
            </div>
            {[
              { company: "Google", logo: "🔵", role: "Product Manager", period: "2021 – Present | Bengaluru, India" },
              { company: "Microsoft", logo: "🟩", role: "Software Engineer", period: "2019 – 2021 | Hyderabad, India" },
            ].map(({ company, logo, role, period }) => (
              <div key={company} className="flex items-start gap-4 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E0E0E0] text-2xl">{logo}</div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A2E]">{role}</p>
                  <p className="text-[13px] text-[#687995]">{company}</p>
                  <p className="text-[12px] text-[#ABABAB]">{period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Pencil, label: "Edit Profile", primary: true },
                { icon: Share2, label: "Share Profile" },
                { icon: ExternalLink, label: "View Public Profile" },
                { icon: Download, label: "Download Resume" },
              ].map(({ icon: Icon, label, primary }) => (
                <button key={label} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${primary ? "bg-[#EEF3FF] text-[#2563EB]" : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Languages Known</h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Plus className="h-3.5 w-3.5"/>Add Language</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{flag:"🇬🇧",lang:"English",level:"Native"},{flag:"🇮🇳",lang:"Hindi",level:"Native"},{flag:"🇪🇸",lang:"Spanish",level:"Intermediate"},{flag:"🇫🇷",lang:"French",level:"Beginner"}].map(({flag,lang,level})=>(
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-[20px]">{flag}</span>
                  <div><p className="text-[13px] font-semibold text-[#1A1A2E]">{lang}</p><p className="text-[11px] text-[#ABABAB]">{level}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Recent Activity</h3>
              <button className="text-[12px] font-semibold text-[#2563EB]">View All →</button>
            </div>
            <div className="space-y-4">
              {[
                {icon:Users,color:"#DBEAFE",ic:"#2563EB",title:"Mentored a student",sub:"Career guidance session",time:"2 days ago"},
                {icon:FileText,color:"#D1FAE5",ic:"#059669",title:"Published a resource",sub:"Resume Building Guide",time:"4 days ago"},
                {icon:Users,color:"#EDE9FE",ic:"#7C3AED",title:"Joined Community",sub:"Product Management",time:"1 week ago"},
                {icon:FileText,color:"#FEF3C7",ic:"#D97706",title:"Updated Profile",sub:"Added new mentorship areas",time:"1 week ago"},
              ].map(({icon:Icon,color,ic,title,sub,time})=>(
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{backgroundColor:color}}>
                    <Icon className="h-4 w-4" style={{color:ic}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1A1A2E] line-clamp-1">{title}</p>
                    <p className="text-[12px] text-[#687995]">{sub}</p>
                  </div>
                  <span className="text-[11px] text-[#ABABAB] shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Education</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1A1A2E] text-white text-[11px] font-bold">IIT</div>
              <div>
                <p className="text-[14px] font-bold text-[#1A1A2E]">IIT Bombay</p>
                <p className="text-[13px] text-[#687995]">B.Tech in Computer Science</p>
                <p className="text-[12px] text-[#ABABAB]">2015 – 2019 | Mumbai, India</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">My Resume</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#E0E0E0] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DBEAFE]">
                <FileText className="h-4 w-4 text-[#2563EB]"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A2E]">Rahul_Mehta_Resume.pdf</p>
                <p className="text-[11px] text-[#ABABAB]">Updated on 15 Aug 2026</p>
              </div>
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] py-2.5 text-[13px] font-semibold text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">
              <Download className="h-4 w-4"/> Update Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Institution Profile Sub-Component
function InstitutionProfileView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Overview")

  return (
    <div>
      {/* Cover */}
      <div className="relative h-[200px] overflow-hidden bg-gradient-to-r from-green-200 to-teal-300">
        <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1400&q=80" alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute left-10 top-8 text-white">
          <p className="text-[28px] font-bold drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Shaping</p>
          <p className="text-[28px] font-bold drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Global Citizens</p>
        </div>
        <div className="absolute right-16 top-8 text-right text-white drop-shadow">
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Education</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Research</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Impact</p>
        </div>
        <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold shadow hover:bg-white transition">
          <Camera className="h-3.5 w-3.5" /> Edit Cover
        </button>
      </div>

      {/* Info row */}
      <div className="relative bg-white px-6 pb-0 border-b border-[#EBEBEB]">
        <div className="absolute -top-14 left-6">
          <div className="relative h-[108px] w-[108px] rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-[10px] font-bold text-red-600">🔴</div>
                <div className="text-[11px] font-bold text-[#1A1A2E]">MI</div>
                <div className="text-[9px] text-[#687995]">MANIPAL</div>
              </div>
            </div>
            <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
              <Camera className="h-3.5 w-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        <div className="ml-[130px] flex flex-wrap items-start justify-between gap-4 pb-4 pt-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#1A1A2E]">Manipal Institute of Technology</h1>
              <span className="text-[#2563EB]">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 15l-6.2 4.3 2.4-7.4L0 7.4h7.6z"/></svg>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 text-[12px] font-semibold text-[#92400E]">
                🏛 Institution
              </span>
            </div>
            <p className="text-[13.5px] text-[#687995]">Excellence in Education. Innovation for a Better Tomorrow.</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#687995]">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> Jaipur, India</span>
              <span className="flex items-center gap-1">🔗 https://www.manipal.edu</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5"/> admissions@manipal.edu</span>
              <span className="flex items-center gap-1"><Link2 className="h-3.5 w-3.5"/> linkedin.com/school/mit</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#1A1A2E] hover:border-[#2563EB] transition">
              🏛 Institution <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#1A1A2E] hover:border-[#2563EB] transition">
              <Share2 className="h-4 w-4" /> Share Profile
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {["Overview", "Details", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-[14px] font-medium transition ${activeTab === tab ? "border-b-2 border-[#2563EB] text-[#2563EB]" : "text-[#687995] hover:text-[#1A1A2E]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[240px_1fr_280px]">
        {/* Left */}
        <div>
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Profile Completion</h3>
            <div className="my-5 flex justify-center">
              <div className="relative h-[110px] w-[110px]">
                <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#F0F0F0" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#2563EB" strokeWidth="10" strokeDasharray="247.3 301.6" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[22px] font-bold text-[#1A1A2E]">82%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#687995] mb-4">5/6 sections completed</p>
            <div className="space-y-2.5">
              {[
                {label:"Basic Information",done:true},
                {label:"Institution Details",done:true},
                {label:"Programs Offered (4/4)",done:true},
                {label:"Location & Website",done:true},
                {label:"Social Links (3/3)",done:true},
                {label:"Add Brochure / Media",done:false},
              ].map(({label,done})=>(
                <div key={label} className="flex items-center gap-2 text-[13px]">
                  {done?<CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0"/>:<Circle className="h-4 w-4 text-[#D0D0D0] shrink-0"/>}
                  <span className={done?"text-[#1A1A2E]":"text-[#ABABAB]"}>{label}</span>
                </div>
              ))}
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition">
              Complete Your Profile <ArrowRight className="h-4 w-4"/>
            </button>
          </div>
        </div>

        {/* Middle */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">About the Institution</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>
            </div>
            <p className="text-[13.5px] leading-[1.7] text-[#687995]">
              Manipal Institute of Technology (MIT) is a premier engineering institution known for academic excellence, research, and innovation. We provide a dynamic learning environment that nurtures talent and prepares students for global opportunities.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Engineering","Research","Innovation","Global Exposure","Industry Collaboration"].map((tag)=>(
                <span key={tag} className="rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12px] font-medium text-[#555]">✦ {tag}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Programs Offered</h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Plus className="h-3.5 w-3.5"/> Add Program</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Computer Science","Information Technology","Data Science","Artificial Intelligence","Electronics & Communication"].map((p,i)=>(
                <span key={p} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] ${i===2?"border-orange-200 bg-orange-50 text-orange-700":"border-[#E0E0E0] bg-[#F7F7F7] text-[#555]"}`}>
                  {p} <span className="text-[#ABABAB] cursor-pointer hover:text-red-500">×</span>
                </span>
              ))}
              <button className="rounded-full border border-dashed border-[#2563EB] px-3 py-1 text-[12px] text-[#2563EB]">+3 more</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Key Information</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>
            </div>
            <div className="space-y-3 text-[13px]">
              {[
                {label:"Type",value:"Private University"},
                {label:"Established",value:"1957"},
                {label:"Website",value:"https://www.manipal.edu",link:true},
                {label:"Address",value:"MIT Campus, Jaipur, Rajasthan, India"},
                {label:"Accreditation",value:"NAAC A+"},
                {label:"Student Strength",value:"15,000+"},
              ].map(({label,value,link})=>(
                <div key={label} className="flex items-start gap-2">
                  <span className="w-[140px] shrink-0 text-[#ABABAB]">🏛 {label}</span>
                  {link ? <a href={value} className="text-[#2563EB] hover:underline">{value}</a> : <span className="text-[#1A1A2E] font-medium">{value}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                {icon:Pencil,label:"Edit Profile",primary:true},
                {icon:Share2,label:"Share Profile"},
                {icon:ExternalLink,label:"View Public Profile"},
                {icon:Download,label:"Download Brochure"},
                {icon:FileText,label:"Manage Opportunities"},
                {icon:Users,label:"View Applications"},
              ].map(({icon:Icon,label,primary})=>(
                <button key={label} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${primary?"bg-[#EEF3FF] text-[#2563EB]":"border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"}`}>
                  <Icon className="h-4 w-4"/> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Location & Reach</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F7F7F7] px-3 py-2.5 mb-4">
              <span className="text-[13px] text-[#687995]">📍 Jaipur, Rajasthan, India</span>
              <button className="text-[12px] font-semibold text-[#2563EB]">📍 View on Map</button>
            </div>
            <div className="grid grid-cols-4 text-center gap-2">
              {[{n:"15K+",label:"Students"},{n:"500+",label:"Faculty"},{n:"120+",label:"Partner Universities"},{n:"30+",label:"Countries"}].map(({n,label})=>(
                <div key={label}>
                  <p className="text-[16px] font-bold text-[#1A1A2E]">{n}</p>
                  <p className="text-[11px] text-[#ABABAB]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Recent Activity</h3>
              <button className="text-[12px] font-semibold text-[#2563EB]">View All →</button>
            </div>
            <div className="space-y-4">
              {[
                {icon:FileText,color:"#DBEAFE",ic:"#2563EB",title:"Posted Research Internship",sub:"Computer Science Department",time:"2 days ago"},
                {icon:FileText,color:"#D1FAE5",ic:"#059669",title:"Received 45 applications",sub:"Summer Research Program",time:"4 days ago"},
                {icon:Users,color:"#EDE9FE",ic:"#7C3AED",title:"Updated Institution Details",sub:"Added new program",time:"1 week ago"},
                {icon:CalendarDays,color:"#FEF3C7",ic:"#D97706",title:"Hosted Virtual Event",sub:"Study at MIT: Global Opportunities",time:"1 week ago"},
              ].map(({icon:Icon,color,ic,title,sub,time})=>(
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{backgroundColor:color}}>
                    <Icon className="h-4 w-4" style={{color:ic}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1A1A2E] line-clamp-1">{title}</p>
                    <p className="text-[12px] text-[#687995]">{sub}</p>
                  </div>
                  <span className="text-[11px] text-[#ABABAB] shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Media & Gallery</h3>
              <button className="text-[12px] font-semibold text-[#2563EB]">View All →</button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=60",
                "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=60",
                "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=200&q=60",
              ].map((src,i)=>(
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img src={src} alt="" className="h-full w-full object-cover"/>
                  {i===2&&<div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="text-[14px] font-bold text-white">+12</span></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Social Media</h3>
              <button><Pencil className="h-4 w-4 text-[#ABABAB]"/></button>
            </div>
            <div className="flex items-center gap-3">
              {["in","📷","▶","𝕏","f"].map((icon,i)=>(
                <button key={i} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E0E0] text-[14px] font-bold text-[#555] hover:border-[#2563EB] hover:text-[#2563EB] transition">{icon}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Profile Page
export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { router.push("/login"); return }
      setUser(firebaseUser)
      const snap = await getDoc(doc(db, "users", firebaseUser.uid))
      setUserData(snap.data())
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-white lg:ml-[80px]">
        <Sidebar />
        <Topbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
        </div>
      </main>
    )
  }

  const role = userData?.role || "student"

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-24 lg:ml-[80px] lg:pb-0">
      <Sidebar />
      <Topbar />

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-[13px] text-[#687995] bg-white border-b border-[#EBEBEB]">
        <Link href="/" className="hover:text-[#2563EB]">Profile</Link>
        <span className="mx-2">›</span>
        <span className="text-[#1A1A2E] font-medium">Overview</span>
      </div>

      <div className="bg-[#F8F9FB]">
        {role === "mentor" ? (
          <MentorProfileView user={{ ...user, ...userData }} />
        ) : role === "institution" ? (
          <InstitutionProfileView user={{ ...user, ...userData }} />
        ) : (
          <StudentProfileView user={{ ...user, ...userData }} />
        )}
      </div>
    </main>
  )
}
