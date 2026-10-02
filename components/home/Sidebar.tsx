"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  House,
  Search,
  Bookmark,
  Briefcase,
  Calendar,
  Users,
} from "lucide-react"

import { useRouter } from "next/navigation"

import {
  onAuthStateChanged,
} from "firebase/auth"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import {
  useEffect,
  useState,
} from "react"

import {
  auth,
  db,
} from "@/lib/firebase"

export default function Sidebar() {

  const router = useRouter()
  const [role, setRole] =
  useState("student")

const pathname =
  usePathname()
  const [fullName, setFullName] =
useState("")

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
  
          if (user) {
  
            const userDoc = await getDoc(
              doc(db, "users", user.uid)
            )
  
            const userData =
              userDoc.data()
  
            setFullName(
              userData?.fullName || ""
            )
            setRole(
              userData?.role || "student"
            )
  
          }
  
        }
      )
  
    return () => unsubscribe()
  
  }, [])

  return (

    <>

      {/* DESKTOP SIDEBAR */}

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[92px] flex-col items-center border-r border-[#E7DDD1] bg-[#F8F5F0] py-8">

      <div
  className="mt-20 rotate-[-90deg] text-[38px] font-semibold tracking-[-0.04em] flex gap-2 whitespace-nowrap"
  aria-label="Gonn'a Global"
>
  <span className="text-[#d7c4b4]">
    Gonn'a
  </span>

  <span className="text-[#2563EB]">
    Global
  </span>
</div>

        <div className="mt-56 flex flex-col items-center gap-8 flex-1">

        <Link
  href="/"
  aria-label="Home"
  className="group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-[#EFE7DC]"
>

  <House className="h-[22px] w-[22px] text-[#6B5B52] transition-all duration-300 group-hover:text-[#2563EB]" />

  <span className="sr-only">Home</span>

</Link>

<Link
  href="/explore"
  aria-label="Explore global opportunities"
  className="group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-[#EFE7DC]"
>

  <Search className="h-[22px] w-[22px] text-[#6B5B52] transition-all duration-300 group-hover:text-[#2563EB]" />

  <span className="sr-only">Explore global opportunities</span>

</Link>

          <button
            onClick={() => router.push("/saved")}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-[#EFE7DC]"
          >

            <Bookmark className="h-[22px] w-[22px] text-[#6B5B52] transition-all duration-300 group-hover:text-[#2563EB]" />

          </button>

          {role === "recruiter" ? (

<button
  onClick={() =>
    router.push(
      "/recruit/opportunities"
    )
  }
  className="group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-[#EFE7DC]"
>

  <Briefcase className="h-[22px] w-[22px] text-[#6B5B52] transition-all duration-300 group-hover:text-[#2563EB]" />

</button>

) : (

<button
  onClick={() =>
    router.push("/calendar")
  }
  className="group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-[#EFE7DC]"
>

  <Calendar className="h-[22px] w-[22px] text-[#6B5B52] transition-all duration-300 group-hover:text-[#2563EB]" />

</button>

)}

          <button
            onClick={() => router.push("/profile")}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-[#EFE7DC]"
          >

            <Users  className="h-[22px] w-[22px] text-[#6B5B52] transition-all duration-300 group-hover:text-[#2563EB]" />

          </button>

        </div>

        <Link
  href="/about"
  className="mb-4"
>
  <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="h-auto w-[58px] object-contain" />
</Link>

      </aside>
      
      {/* MOBILE BOTTOM NAV */}

      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#E7DDD1] bg-[#F8F5F0]/95 backdrop-blur-md px-2 py-3 lg:hidden">

      <Link
  href="/"
  aria-label="Home"
  className="flex flex-col items-center gap-1 transition-all duration-300 hover:text-[#2563EB]"
>

  <House className="h-5 w-5 text-[#6B5B52]" />

  <span className="sr-only">Home</span>

</Link>

<Link
  href="/explore"
  aria-label="Explore global opportunities"
  className="flex flex-col items-center gap-1 transition-all duration-300 hover:text-[#2563EB]"
>

  <Search className="h-5 w-5 text-[#6B5B52]" />

  <span className="sr-only">Explore global opportunities</span>

</Link>

        <button
          onClick={() => router.push("/saved")}
          className="flex flex-col items-center gap-1 transition-all duration-300 hover:text-[#2563EB]"
        >

          <Bookmark className="h-5 w-5 text-[#6B5B52]" />

        </button>

        {role === "recruiter" ? (

<button
  onClick={() =>
    router.push(
      "/recruit/opportunities"
    )
  }
  className="flex flex-col items-center gap-1"
>

  <Briefcase className="h-5 w-5 text-[#6B5B52]" />

</button>

) : (

<button
  onClick={() =>
    router.push("/calendar")
  }
  className="flex flex-col items-center gap-1"
>

  <Calendar className="h-5 w-5 text-[#6B5B52]" />

</button>

)}

        <button
  onClick={() => router.push("/profile")}
  className="flex flex-col items-center gap-1"
>

  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">

    {fullName?.charAt(0) || "U"}

  </div>

</button>

      </div>

    </>

  )

}
