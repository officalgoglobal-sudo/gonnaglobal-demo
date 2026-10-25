"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  Bookmark,
  ExternalLink,
  FileText,
  Clock,
  Loader2,
} from "lucide-react"

type Activity = {
  id: string
  title: string
  sub: string
  date: Date | null
  type: "application" | "saved" | "viewed"
}

export default function RecentActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        setActivities([])
        setLoading(false)
        router.replace("/login")
        return
      }

      setLoading(true)
      setError("")

      try {
        const [applicationsSnap, savedSnap, viewedSnap] = await Promise.all([
          getDocs(query(collection(db, "applications"), where("userId", "==", currentUser.uid))),
          getDocs(query(collection(db, "savedOpportunities"), where("userId", "==", currentUser.uid))),
          getDocs(query(
            collection(db, "recentlyViewedOpportunities"),
            where("userId", "==", currentUser.uid),
            orderBy("viewedAt", "desc"),
            limit(10)
          )),
        ])

        const rows: Activity[] = []

        const opportunityCache = new Map<string, any>()
        const getOpportunity = async (id: string) => {
          if (!id) return {}
          if (opportunityCache.has(id)) return opportunityCache.get(id)
          const snapshot = await getDoc(doc(db, "opportunities", id))
          const data = snapshot.exists() ? snapshot.data() : {}
          opportunityCache.set(id, data)
          return data
        }

        await Promise.all([
          ...applicationsSnap.docs.map(async item => {
            const data = item.data()
            const opportunity = await getOpportunity(data.opportunityId || "")
            rows.push({
              id: "application-" + item.id,
              type: "application",
              title: "Applied for " + (opportunity.title || opportunity.name || "an opportunity"),
              sub: opportunity.organization || opportunity.company || opportunity.university || "Opportunity",
              date: data.createdAt?.toDate?.() || data.appliedAt?.toDate?.() || data.updatedAt?.toDate?.() || null,
            })
          }),
          ...savedSnap.docs.map(async item => {
            const data = item.data()
            const opportunityId = data.opportunityId ||
              (item.id.startsWith(currentUser.uid + "_") ? item.id.slice(currentUser.uid.length + 1) : "")
            const opportunity = await getOpportunity(opportunityId)
            rows.push({
              id: "saved-" + item.id,
              type: "saved",
              title: "Saved an opportunity",
              sub: opportunity.title || opportunity.name || "Opportunity",
              date: data.createdAt?.toDate?.() || data.savedAt?.toDate?.() || null,
            })
          }),
        ])

        viewedSnap.docs.forEach(item => {
          const viewed = item.data()
          rows.push({
            id: "viewed-" + item.id,
            type: "viewed",
            title: "Viewed an opportunity",
            sub: viewed.title || "Opportunity",
            date: viewed.viewedAt?.toDate?.() || null,
          })
        })

        rows.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
        setActivities(rows)
      } catch (err) {
        console.error("Could not load recent activity:", err)
        setError("Couldn't load your activity. Please refresh and try again.")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }) : "Date unavailable"

  const iconFor = (type: Activity["type"]) => {
    if (type === "application") return FileText
    if (type === "saved") return Bookmark
    return ExternalLink
  }

  const colorFor = (type: Activity["type"]) => {
    if (type === "application") return "bg-blue-100 text-blue-600"
    if (type === "saved") return "bg-emerald-100 text-emerald-600"
    return "bg-violet-100 text-violet-600"
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-24 lg:ml-[80px] lg:pb-0">
      <Sidebar />
      <Topbar />
      <div className="border-b border-[#EBEBEB] bg-white px-6 py-3 text-[13px] text-[#687995]">
        <Link href="/" className="hover:text-[#2563EB]">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/profile" className="hover:text-[#2563EB]">My Profile</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-[#1A1A2E]">Recent Activity</span>
      </div>
      <div className="px-6 py-8">
        <div className="mx-auto w-full max-w-6xl">
        <header className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">
            Your journey
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">
            Recent Activity
          </h1>
          <p className="mt-2 text-sm text-[#687995]">
            Your applications, saved opportunities, and up to 10 recently viewed opportunities.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-[#687995]">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading your activity...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F3FA] text-[#687995]">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="font-semibold text-[#1A1A2E]">No activity yet</h2>
              <p className="mt-2 text-sm text-[#687995]">
                Explore opportunities, save ones you like, or submit an application. Your activity will appear here.
              </p>
              <Link
                href="/explore"
                className="mt-5 inline-flex rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Explore opportunities
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F1F5]">
              {activities.map(activity => {
                const Icon = iconFor(activity.type)
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-5 sm:p-6">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorFor(activity.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-[#1A1A2E]">
                        {activity.title}
                      </h2>
                      <p className="mt-1 break-words text-sm text-[#687995]">
                        {activity.sub}
                      </p>
                      <p className="mt-2 text-xs text-[#929DB0]">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
        </div>
      </div>
    </main>
  )
}
