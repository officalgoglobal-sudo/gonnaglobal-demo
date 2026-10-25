"use client"

import Link from "next/link"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Globe2, Briefcase, Code2, Trophy, Users, Monitor, CalendarDays, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

const CATEGORIES = [
  {
    id: "global",
    icon: Globe2,
    iconColor: "#2563EB",
    iconBg: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80",
    title: "Global Opportunities",

    countColor: "#DBEAFE",
    countText: "#2563EB",
    description: "Explore international programs, exchange opportunities, fellowships, scholarships and more from around the world.",
    link: "/explore?type=Global%20Opportunities",
    linkLabel: "Explore Global Opportunities",
    linkColor: "#2563EB",
  },
  {
    id: "internships",
    icon: Briefcase,
    iconColor: "#059669",
    iconBg: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    title: "Internships",
    
    countColor: "#D1FAE5",
    countText: "#059669",
    description: "Find internships at top companies, universities and organizations to gain real-world experience.",
    link: "/explore?type=Internships",
    linkLabel: "Explore Internships",
    linkColor: "#059669",
  },
  {
    id: "hackathons",
    icon: Code2,
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
    title: "Hackathons",
    
    countColor: "#EDE9FE",
    countText: "#7C3AED",
    description: "Participate in hackathons, build innovative solutions, and showcase your skills to a global audience.",
    link: "/explore?type=Hackathons",
    linkLabel: "Explore Hackathons",
    linkColor: "#7C3AED",
  },
  {
    id: "sports",
    icon: Trophy,
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80",
    title: "Sports",
   
    countColor: "#FEF3C7",
    countText: "#D97706",
    description: "Discover opportunities in sports including events, programs, scholarships and competitions.",
    link: "/explore?type=Sports",
    linkLabel: "Explore Sports",
    linkColor: "#D97706",
  },
  {
    id: "conferences",
    icon: Users,
    iconColor: "#DB2777",
    iconBg: "#FCE7F3",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    title: "Conferences",
    
    countColor: "#FCE7F3",
    countText: "#DB2777",
    description: "Attend global conferences, summits and industry events to learn, network and gain new perspectives.",
    link: "/explore?type=Conferences",
    linkLabel: "Explore Conferences",
    linkColor: "#DB2777",
  },
  {
    id: "freelancing",
    icon: Monitor,
    iconColor: "#E11D48",
    iconBg: "#FFE4E6",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    title: "Freelancing",

    countColor: "#FFE4E6",
    countText: "#E11D48",
    description: "Find freelance projects, gigs and remote work opportunities to apply your skills and earn.",
    link: "/explore?type=Freelancing",
    linkLabel: "Explore Freelancing",
    linkColor: "#E11D48",
  },
  {
    id: "events",
    icon: CalendarDays,
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    title: "Events",
    
    countColor: "#EDE9FE",
    countText: "#7C3AED",
    description: "Explore webinars, workshops, community events and other learning experiences happening globally.",
    link: "/explore?type=Events",
    linkLabel: "Explore Events",
    linkColor: "#7C3AED",
  },
  {
    id: "competitions",
    icon: Star,
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80",
    title: "Competitions",
   
    countColor: "#FEF3C7",
    countText: "#D97706",
    description: "Take part in national and international competitions and challenge yourself to achieve more.",
   link: "/explore?type=Competitions",
    linkLabel: "Explore Competitions",
    linkColor: "#D97706",
  },
]
const CATEGORY_TYPES: Record<string, string> = {
  global: "global opportunities",
  internships: "internships",
  hackathons: "hackathons",
  sports: "sports",
  conferences: "conferences",
  freelancing: "freelancing",
  events: "events",
  competitions: "competitions",
}

export default function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "opportunities"),
      (snapshot) => {
        const newCounts: Record<string, number> = {}

        snapshot.forEach((document) => {
          const opportunity = document.data()
          const type = opportunity.type

          if (typeof type === "string") {
            const key = type.trim().toLowerCase()
            newCounts[key] = (newCounts[key] || 0) + 1
          }
        })

        setCounts(newCounts)
      },
      (error) => {
        console.error("Failed to load opportunity counts:", error)
      }
    )

    return () => unsubscribe()
  }, [])
  return (
    <main className="min-h-screen bg-white text-black">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />

        <div className="px-6 py-8 sm:px-8 lg:px-12">

          {/* HEADER SECTION */}
          <div className="flex items-start justify-between">
            <div className="max-w-lg">
              <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] sm:text-4xl">
                Explore Categories
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#687995]">
                Discover opportunities across 8 categories and find the right global experiences to<br />
                learn, grow, and stand out.
              </p>
            </div>

            {/* Right illustration */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Globe SVG */}
              <svg viewBox="0 0 200 200" className="w-[140px] h-[140px]" fill="none">
                <circle cx="100" cy="100" r="85" fill="#DBEAFE" opacity="0.4"/>
                <circle cx="100" cy="100" r="70" fill="#BFDBFE" opacity="0.5"/>
                <circle cx="100" cy="100" r="55" fill="#93C5FD" opacity="0.4"/>
                {/* Globe continents */}
                <ellipse cx="100" cy="100" rx="45" ry="55" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.7"/>
                <ellipse cx="100" cy="100" rx="55" ry="30" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.5"/>
                <path d="M70 70L90 60L110 72L105 90L85 95L70 82Z" fill="#3B82F6" opacity="0.7"/>
                <path d="M105 100L120 95L130 110L118 125L100 120Z" fill="#60A5FA" opacity="0.6"/>
              </svg>
              {/* Handwriting text */}
              <div className="text-right">
                <p className="text-[22px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Explore</p>
                <p className="text-[22px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Learn</p>
                <p className="text-[22px] font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>Grow</p>
                <svg viewBox="0 0 80 20" className="ml-auto w-14 mt-1">
                  <path d="M5 15 Q30 5 75 10" stroke="#1A1A2E" strokeWidth="2" fill="none"/>
                  <path d="M65 6 L75 10 L68 16" stroke="#1A1A2E" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* CATEGORIES GRID */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.id} className="group overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-[170px] overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Icon overlay */}
                    <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white shadow-md" style={{ backgroundColor: cat.iconBg }}>
                      <Icon className="h-5 w-5" style={{ color: cat.iconColor }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[16px] font-bold text-[#1A1A2E]">{cat.title}</h2>
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: cat.countColor, color: cat.countText }}>
                        {counts[CATEGORY_TYPES[cat.id]] ?? 0} opportunities
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#687995]">
                      {cat.description}
                    </p>
                    <Link
                      href={cat.link}
                      className="mt-4 flex items-center gap-1 text-[13px] font-semibold transition-all hover:gap-2"
                      style={{ color: cat.linkColor }}
                    >
                      {cat.linkLabel} →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </main>
  )
}