"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/explore",     label: "Explore" },
  { href: "/categories",  label: "Categories" },
  { href: "/events",      label: "Events" },
  { href: "/communities", label: "Communities" },
  { href: "/resources",   label: "Resources" },
  { href: "/about",       label: "About" },
]

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        const snap = await getDoc(doc(db, "users", user.uid))
        const d = snap.data()
        setFullName(d?.fullName || "")
        setRole(d?.activeRole || d?.role || "user")
      } else {
        setIsLoggedIn(false)
      }
    })
    return () => unsub()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7DDD1] bg-[#F8F5F0]">

      {/* ── DESKTOP BAR ── */}
      <div className="hidden lg:flex items-center h-[56px] px-6 gap-5">

        {/* Nav links — left */}
        <nav className="flex items-center gap-6 text-[13px] font-medium shrink-0">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-[#3D2C24] transition-colors duration-200 hover:text-[#2563EB]
                         after:absolute after:-bottom-[18px] after:left-0 after:h-[2px] after:w-0 after:rounded-full
                         after:bg-[#2563EB] after:transition-all after:duration-200 hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search — grows */}
        <div className="flex-1 mx-4">
          <div
            className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-[7px] transition-all duration-200 ${
              searchFocused ? "border-[#2563EB] ring-2 ring-[#2563EB]/15" : "border-[#E0D5CC]"
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-[#A89F9A]" />
            <input
              type="text"
              placeholder="Search opportunities, universities, events..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent text-[13px] text-[#3D2C24] outline-none placeholder:text-[#B0A49E] min-w-0"
            />
            <span className="shrink-0 rounded-md border border-[#E0D5CC] bg-[#F3EDE8] px-2 py-0.5 text-[11px] font-medium text-[#A89F9A]">
              ⌘ K
            </span>
          </div>
        </div>

        {/* Right — auth */}
        <div className="flex items-center gap-3 shrink-0">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-[13px] font-medium text-[#6B5B52] transition hover:text-[#2563EB]">
                Login
              </Link>
              <Link href="/signup" className="rounded-xl bg-[#2563EB] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1d4ed8]">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-[#EFE7DC]">
                <Bell className="h-5 w-5 text-[#6B5B52]" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
              </button>
              <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#EFE7DC]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-[13px] font-bold text-white">
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[80px] truncate text-[13px] font-medium text-[#3D2C24]">
                  {fullName?.split(" ")[0] || "Profile"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#A89F9A]" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE BAR ── */}
      <div className="flex lg:hidden items-center justify-between h-[52px] px-4">
        <Link href="/">
          <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="h-auto w-[90px] object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl">
              <Bell className="h-5 w-5 text-[#6B5B52]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-[#EFE7DC]"
          >
            {mobileOpen ? <X className="h-5 w-5 text-[#3D2C24]" /> : <Menu className="h-5 w-5 text-[#3D2C24]" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {mobileOpen && (
        <div className="border-t border-[#E7DDD1] bg-[#F8F5F0] px-4 pb-5 pt-3 lg:hidden">
          {/* Mobile search */}
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#E0D5CC] bg-white px-3.5 py-2.5">
            <Search className="h-4 w-4 text-[#A89F9A]" />
            <input type="text" placeholder="Search..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#B0A49E]" />
          </div>
          {/* Mobile nav */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#3D2C24] transition hover:bg-[#EFE7DC] hover:text-[#2563EB]">
                {label}
              </Link>
            ))}
          </nav>
          {/* Mobile auth */}
          <div className="mt-4 flex items-center gap-3 border-t border-[#E7DDD1] pt-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl border border-[#E0D5CC] px-4 py-2.5 text-center text-[13.5px] font-medium text-[#6B5B52] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl bg-[#2563EB] px-4 py-2.5 text-center text-[13.5px] font-semibold text-white transition hover:bg-[#1d4ed8]">
                  Sign up
                </Link>
              </>
            ) : (
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-[#EFE7DC]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#3D2C24]">{fullName || "Profile"}</p>
                  <p className="text-[11px] text-[#A89F9A] capitalize">{role}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
