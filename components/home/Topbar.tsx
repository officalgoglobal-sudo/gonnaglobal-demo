"use client"
import Image from "next/image"
import { useEffect, useState } from "react"

import {
  Menu,
  X,
} from "lucide-react"

import Link from "next/link"

import { onAuthStateChanged } from "firebase/auth"

import { auth, db } from "@/lib/firebase"
import {
  doc,
  getDoc,
} from "firebase/firestore"

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false)
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, async (user) => {
  
        if (user) {

  
          setIsLoggedIn(true)
  
          const userDoc = await getDoc(
            doc(db, "users", user.uid)
          )
  
          const userData = userDoc.data()
  
          setFullName(userData?.fullName || "")
          setRole(
            userData?.activeRole ||
            userData?.role ||
            "user"
          )
  
        } else {
  
          setIsLoggedIn(false)
  
        }
  
      })
  
    return () => unsubscribe()
  
  }, [])
  return (

    <header className="border-b border-[#E7DDD1] bg-[#F8F5F0]">
  
      {/* TOP ROW */}
      <div className="flex items-center justify-between px-5 py-3 sm:px-8 lg:px-8 lg:py-3">
  
        {/* LOGO */}
  
        <Link
  href="/"
  className="hidden lg:flex items-center"
>
  <Image
    src="/goglobal-logo.png"
    alt="GoGlobal"
    width={100}
    height={50}
    className="object-contain"
    priority
  />
</Link>
        {/* DESKTOP NAV */}
  
        <nav className="hidden items-center gap-10 text-sm font-medium lg:flex">

  <Link
    href="/explore"
    className="text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
  >
    Explore
  </Link>

  <Link
    href="/categories"
    className="text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
  >
    Categories
  </Link>

  <Link
    href="/events"
    className="text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
  >
    Events
  </Link>

  <Link
    href="/about"
    className="text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
  >
    About
  </Link>

</nav>
  
        {/* RIGHT */}
  
        <div className="hidden items-center gap-4 lg:flex">
  
          {!isLoggedIn ? (
  
            <>
  
  <Link
  href="/login"
  className="font-medium text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
>
  Login
</Link>
  
              <Link
                href="/signup"
                className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2563EB]"
              >
  
                Sign up
  
              </Link>
  
            </>
  
          ) : (
  
            <>
  
              <Link
                href={
                  role === "recruiter"
                    ? "/recruit/dashboard"
                    : "/dashboard"
                }
                className="rounded-xl border border-[#E7DDD1] bg-[#FFFDF9] px-4 py-3 text-sm font-medium text-[#6B5B52] transition-all duration-300 hover:border-[#3B82F6] hover:bg-[#EFE7DC] hover:text-[#2563EB]"
              >
  
                {role === "recruiter"
                  ? "Recruit Dashboard"
                  : "Dashboard"}
  
              </Link>
  
              <Link
                href="/profile"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white"
              >
  
                {fullName?.charAt(0) || "U"}
  
              </Link>
  
            </>
  
          )}
  
        </div>
  
        {/* MOBILE HEADER */}

        <div className="flex items-center justify-between w-full lg:hidden">

<Link href="/">
  <Image
    src="/goglobal-logo.png"
    alt="GoGlobal"
    width={80}
    height={40}
    className="object-contain"
    priority
  />
</Link>

<button
  onClick={() =>
    setMobileMenuOpen(!mobileMenuOpen)
  }
>
  {mobileMenuOpen ? (
    <X className="h-6 w-6 text-[#2B1D16]" />
  ) : (
    <Menu className="h-6 w-6 text-[#2B1D16]" />
  )}
</button>

</div>
  
      </div>
  
      {/* MOBILE MENU */}
  
      {mobileMenuOpen && (
  
        <div className="border-t border-[#E7DDD1] bg-[#F8F5F0] px-5 py-5 lg:hidden">
  
          <div className="flex flex-col gap-5 text-sm font-medium">
  
          <Link
  href="/explore"
  className="text-left text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
>
              Explore
            </Link>
  
            <Link
  href="/categories"
  className="text-left text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
>
  Categories
</Link>

<Link
  href="/events"
  className="text-left text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
>
  Events
</Link>

<Link
  href="/about"
  className="text-left text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
>
  About
</Link>
  
            <div className="mt-4 flex items-center gap-4">
  
              {!isLoggedIn ? (
  
                <>
  
  <Link
  href="/login"
  className="font-medium text-[#6B5B52] transition-all duration-300 hover:text-[#2563EB]"
>
  Login
</Link>
  
                  <Link
                    href="/signup"
                    className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2563EB]"
                  >
  
                    Sign up
  
                  </Link>
  
                </>
  
              ) : (
  
                <>
  
                  <Link
                    href={
                      role === "recruiter"
                        ? "/recruit/dashboard"
                        : "/dashboard"
                    }
                    className="rounded-xl border border-[#E7DDD1] bg-[#FFFDF9] px-4 py-3 text-sm font-medium text-[#6B5B52] transition-all duration-300 hover:border-[#2563EB] hover:bg-[#EFE7DC] hover:text-[#2563EB]"
                  >
  
  {role === "recruiter"
  ? "Recruit Dashboard"
  : "Dashboard"}
  
                  </Link>
  
                  <Link
                    href="/profile"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white"
                  >
  
                    {fullName?.charAt(0) || "U"}
  
                  </Link>
  
                </>
  
              )}
  
            </div>
  
          </div>
  
        </div>
  
      )}
  
    </header>
  
  )
     
}
