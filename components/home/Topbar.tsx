"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/categories", label: "Categories" },
  { href: "/events", label: "Events" },
  { href: "/networking", label: "Networking" },
  { href: "/resources", label: "Courses" },
  { href: "/about", label: "About" },
]

export default function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
const [unreadCount, setUnreadCount] = useState(0)
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
const [searchVal, setSearchVal] = useState("")

useEffect(() => {
  let unsubscribeNotifications: (() => void) | undefined

  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (unsubscribeNotifications) {
      unsubscribeNotifications()
      unsubscribeNotifications = undefined
    }

    setUnreadCount(0)

    if (!user) {
      setIsLoggedIn(false)
      setFullName("")
      setRole("")
      return
    }

    setIsLoggedIn(true)

    const snap = await getDoc(doc(db, "users", user.uid))
    const d = snap.data()
    setFullName(d?.fullName || "")
    setRole(d?.activeRole || d?.role || "user")

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("isRead", "==", false)
    )

    unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => setUnreadCount(snapshot.size),
      (error) => {
        console.error("Failed to load unread notifications:", error)
        setUnreadCount(0)
      }
    )
  })

  return () => {
    unsubscribeAuth()
    unsubscribeNotifications?.()
  }
}, [])

  const handleSearch = () => {
    if (searchVal.trim()) router.push(`/explore?search=${encodeURIComponent(searchVal.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#EBEBEB] bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">

      {/* ── DESKTOP BAR ── */}
      <div className="hidden lg:flex items-center h-[60px] px-8 gap-6">

        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-5">
          <img
            src="/goglobal-icon.png"
            alt="Gonn'a Global"
            className="h-9 w-9 object-contain"
          />
          <div
            className="flex items-center whitespace-nowrap"
            style={{
              fontFamily: "var(--font-lora), Georgia, 'Times New Roman', serif",
              letterSpacing: "-0.01em",
            }}
          >
            <span
              className="text-[22px] font-normal"
              style={{ color: "#2563EB" }}
            >
              Gonn&apos;a&nbsp;
            </span>
            <span
              className="text-[22px] font-bold"
              style={{ color: "#2B1D16" }}
            >
              Global
            </span>
          </div>
        </Link>


        {/* Nav links */}
        <nav className="flex items-center gap-7 text-[13.5px] shrink-0">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`relative pb-[18px] pt-[18px] transition-colors duration-150 ${
                  active
                    ? "text-[#1A1A2E] font-semibold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#1A1A2E]"
                    : "text-[#555555] font-normal hover:text-[#1A1A2E]"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Search — grows */}
       <div className="w-[340px] shrink-0 ml-auto mr-1">
          <div
            className={`flex items-center gap-2 rounded-full border bg-[#F7F7F7] px-4 py-2 transition-all duration-200 ${
              searchFocused ? "border-[#2563EB] ring-2 ring-[#2563EB]/10 bg-white" : "border-[#E5E5E5]"
            }`}
          >
            <Search className="h-[15px] w-[15px] shrink-0 text-[#A0A0A0]" />
            <input
              type="text"
              placeholder="Search opportunities, universities, events..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-[13px] text-[#2B2B2B] outline-none placeholder:text-[#ABABAB] min-w-0"
            />
            <span className="shrink-0 rounded-md border border-[#DEDEDE] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#ABABAB]">
              ⌘ K
            </span>
          </div>
        </div>

        {/* Right auth */}
        {/* Notification Bell */}
       {isLoggedIn && (
  <Link href="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#5A5A6A] transition hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EEF3FF] shrink-0 mr-1">
          <Bell className="h-4 w-4" />
{unreadCount > 0 && (
  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold text-white">
    {unreadCount > 99 ? "99+" : unreadCount}
  </span>
)}

          </Link>
)}
        <div className="flex items-center gap-3 shrink-0">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-[13.5px] font-medium text-[#3D3D3D] transition hover:text-[#2563EB]">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#2563EB] px-5 py-2 text-[13.5px] font-semibold text-white transition hover:bg-[#1d4ed8] shadow-sm"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-3 py-1.5 transition hover:bg-[#F5F5F5]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-[12px] font-bold text-white">
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[72px] truncate text-[13px] font-medium text-[#2B2B2B]">
                  {fullName?.split(" ")[0] || "Profile"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#A0A0A0]" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE BAR ── */}
      <div className="flex lg:hidden items-center justify-between h-[54px] px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/goglobal-icon.png" alt="GG" className="h-8 w-8 object-contain" onError={(e) => (e.currentTarget.src = "/gonna-global-logo.png")} />
          <span className="text-[17px] font-bold text-[#1A1A2E]" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>Gonn&apos;a Global</span>
        </Link>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full">
              <Bell className="h-5 w-5 text-[#555]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] transition hover:bg-[#F5F5F5]"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5 text-[#2B2B2B]" /> : <Menu className="h-4.5 w-4.5 text-[#2B2B2B]" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-[#E5E5E5] bg-white px-4 pb-5 pt-3 lg:hidden">
          <div className="mb-3 flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2.5">
            <Search className="h-4 w-4 text-[#A0A0A0]" />
            <input type="text" placeholder="Search..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#ABABAB]" />
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#2B2B2B] transition hover:bg-[#F0F4FF] hover:text-[#2563EB]">
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-3 border-t border-[#E5E5E5] pt-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full border border-[#E5E5E5] px-4 py-2.5 text-center text-[13.5px] font-medium text-[#3D3D3D] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full bg-[#2563EB] px-4 py-2.5 text-center text-[13.5px] font-semibold text-white transition hover:bg-[#1d4ed8]">
                  Sign up
                </Link>
              </>
            ) : (
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#2B2B2B]">{fullName || "Profile"}</p>
                  <p className="text-[11px] text-[#ABABAB] capitalize">{role}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}



