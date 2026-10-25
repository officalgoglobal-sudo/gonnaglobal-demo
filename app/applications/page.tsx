"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection, doc, getDoc, getDocs, query, where
} from "firebase/firestore"
import {
  ArrowRight, BriefcaseBusiness, CalendarDays,
  ExternalLink, FileText, RefreshCw, Search
} from "lucide-react"

import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Footer from "@/components/home/Footer"
import InstitutionApplications from "@/app/profile/InstitutionApplications"
import { auth, db } from "@/lib/firebase"

type ApplicationItem = {
  id: string
  opportunityId: string
  opportunityTitle: string
  organization: string
  status: string
  appliedAt: any
  external: boolean
}

function normalizeStatus(status: unknown) {
  const value = String(status || "Applied").trim().toLowerCase()
  if (["accepted", "approved"].includes(value)) return "Accepted"
  if (["rejected", "declined"].includes(value)) return "Rejected"
  if (["in review", "reviewing", "under review"].includes(value)) return "In Review"
  return "Applied"
}

function formatDate(value: any) {
  const date = value?.toDate?.()
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, {
        day: "numeric", month: "short", year: "numeric"
      })
    : ""
}

function statusClasses(status: string) {
  if (status === "Accepted") return "bg-emerald-50 text-emerald-700"
  if (status === "Rejected") return "bg-red-50 text-red-700"
  if (status === "In Review") return "bg-amber-50 text-amber-700"
  return "bg-blue-50 text-blue-700"
}

export default function ApplicationsPage() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState("")
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setApplications([])
      setError("")

      if (!currentUser) {
        setRole("")
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid))
        const userData = userSnap.data()
        const currentRole = String(
          userData?.activeRole || userData?.role || "user"
        ).toLowerCase()
        setRole(currentRole)

        if (["institution", "recruiter"].includes(currentRole)) {
          setLoading(false)
          return
        }

        const snapshot = await getDocs(query(
          collection(db, "applications"),
          where("userId", "==", currentUser.uid)
        ))

        const rows = await Promise.all(snapshot.docs.map(async (applicationDoc) => {
          const data = applicationDoc.data()
          if (!data.opportunityId) return null

          const opportunitySnap = await getDoc(
            doc(db, "opportunities", data.opportunityId)
          )
          const opportunity = opportunitySnap.exists()
            ? opportunitySnap.data()
            : {}

          return {
            id: applicationDoc.id,
            opportunityId: data.opportunityId,
            opportunityTitle: opportunity.title || opportunity.name || "Opportunity",
            organization: opportunity.organization ||
              opportunity.company || opportunity.university || "",
            status: normalizeStatus(data.status),
            appliedAt: data.appliedAt || data.createdAt || data.updatedAt || null,
            external: Boolean(data.external),
          } satisfies ApplicationItem
        }))

        setApplications(rows.filter(
          (row): row is ApplicationItem => row !== null
        ).sort((a, b) => {
          const time = (value: any) => value?.toDate?.()?.getTime?.() || 0
          return time(b.appliedAt) - time(a.appliedAt)
        }))
      } catch (err) {
        console.error("Unable to load applications:", err)
        setError("Couldn't load your applications. Please try again.")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [refreshKey])

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return applications
    return applications.filter((item) =>
      `${item.opportunityTitle} ${item.organization} ${item.status}`
        .toLowerCase().includes(term)
    )
  }, [applications, search])

  const isInstitution = ["institution", "recruiter"].includes(role)

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 text-black">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[80px]">
        <Topbar />

        <section className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[20px] border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
                {isInstitution ? "Institution dashboard" : "Your progress"}
              </p>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {isInstitution ? "Applications Received" : "My Applications"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                    {isInstitution
                      ? "Review applicants for opportunities posted by your institution."
                      : "Track your submitted applications and follow their progress."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRefreshKey((value) => value + 1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              </div>

              {!isInstitution && (
                <div className="mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-[#2563EB]">
                  <Search className="h-5 w-5 shrink-0 text-gray-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by opportunity or status..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              )}
            </div>

            {!user && !loading && (
              <div className="mt-6 rounded-[18px] border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
                <FileText className="mx-auto h-10 w-10 text-gray-400" />
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  Sign in to view applications
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Sign in to see your application history.
                </p>
                <Link href="/login?redirect=/applications" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Sign in <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {user && isInstitution && (
              <div className="mt-6">
                <InstitutionApplications key={refreshKey} user={user} />
              </div>
            )}

            {user && !isInstitution && (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Total applications", value: applications.length },
                    { label: "In review", value: applications.filter((a) => a.status === "In Review").length },
                    { label: "Accepted", value: applications.filter((a) => a.status === "Accepted").length },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {loading ? "—" : stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
                    Loading applications…
                  </div>
                )}

                {!loading && error && (
                  <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {!loading && !error && filteredApplications.length === 0 && (
                  <div className="mt-6 rounded-[18px] border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                      <FileText className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-900">
                      {search.trim() ? "No matching applications" : "No applications to show yet"}
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                      {search.trim()
                        ? "Try another opportunity name or status."
                        : "When you apply for an opportunity, it will appear here."}
                    </p>
                    <Link href="/explore" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                      Explore opportunities <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}

                {!loading && !error && filteredApplications.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {filteredApplications.map((item) => (
                      <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                            <BriefcaseBusiness className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-bold text-gray-900">{item.opportunityTitle}</h2>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                            {item.organization && (
                              <p className="mt-1 text-sm text-gray-500">{item.organization}</p>
                            )}
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                              {formatDate(item.appliedAt) && (
                                <span className="inline-flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  Applied {formatDate(item.appliedAt)}
                                </span>
                              )}
                              {item.external && <span>External application</span>}
                            </div>
                            <Link href={`/opportunity/${encodeURIComponent(item.opportunityId)}`} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                              View opportunity <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <div className="mt-auto -mx-5 sm:-mx-8 lg:-mx-10">
          <Footer />
        </div>
      </div>
    </main>
  )
}
