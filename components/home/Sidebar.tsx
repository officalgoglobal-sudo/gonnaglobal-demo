"use client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  House, Search, Calendar, Users, Bookmark,
  FileText, Sparkles, Crown, ArrowRight,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/",              icon: House,     label: "Home" },
  { href: "/explore",       icon: Search,    label: "Explore" },
  { href: "/events",        icon: Calendar,  label: "Events" },
  { href: "/communities",   icon: Users,     label: "Community" },
  { href: "/mentorship",    icon: Users,     label: "Mentorship" },
  { href: "/ai",            icon: Sparkles,  label: "AI" },
  { href: "/saved",         icon: Bookmark,  label: "Saved" },
  { href: "/applications",  icon: FileText,  label: "Applications" },
]

const MOBILE_NAV = [
  { href: "/",            icon: House,    label: "Home" },
  { href: "/explore",     icon: Search,   label: "Explore" },
  { href: "/events",      icon: Calendar, label: "Events" },
  { href: "/saved",       icon: Bookmark, label: "Saved" },
  { href: "/profile",     icon: Users,    label: "Profile" },
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
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[80px] flex-col items-center border-r border-[#E7DDD1] bg-[#F8F5F0] py-5">
        <Link href="/" className="mb-6 flex items-center justify-center">
          <img src="/gonna-global-logo.png" alt="Gonna Global" className="h-auto w-[44px] object-contain" />
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1 w-full px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href}
                className={`group flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-2.5 transition-all duration-200 ${
                  active ? "bg-[#EFE7DC] text-[#2563EB]" : "text-[#6B5B52] hover:bg-[#EFE7DC] hover:text-[#2563EB]"
                }`}
              >
                <Icon className={`h-[22px] w-[22px] transition-colors duration-200 ${active ? "text-[#2563EB]" : "text-[#6B5B52] group-hover:text-[#2563EB]"}`} strokeWidth={active ? 2.2 : 1.8} />
                <span className={`text-[10px] font-medium leading-tight text-center ${active ? "text-[#2563EB]" : "text-[#6B5B52] group-hover:text-[#2563EB]"}`}>{label}</span>
              </Link>
            )
          })}
          <button onClick={() => router.push("/upgrade")}
            className="group mt-2 flex w-full flex-col items-center gap-1 rounded-2xl bg-[#FEF3C7] px-1 py-2.5 transition-all duration-200 hover:bg-[#FDE68A]"
          >
            <Crown className="h-[22px] w-[22px] text-[#D97706]" strokeWidth={1.8} />
            <span className="text-[9.5px] font-semibold leading-tight text-center text-[#92400E]">Upgrade to<br />Premium</span>
            <ArrowRight className="h-3 w-3 text-[#D97706]" />
          </button>
        </nav>
        <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFE7DC]">
          <span className="text-[13px] font-black tracking-tight text-[#2563EB]">GG</span>
        </div>
      </aside>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#E7DDD1] bg-[#F8F5F0]/95 backdrop-blur-md px-2 py-2 lg:hidden">
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 min-w-[52px] py-1 rounded-xl transition-all duration-200 ${active ? "text-[#2563EB]" : "text-[#6B5B52]"}`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-[#2563EB]" : "text-[#6B5B52]"}`} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] font-medium ${active ? "text-[#2563EB]" : "text-[#6B5B52]"}`}>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
