"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore"
import { ExternalLink, Users, BriefcaseBusiness, CalendarDays, RefreshCw } from "lucide-react"
import { auth, db } from "@/lib/firebase"

type Applicant = {
  id: string
  userId: string
  opportunityId: string
  opportunityTitle: string
  appliedAt?: any
  name: string
  email: string
  status: string
  photoURL: string
}

export default function InstitutionApplications({ user }: { user: any }) {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const uid = user?.uid || auth.currentUser?.uid

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!uid) {
        setError("Please sign in again to view applications.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")

      try {
        const snap = await getDocs(query(
          collection(db, "applications"),
          where("recruiterId", "==", uid)
        ))

        const results = await Promise.all(snap.docs.map(async applicationDoc => {
          const a = applicationDoc.data()
          if (!a.userId || !a.opportunityId) return null

          const [opSnap, userSnap] = await Promise.all([
            getDoc(doc(db, "opportunities", a.opportunityId)),
            getDoc(doc(db, "users", a.userId))
          ])

          // Only show applications for opportunities owned by this institution.
          if (!opSnap.exists() || opSnap.data().createdBy !== uid || !userSnap.exists()) {
            return null
          }

          const op = opSnap.data()
          const applicant = userSnap.data()

          return {
            id: applicationDoc.id,
            userId: a.userId,
            opportunityId: a.opportunityId,
            opportunityTitle: op.title || "Untitled opportunity",
            appliedAt: a.appliedAt,
            name: applicant.fullName || applicant.displayName || applicant.name || "Applicant",
            email: applicant.email || "",
            status: a.status || "Applied",
            photoURL: applicant.photoURL || applicant.photoUrl || applicant.avatarUrl || ""
          } as Applicant
        }))

        if (!cancelled) {
          setApplicants(results.filter((x): x is Applicant => x !== null).sort((a, b) => {
            const ms = (v: any) => v?.toDate?.()?.getTime?.() || 0
            return ms(b.appliedAt) - ms(a.appliedAt)
          }))
        }
      } catch (e) {
        console.error("Unable to load institution applications:", e)
        if (!cancelled) setError("Couldn't load applications. Please try again.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [uid, refreshKey])

  async function updateApplicationStatus(applicationId: string, status: string) {
    if (!uid) return
    try {
      // Re-check that the application belongs to an opportunity owned by this institution.
      const applicationRef = doc(db, "applications", applicationId)
      const applicationSnap = await getDoc(applicationRef)
      if (!applicationSnap.exists()) throw new Error("Application not found.")

      const application = applicationSnap.data()
      if (application.recruiterId !== uid || !application.opportunityId) {
        throw new Error("You cannot update this application.")
      }

      const opportunitySnap = await getDoc(doc(db, "opportunities", application.opportunityId))
      if (!opportunitySnap.exists() || opportunitySnap.data().createdBy !== uid) {
        throw new Error("This opportunity does not belong to your institution.")
      }

      await updateDoc(applicationRef, { status })
      setApplicants(current => current.map(item =>
        item.id === applicationId ? { ...item, status } : item
      ))
    } catch (e) {
      console.error("Could not update application status:", e)
      setError("Couldn't update this application status. Please try again.")
    }
  }

  const formatDate = (value: any) => {
    const date = value?.toDate?.()
    return date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
      : ""
  }

  return (
    <main className="min-h-[60vh] bg-[#F8F5F0] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7355]">Institution dashboard</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#2B1D16] sm:text-3xl">View Applications</h2>
            <p className="mt-2 text-sm text-[#6B5B52]">Review applicants for opportunities posted by your institution.</p>
          </div>
          <button onClick={() => setRefreshKey(v => v + 1)} className="inline-flex items-center gap-2 rounded-xl border border-[#E7DDD1] bg-[#FFFDF9] px-4 py-2.5 text-sm font-semibold text-[#2B1D16] hover:bg-white">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </header>

        <section className="flex items-center gap-4 rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EEFF] text-[#2563EB]"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm text-[#8B7355]">Total applications received</p>
            <p className="text-2xl font-bold text-[#2B1D16]">{loading ? "—" : applicants.length}</p>
          </div>
        </section>

        {loading && <div className="rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] p-10 text-center text-sm text-[#6B5B52]">Loading applications…</div>}
        {!loading && error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}

        {!loading && !error && applicants.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#D9C9B8] bg-[#FFFDF9] px-6 py-14 text-center">
            <Users className="mx-auto h-10 w-10 text-[#B5A18C]" />
            <h3 className="mt-4 text-lg font-semibold text-[#2B1D16]">No applications yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B5B52]">Applications for your posted opportunities will appear here when students apply.</p>
          </div>
        )}

        {!loading && applicants.length > 0 && (
          <div className="space-y-4">
            {applicants.map(a => (
              <article key={a.id} className="rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EFE7DC] text-lg font-bold text-[#6B5B52]">
                    {a.photoURL ? <img src={a.photoURL} alt="" className="h-full w-full object-cover" /> : a.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#2B1D16]">{a.name}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === "Approved" ? "bg-[#E8F5E9] text-[#287342]" :
                        a.status === "Rejected" ? "bg-[#FDECEC] text-[#B42318]" :
                        a.status === "Reviewing" ? "bg-[#FFF0DB] text-[#9A5A12]" :
                        "bg-[#E8EEFF] text-[#2563EB]"
                      }`}>{a.status}</span>
                    </div>
                    {a.email && <p className="mt-1 break-all text-sm text-[#6B5B52]">{a.email}</p>}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#6B5B52]">
                      <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-[#8B7355]" />{a.opportunityTitle}</span>
                      {formatDate(a.appliedAt) && <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#8B7355]" />Applied {formatDate(a.appliedAt)}</span>}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <label htmlFor={`status-${a.id}`} className="text-sm font-medium text-[#6B5B52]">
                        Application status
                      </label>
                      <select
                        id={`status-${a.id}`}
                        value={["Applied", "Reviewing", "Approved", "Rejected"].includes(a.status) ? a.status : "Applied"}
                        onChange={e => void updateApplicationStatus(a.id, e.target.value)}
                        className="rounded-xl border border-[#E7DDD1] bg-white px-3 py-2 text-sm font-medium text-[#2B1D16] outline-none focus:border-[#2563EB]"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <a href={`/student/${encodeURIComponent(a.userId)}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">
                      View Public Profile <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
