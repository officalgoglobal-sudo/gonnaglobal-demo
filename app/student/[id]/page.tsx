"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"

function asList(value: unknown): any[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-[#1A1A2E]">{title}</h2>
      {children}
    </section>
  )
}

export default function StudentProfilePage() {
  const params = useParams()
  const id = String(params.id ?? "")
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function fetchStudent() {
      try {
        const snapshot = await getDoc(doc(db, "users", id))

        if (!active) return

        if (!snapshot.exists()) {
          setError("This profile could not be found.")
        } else {
          setStudent(snapshot.data())
        }
      } catch (err) {
        console.error("Unable to load public profile:", err)
        if (active) {
          setError("Unable to load this profile. Please try again later.")
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) fetchStudent()
    else {
      setError("Invalid profile link.")
      setLoading(false)
    }

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC]">
        <p className="text-sm text-slate-500">Loading public profile...</p>
      </main>
    )
  }

  if (error || !student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC] p-6">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">
            {error || "This profile could not be found."}
          </p>
          <a href="/profile" className="mt-5 inline-block font-semibold text-blue-600">
            Back to profile
          </a>
        </div>
      </main>
    )
  }

  const education = asList(student.education)
  const interests = asList(student.interests)
  const skills = asList(student.skills)
  const languages = asList(student.languages)
  const careerGoals = asList(student.careerGoals)
  const name = student.fullName || student.displayName || "Student"
  const photo = student.photoURL || student.profilePhoto || ""

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />
        <main className="min-w-0">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-40 bg-slate-200 sm:h-56">
            <img
              src={student.bannerURL || student.bannerImage || student.coverURL || DEFAULT_BANNER}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="px-6 pb-7 sm:px-9">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 items-end gap-4">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
                {photo ? (
                  <img src={photo} alt={`${name}'s profile`} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-slate-400">
                    {name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="pb-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Student Profile
                </p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{name}</h1>
              </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const profileUrl = window.location.href
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: `${name}'s public profile`,
                        url: profileUrl,
                      })
                    } else {
                      await navigator.clipboard.writeText(profileUrl)
                      alert("Public profile link copied!")
                    }
                  } catch (error) {
                    if (error instanceof Error && error.name !== "AbortError") {
                      try {
                        await navigator.clipboard.writeText(profileUrl)
                        alert("Public profile link copied!")
                      } catch {
                        alert("Couldn't share automatically. Copy the profile URL from your browser.")
                      }
                    }
                  }
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#2563EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#2563EB] transition hover:bg-[#EEF3FF] sm:mb-1 sm:self-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2" />
                </svg>
                Share Profile
              </button>

            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="space-y-5">
            <Section title="About Me">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {student.aboutMe || "No introduction added yet."}
              </p>
            </Section>

            <Section title="Interests">
              {interests.length ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map((item, index) => (
                    <span key={index} className="rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700">
                      {typeof item === "string" ? item : item.name || item.label || ""}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">No interests added yet.</p>}
            </Section>

            <Section title="Skills">
              {skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((item, index) => (
                    <span key={index} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      {typeof item === "string" ? item : item.name || item.label || ""}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">No skills added yet.</p>}
            </Section>
          </div>

          <div className="space-y-5">
            <Section title="Career Goals">
              {careerGoals.length ? (
                <ul className="list-inside list-disc space-y-2 text-sm leading-6 text-slate-600">
                  {careerGoals.map((item, index) => (
                    <li key={index}>
                      {typeof item === "string" ? item : item.name || item.title || item.label || ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                  {typeof student.careerGoals === "string" && student.careerGoals.trim()
                    ? student.careerGoals
                    : "No career goals added yet."}
                </p>
              )}
            </Section>

            <Section title="Education">
              {education.length ? (
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-semibold text-slate-800">
                        {typeof edu === "string" ? edu : edu.institution || edu.school || edu.college || "Institution"}
                      </h3>
                      {typeof edu !== "string" && (
                        <>
                          {(edu.degree || edu.stream) && (
                            <p className="mt-1 text-sm text-slate-600">
                              {[edu.degree, edu.stream].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          {(edu.startYear || edu.endYear) && (
                            <p className="mt-1 text-xs text-slate-500">
                              {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">No education added yet.</p>}
            </Section>

            <Section title="Languages Known">
              {languages.length ? (
                <div className="flex flex-wrap gap-2">
                  {languages.map((item, index) => (
                    <span key={index} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                      {typeof item === "string" ? item : item.name || item.language || item.label || ""}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">No languages added yet.</p>}
            </Section>
          </div>
        </div>

        <p className="py-8 text-center text-xs text-slate-400">
          Public profile · Information shared by the student
        </p>
      </div>
        </main>
      </div>
    </div>
  )
}
