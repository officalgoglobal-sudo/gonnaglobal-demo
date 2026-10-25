"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-[#1A1A2E]">{title}</h2>
      {children}
    </section>
  )
}

export default function PublicMentorProfilePage() {
  const params = useParams()
  const id = String(params.id ?? "")
  const [mentor, setMentor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const snapshot = await getDoc(doc(db, "users", id))
        if (!active) return

        if (!snapshot.exists()) {
          setError("This profile could not be found.")
        } else {
          const data = snapshot.data()
          setMentor(data)
        }
      } catch (err) {
        console.error("Unable to load public mentor profile:", err)
        if (active) setError("Unable to load this profile. Please try again later.")
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) void loadProfile()
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
        <p className="text-sm text-slate-500">Loading public mentor profile...</p>
      </main>
    )
  }

  if (error || !mentor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC] p-6">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "This profile could not be found."}</p>
          <a href="/profile" className="mt-5 inline-block font-semibold text-blue-600">
            Back to profile
          </a>
        </div>
      </main>
    )
  }

  const name = mentor.fullName || mentor.displayName || "Mentor"
  const photo = mentor.photoURL || mentor.profilePhoto || ""
  const mentorshipAreas = Array.isArray(mentor.mentorshipAreas) ? mentor.mentorshipAreas : []
  const experiences = Array.isArray(mentor.experiences) ? mentor.experiences : []
  const education = Array.isArray(mentor.education) ? mentor.education : []
  const languages = Array.isArray(mentor.languages) ? mentor.languages : []
  const professionalDetails = [
    ["Professional Title", mentor.professionalTitle || "Founder"],
    ["Headline", mentor.headline || "Developer"],
    ["Current Role", mentor.currentRole || "CEO"],
    ["Company", mentor.company || "Gonn'a Global"],
    ["LinkedIn", mentor.linkedinUrl || mentor.linkedin || "Not provided"],
    ["Website / Portfolio", mentor.website || mentor.portfolio || "Not provided"],
  ]


  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-r from-slate-300 to-blue-300 sm:h-56">
  <img
    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"
    alt="Cover"
    className="h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-blue-900/20" />
  <div className="absolute left-1/2 top-8 -translate-x-1/4 text-center">
    <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Empowering</p>
    <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Global Talent</p>
  </div>
  <div className="absolute right-8 top-8 text-right text-white drop-shadow sm:right-16">
    {["Mentor", "Guide", "Support", "Grow"].map((word) => (
      <p key={word} className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>{word}</p>
    ))}
  </div>
</div>
            <div className="px-6 pb-7 sm:px-9">
              <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
                  {photo ? (
                    <img src={photo} alt={`${name}'s profile`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400">{name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                    Mentor Profile
                  </p>
                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{name}</h1>
                  {mentor.location && <p className="mt-1 text-sm text-slate-500">{mentor.location}</p>}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const url = window.location.href
                    try {
                      if (navigator.share) {
                        await navigator.share({ title: `${name}'s public profile`, url })
                      } else {
                        await navigator.clipboard.writeText(url)
                        alert("Public profile link copied!")
                      }
                    } catch (err) {
                      if (err instanceof Error && err.name !== "AbortError") {
                        alert("Couldn't share automatically. Copy the profile URL from your browser.")
                      }
                    }
                  }}
                  className="rounded-full border border-[#2563EB] px-5 py-2.5 text-sm font-semibold text-[#2563EB] hover:bg-[#EEF3FF] sm:ml-auto"
                >
                  Share Profile
                </button>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-5">
              <Section title="About Me">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                  {mentor.aboutMe || "No introduction added yet."}
                </p>
              </Section>

              <Section title="Areas of Mentorship">
                {mentorshipAreas.length ? (
                  <div className="flex flex-wrap gap-2">
                    {mentorshipAreas.map((area: string, index: number) => (
                      <span key={`${area}-${index}`} className="rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700">
                        {area}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500">No mentorship areas added yet.</p>}
              </Section>

              <Section title="Professional Experience">
                {experiences.length ? (
                  <div className="space-y-4">
                    {experiences.map((item: any, index: number) => (
                      <div key={item.id || index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-slate-800">{item.role || item.title || "Role"}</h3>
                        <p className="mt-1 text-sm text-slate-600">{item.company || ""}</p>
                        {(item.startDate || item.endDate) && (
                          <p className="mt-1 text-xs text-slate-500">
                            {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                          </p>
                        )}
                        {item.location && <p className="mt-1 text-xs text-slate-500">{item.location}</p>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500">No experience added yet.</p>}
              </Section>
            </div>

            <div className="space-y-5">
              <Section title="Professional Details">
                  <div className="space-y-4">
                    {professionalDetails.map(([label, value]) => {
                      const isLink = (label === "LinkedIn" || label === "Website / Portfolio") && value !== "Not provided"
                      const href = value.startsWith("http") ? value : `https://${value}`
                      return (
                        <div key={label} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <p className="text-xs font-medium text-slate-500">{label}</p>
                          {isLink ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="mt-1 block break-words text-sm font-medium text-blue-600 hover:underline">{value}</a>
                          ) : (
                            <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Section>

                <Section title="Education">
                {education.length ? (
                  <div className="space-y-4">
                    {education.map((item: any, index: number) => (
                      <div key={item.id || index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-slate-800">{item.institution || item.school || "Institution"}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {[item.degree, item.field].filter(Boolean).join(" · ")}
                        </p>
                        {(item.startDate || item.endDate) && (
                          <p className="mt-1 text-xs text-slate-500">
                            {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500">No education added yet.</p>}
              </Section>

              <Section title="Languages Known">
                {languages.length ? (
                  <div className="flex flex-wrap gap-2">
                    {languages.map((item: any, index: number) => (
                      <span key={index} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                        {typeof item === "string" ? item : item.name || item.language || "Language"}
                        {typeof item !== "string" && item.level ? ` · ${item.level}` : ""}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500">No languages added yet.</p>}
              </Section>
            </div>
          </div>

          <p className="py-8 text-center text-xs text-slate-400">
            Public profile · Information shared by the mentor
          </p>
        </main>
      </div>
    </div>
  )
}
