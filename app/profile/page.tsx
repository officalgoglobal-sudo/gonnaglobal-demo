"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import StudentProfileView from "./StudentProfileView"
import MentorProfileView from "./MentorProfileView"
import InstitutionProfileView from "./InstitutionProfileView"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/login")
        return
      }

      await firebaseUser.reload()
      if (!firebaseUser.emailVerified) {
        router.replace("/verify-email")
        return
      }

      setUser(firebaseUser)

      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid))

        if (!snap.exists()) {
          await signOut(auth)
          router.replace("/login")
          return
        }

        const data = snap.data()
        const storedRole = data.activeRole || data.role

        if (!["user", "student", "mentor", "institution", "recruiter"].includes(storedRole)) {
          await signOut(auth)
          router.replace("/login")
          return
        }

        setUserData({ ...data, role: storedRole })
      } catch (error) {
        console.error("Failed to load profile:", error)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-white lg:ml-[80px]">
        <Sidebar />
        <Topbar />
      </main>
    )
  }

  if (!user || !userData) {
    return (
      <main className="min-h-screen bg-white lg:ml-[80px]">
        <Sidebar />
        <Topbar />
        <p className="p-6 text-sm text-gray-600">Unable to load profile.</p>
      </main>
    )
  }

  const role = userData.role

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-24 lg:ml-[80px] lg:pb-0">
      <Sidebar />
      <Topbar />

      <div className="border-b border-[#EBEBEB] bg-white px-6 py-3 text-[13px] text-[#687995]">
        <nav aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 hover:underline">Home</Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <Link href="/profile" className="hover:text-blue-600 hover:underline">My Profile</Link>
          <span className="mx-2" aria-hidden="true">›</span>

        </nav>
      </div>

      <div className="bg-[#F8F9FB]">
        {role === "mentor" ? (
          <MentorProfileView user={{ ...user, ...userData }} />
        ) : role === "institution" || role === "recruiter" ? (
          <InstitutionProfileView user={{ ...user, ...userData }} />
        ) : (
          <StudentProfileView user={{ ...user, ...userData }} />
        )}
      </div>
    </main>
  )
}
