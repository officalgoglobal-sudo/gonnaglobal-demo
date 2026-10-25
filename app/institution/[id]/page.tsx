"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { MapPin, Globe, Mail, Phone, Building2, BriefcaseBusiness, GraduationCap, ExternalLink } from "lucide-react"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-[#1A1A2E]">{title}</h2>
      {children}
    </section>
  )
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-1 block break-words text-sm font-medium text-blue-600 hover:underline">
          {value} <ExternalLink className="ml-1 inline h-3 w-3" />
        </a>
      ) : (
        <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
      )}
    </div>
  )
}

export default function PublicInstitutionProfilePage() {
  const params = useParams()
  const id = String(params.id ?? "")
  const [institution, setInstitution] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const snapshot = await getDoc(doc(db, "users", id))
        if (!active) return

        if (!snapshot.exists()) {
          setError("This institution could not be found.")
          return
        }

        const data = snapshot.data()
        if (data.publicProfile === false) {
          setError("This institution has made its profile private.")
          return
        }

        setInstitution({ uid: snapshot.id, ...data })

        const result = await getDocs(
          query(collection(db, "opportunities"), where("createdBy", "==", id))
        )
        if (!active) return

        setOpportunities(
          result.docs
            .map(item => ({ id: item.id, ...item.data() }))
            .filter((item: any) =>
              !["closed", "rejected", "inactive"].includes(String(item.status || "").toLowerCase()) &&
              item.isActive !== false
            )
        )
      } catch (err) {
        console.error("Unable to load public institution profile:", err)
        if (active) setError("Unable to load this profile. Please try again later.")
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) void loadProfile()
    else {
      setError("Invalid institution profile link.")
      setLoading(false)
    }

    return () => { active = false }
  }, [id])

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC]"><p className="text-sm text-slate-500">Loading public institution profile...</p></main>
  }

  if (error || !institution) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC] p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "This profile could not be found."}</p>
          <a href="/profile" className="mt-5 inline-block font-semibold text-blue-600">Back to profile</a>
        </div>
      </main>
    )
  }

  const name = institution.institutionName || institution.organizationName || institution.fullName || institution.displayName || "Institution"
  const logo = institution.logoUrl || institution.photoURL || institution.profilePhoto || institution.profileImage || institution.imageUrl || ""
  const about = institution.aboutInstitution || institution.bio || institution.description || ""
  const location = [institution.address, institution.country].filter(Boolean).join(", ")
  const website = String(institution.website || "").trim()
  const websiteHref = website ? (/^https?:\/\//i.test(website) ? website : `https://${website}`) : ""
  const completionSections = [
    {
      label: "Basic Information",
      done: Boolean(name && name !== "Institution" && (institution.email || institution.phone)),
    },
    {
      label: "Institution Details",
      done: Boolean(institution.institutionType && institution.aboutInstitution),
    },
    {
      label: "Programs Offered",
      done: Array.isArray(institution.programs)
        ? institution.programs.length > 0
        : Boolean(institution.programs),
    },
    {
      label: "Location & Website",
      done: Boolean((institution.address || institution.location) && institution.website),
    },
    {
      label: "Social Links",
      done: Boolean(institution.linkedin || institution.instagram || institution.facebook || institution.xUrl || institution.youtube),
    },
    {
      label: "Add Brochure / Media",
      done: Boolean(institution.catalogUrl || institution.bannerUrl || institution.coverImage || institution.gallery?.length),
    },
  ]
  const completedSections = completionSections.filter(section => section.done).length
  const completionPercent = Math.round((completedSections / completionSections.length) * 100)

  const socials = [
    ["LinkedIn", institution.linkedin],
    ["Instagram", institution.instagram],
    ["Facebook", institution.facebook],
    ["YouTube", institution.youtube],
  ].filter((item): item is [string, string] => typeof item[1] === "string" && !!item[1].trim())

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1A1A2E]">
      <Sidebar />
      <div className="min-w-0 lg:ml-[80px]">
        <Topbar />
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8 xl:px-12">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-r from-slate-300 to-blue-300 sm:h-56">
              {institution.bannerUrl || institution.coverImage ? (
                <img src={institution.bannerUrl || institution.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80" alt="Institution campus cover" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-blue-900/25" />
              <div className="absolute bottom-5 left-6 text-white drop-shadow sm:left-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Institution Profile</p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">{name}</p>
              </div>
            </div>

            <div className="px-6 pb-7 pt-5 sm:px-9">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 text-3xl font-bold text-slate-400 shadow-sm sm:-mt-12">
                  {logo ? <img src={logo} alt={`${name} logo`} className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 break-words pb-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
  {institution.institutionType
    ? `${institution.institutionType} Institution`
    : "Institution"}
</p>
                  <h1 className="mt-1 break-words text-2xl font-bold sm:text-3xl">{name}</h1>
                  {institution.tagline && <p className="mt-1 break-words text-sm text-slate-500">{institution.tagline}</p>}
                  {location && <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4" />{location}</p>}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (navigator.share) await navigator.share({ title: `${name} public profile`, url: window.location.href })
                      else {
                        await navigator.clipboard.writeText(window.location.href)
                        alert("Institution profile link copied!")
                      }
                    } catch (err) {
                      if (!(err instanceof Error && err.name === "AbortError")) alert("Couldn't share automatically. Copy the profile URL from your browser.")
                    }
                  }}
                  className="shrink-0 self-start rounded-full border border-[#2563EB] px-5 py-2.5 text-sm font-semibold text-[#2563EB] hover:bg-[#EEF3FF] sm:ml-auto"
                >
                  Share Profile
                </button>
              </div>
            </div>
          </section>

          <div className="mx-auto mt-6 w-full max-w-[1200px] columns-1 gap-6 md:columns-2 [&>section]:mb-6 [&>section]:break-inside-avoid">
            



            
              <Section title="About the Institution">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{about || "No institution introduction has been added yet."}</p>
              </Section>

              <Section title="Institution Details">
                <div className="space-y-4">
                  <Detail label="Institution Name" value={name} />
                  <Detail label="Institution Type" value={institution.institutionType || "Not provided"} />
                  <Detail label="Established" value={String(institution.established || "Not provided")} />
                  <Detail label="Accreditation" value={institution.accreditation || "Not provided"} />
                  <Detail label="Student Strength" value={String(institution.studentStrength || "Not provided")} />
                  <Detail label="Location" value={location || institution.location || "Not provided"} />
                </div>
              </Section>

              <Section title="Gallery">
                {Array.isArray(institution.gallery) && institution.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {institution.gallery.map((item: any, index: number) => {
                      const src = typeof item === "string" ? item : item.url || item.imageUrl || item.src
                      return src ? <img key={item.id || src || index} src={src} alt={item.title || `${name} gallery ${index + 1}`} className="h-36 w-full rounded-xl object-cover" /> : null
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No gallery photos have been added yet.</p>
                )}
              </Section>

            
              <Section title="Contact & Website">
                <div className="space-y-4">
                  <Detail label="Email" value={institution.email || "Not provided"} href={institution.email ? `mailto:${institution.email}` : undefined} />
                  <Detail label="Phone" value={institution.phone || "Not provided"} href={institution.phone ? `tel:${institution.phone}` : undefined} />
                  <Detail label="Website" value={website || "Not provided"} href={websiteHref || undefined} />
                  {institution.catalogUrl && <Detail label="Brochure" value="View institution brochure" href={/^https?:\/\//i.test(institution.catalogUrl) ? institution.catalogUrl : `https://${institution.catalogUrl}`} />}
                </div>
              </Section>

              <Section title="Social Links">
                {socials.length ? (
                  <div className="space-y-4">
                    {socials.map(([label, value]) => {
                      const href = /^https?:\/\//i.test(value) ? value : `https://${value}`
                      return <Detail key={label} label={label} value={value} href={href} />
                    })}
                  </div>
                ) : <p className="text-sm text-slate-500">No social links have been added yet.</p>}
              </Section>

              <Section title="Active Opportunities">
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                  <BriefcaseBusiness className="h-4 w-4" /> {opportunities.length} opportunities available
                </div>
                {opportunities.length ? (
                  <div className="space-y-4">
                    {opportunities.map((item: any) => (
                      <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                        <h3 className="font-semibold text-slate-800">{item.title || item.name || "Opportunity"}</h3>
                        <p className="mt-1 text-sm text-slate-500">{[item.type, item.location, item.mode].filter(Boolean).join(" · ") || "Opportunity"}</p>
                        {item.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>}
                        <a href={`/opportunity/${encodeURIComponent(item.id)}`} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                          View Opportunity <BriefcaseBusiness className="h-4 w-4" />
                        </a>
                      </article>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500">No active opportunities are listed right now.</p>}
              </Section>

              {institution.programs && (
                <Section title="Programs">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {Array.isArray(institution.programs) ? institution.programs.join(", ") : String(institution.programs)}
                  </p>
                </Section>
              )}
          </div>
        </main>
      </div>
    </div>
  )
}
