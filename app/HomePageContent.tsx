"use client"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Hero from "@/components/home/Hero"
import Universities from "@/components/home/Universities"
import FeaturedOpportunities from "@/components/home/FeaturedOpportunities"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import NewsletterCTA from "@/components/home/NewsletterCTA"
import Footer from "@/components/home/Footer"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function HomePageContent() {
  const [fullName, setFullName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeRole, setActiveRole] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()
        setFullName(userData?.fullName || "")
        setActiveRole(userData?.activeRole || userData?.role || "user")
      } else {
        setIsLoggedIn(false)
        setFullName("")
        setActiveRole("")
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#1A1A2E]">
      {/* Fixed sidebar — 80px wide */}
      <Sidebar />

      {/* Everything shifts right by sidebar width */}
      <div className="lg:ml-[80px]">
        {/* Sticky topbar */}
        <Topbar />

        {/* Page sections */}
        <Hero fullName={fullName} isLoggedIn={isLoggedIn} userType={activeRole} />
        <Universities />
        <FeaturedOpportunities />
        <HowItWorks />
        <Testimonials />
        <NewsletterCTA />
        <Footer />

        {/* Mobile bottom tab bar spacer */}
        <div className="h-16 lg:hidden" />
      </div>
    </div>
  )
}