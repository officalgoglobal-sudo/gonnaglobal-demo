"use client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  House, Search, Calendar, Users, Bookmark,
  FileText, Sparkles, Crown, ArrowRight, Bell,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/", icon: House, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/networking", icon: Users, label: "Network" },
  { href: "/mentorship", icon: Users, label: "Mentorship" },
  { href: "/ai", icon: Sparkles, label: "AI" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/applications", icon: FileText, label: "Applications" },
]

const MOBILE_NAV = [
  { href: "/", icon: House, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
  { href: "/profile", icon: Users, label: "Profile" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("student")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid))
        const d = snap.data()
        setFullName(d?.fullName || "")
        setRole(d?.role || "student")
      }
    })
    return () => unsub()
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      {/* ══════════ DESKTOP SIDEBAR ══════════ */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[80px] flex-col items-center border-r border-[#EBEBEB] bg-[#F8F8F8] py-0">

        {/* Vertical brand text */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ height: "100px" }}>
          <Link
            href="/"
            className="-rotate-90 whitespace-nowrap flex items-center gap-[4px]"
            style={{ fontFamily: "var(--font-lora), Georgia, 'Times New Roman', serif" }}
          >
            <span className="text-[16px] font-normal leading-none" style={{ color: "#B89A6A" }}>Gonn&apos;a</span>
            <span className="text-[16px] font-bold leading-none text-[#1A1A2E]">Global</span>
          </Link>
        </div>

        {/* Nav items — spread evenly filling full height */}
        <nav className="flex flex-1 flex-col items-center justify-between w-full px-1.5 overflow-hidden py-3">
          <div className="flex flex-col items-center w-full gap-0">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`group flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all duration-200 ${
                  active
                    ? "bg-[#EBF0FF] text-[#2563EB]"
                    : "text-[#6B6B6B] hover:bg-[#F0F0F0] hover:text-[#2563EB]"
                }`}
              >
                <Icon
                  className={`h-[20px] w-[20px] transition-colors duration-200 ${
                    active ? "text-[#2563EB]" : "text-[#6B6B6B] group-hover:text-[#2563EB]"
                  }`}
                  strokeWidth={active ? 2.2 : 1.7}
                />
                <span
                  className={`text-[9px] font-medium leading-tight text-center tracking-[0.01em] ${
                    active ? "text-[#2563EB]" : "text-[#6B6B6B] group-hover:text-[#2563EB]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            )
          })}
          </div>

          {/* Upgrade to Premium — pinned to bottom */}
          <button
            onClick={() => router.push("/upgrade")}
            className="group flex w-full flex-col items-center gap-1 rounded-xl bg-[#FEF9EC] border border-[#F5DFA0] px-1 py-2 transition-all duration-200 hover:bg-[#FEF3C7] mb-4"
          >
            <Crown className="h-[20px] w-[20px] text-[#B8860B]" strokeWidth={1.7} />
            <span className="text-[8.5px] font-semibold leading-tight text-center text-[#92400E]">
              Upgrade<br />Premium
            </span>
            <ArrowRight className="h-3 w-3 text-[#B8860B]" />
          </button>
        </nav>
      </aside>

      {/* ══════════ MOBILE BOTTOM TAB BAR ══════════ */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#EBEBEB] bg-white/95 backdrop-blur-md px-2 py-2 lg:hidden">
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 min-w-[52px] py-1 rounded-xl transition-all duration-200 ${
                active ? "text-[#2563EB]" : "text-[#6B6B6B]"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${active ? "text-[#2563EB]" : "text-[#6B6B6B]"}`}
                strokeWidth={active ? 2.2 : 1.7}
              />
              <span className={`text-[10px] font-medium ${active ? "text-[#2563EB]" : "text-[#6B6B6B]"}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
