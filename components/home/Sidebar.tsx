
"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  House, Search, Calendar, Users, Bookmark,
  FileText, Sparkles, Crown, ArrowRight,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/", icon: House, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/mentorship", icon: Users, label: "Mentorship" },
  { href: "/ai", icon: Sparkles, label: "AI" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
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
  const [, setFullName] = useState("")
  const [, setRole] = useState("student")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid))
        const d = snap.data()
        setFullName(d?.fullName || "")
        setRole(d?.role || "student")
      } else {
        setFullName("")
        setRole("student")
      }
    })
    return () => unsub()
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[80px] flex-col items-center border-r border-[#EBEBEB] bg-[#F8F8F8]">
       
        {/* Brand */}
        <div className="flex h-[100px] w-full shrink-0 items-center justify-center pt-24">
          <Link
            href="/"
            className="flex -rotate-90 items-center justify-center gap-[4px] whitespace-nowrap"
            style={{
              fontFamily: "var(--font-lora), Georgia, 'Times New Roman', serif",
            }}
          >
            <span
              className="text-[22px] font-normal leading-none"
              style={{ color: "#2563EB" }}
            >
              Gonn&apos;a
            </span>
            <span
              className="text-[22px] font-bold leading-none"
              style={{ color: "#2B1D16" }}
            >
              Global
            </span>
          </Link>
        </div>


        {/* Navigation */}
        <nav className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 overflow-y-auto pt-0 pb-3">
          <div className="-mt-[9px] flex w-full flex-col items-center gap-2">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = isActive(href)

              return (
                <Link
                  key={href}
                  href={href}
                 className={`group flex w-full flex-col items-center justify-center rounded-xl px-1 py-3 text-center transition-all duration-200 ${
                    active
                      ? "bg-[#EBF0FF] text-[#2563EB]"
                      : "text-[#6B6B6B] hover:bg-[#F0F0F0] hover:text-[#2563EB]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      active ? "text-[#2563EB]" : "text-[#6B6B6B] group-hover:text-[#2563EB]"
                    }`}
                    strokeWidth={active ? 2.2 : 1.7}
                  />
            
                </Link>
              )
            })}
          </div>

          {/* Premium upgrade */}
          <button
            type="button"
            onClick={() => router.push("/upgrade")}
            className="mb-4 flex w-[calc(100%-4px)] flex-col items-center justify-center gap-1 rounded-xl border border-[#F5DFA0] bg-[#FEF9EC] px-1 py-2 text-center transition-colors hover:bg-[#FEF3C7]"
          >
            <Crown className="h-5 w-5 text-[#B8860B]" strokeWidth={1.7} />
            <span className="w-full text-[8.5px] font-semibold leading-tight text-center text-[#92400E]">
              Upgrade to
              <br />
              Premium
            </span>
            <ArrowRight className="h-3 w-3 text-[#B8860B]" />
          </button>
       
      </nav>

      {/* Bottom brand icon */}
      <Link
        href="/"
        className="mb-4 mt-0 flex h-12 w-12 shrink-0 items-center justify-center"
        aria-label="Gonn'a Global home"
      >
        <Image
          src="/goglobal-icon.png"
          alt="Gonn'a Global"
          width={50}
          height={50}
          className="h-10 w-10 object-contain"
        />
      </Link>
    </aside>


      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#EBEBEB] bg-white/95 px-2 py-2 backdrop-blur-md lg:hidden">
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-[52px] flex-col items-center gap-0.5 rounded-xl py-1 transition-all duration-200 ${
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
