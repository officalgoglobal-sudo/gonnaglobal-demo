"use client"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import FilterBar from "@/components/home/FilterBar"
import Hero from "@/components/home/Hero"
import TrustedLogos from "@/components/home/TrustedLogos"
import FeaturedOpportunities from "@/components/home/FeaturedOpportunities"
import TrendingCategories from "@/components/home/TrendingCategories"
import WhyGoGlobal from "@/components/home/WhyGoGlobal"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import GlobalStats from "@/components/home/GlobalStats"
import NewsletterCTA from "@/components/home/NewsletterCTA"
import Footer from "@/components/home/Footer"
import { useEffect, useState } from "react"

import { onAuthStateChanged } from "firebase/auth"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"

export default function HomePage() {
  const [fullName, setFullName] = useState("")

const [isLoggedIn, setIsLoggedIn] = useState(false)
const [activeRole, setActiveRole] = useState("")
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
        setActiveRole(
          userData?.activeRole || "user"
        )

      } else {

        setIsLoggedIn(false)

      }

    })

  return () => unsubscribe()

}, [])
  return (
    <main className="min-h-screen bg-[#F8F5F0] pb-24 text-[#2B1D16] lg:pb-0">

      <Sidebar />

      <div className="lg:ml-23">
      <Topbar />

<FilterBar />

<div className="mx-auto max-w-[1600px]">

        

<Hero
  fullName={fullName}
  isLoggedIn={isLoggedIn}
  userType={activeRole}
/>
        <TrustedLogos />

{activeRole !== "recruiter" && (
  <FeaturedOpportunities />
)}

<TrendingCategories />
        <WhyGoGlobal />
        <HowItWorks />
        <Testimonials />
        <GlobalStats />
        <NewsletterCTA />
        
        </div>
        <Footer />
      </div>
    </main>
  )
}