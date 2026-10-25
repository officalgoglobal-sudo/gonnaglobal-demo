"use client"

import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

import Link from "next/link"

import { useEffect, useMemo, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Search, Globe, Building2, ExternalLink } from "lucide-react"

type Institution = {
  id: string
  name: string
  country: string
  institutionType: string
  website: string
  bio: string
  logo: string
}

export default function UniversitiesPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadInstitutions() {
      try {
        const snapshot = await getDocs(collection(db, "users"))

        const records = snapshot.docs
          .map((item) => {
            const data = item.data()
            const roles = Array.isArray(data.roles) ? data.roles : []
            const isInstitution =
              data.activeRole === "institution" ||
              data.role === "institution" ||
              roles.includes("institution") ||
              data.role === "recruiter" ||
              data.activeRole === "recruiter" ||
              roles.includes("recruiter")

            if (!isInstitution || data.publicProfile === false) return null

            const name = String(
              data.institutionName ||
              data.organizationName ||
              data.fullName ||
              data.displayName ||
              ""
            ).trim()

            if (!name) return null

            return {
              id: item.id,
              name,
              country: String(data.country || data.address || ""),
              institutionType: String(data.institutionType || ""),
              website: String(data.website || ""),
              bio: String(data.aboutInstitution || data.bio || data.description || ""),
              logo: String(
                data.logoUrl ||
                data.photoURL ||
                data.profilePhoto ||
                data.profileImage ||
                data.imageUrl ||
                ""
              ),
            }
          })
          .filter((item): item is Institution => item !== null)
          .sort((a, b) => a.name.localeCompare(b.name))

        if (active) setInstitutions(records)
      } catch (err) {
        console.error("Failed to load institution accounts:", err)
        if (active) setError("Could not load institution accounts. Please try again later.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadInstitutions()
    return () => {
      active = false
    }
  }, [])

  const filteredInstitutions = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return institutions

    return institutions.filter((institution) =>
      [
        institution.name,
        institution.country,
        institution.institutionType,
        institution.bio,
      ].some((value) => value.toLowerCase().includes(term))
    )
  }, [institutions, search])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A2E]">
      <Sidebar />
      <div className="min-w-0 lg:ml-[80px]">
        <Topbar />
        <main className="min-h-screen bg-[#FAFAFA]">
      <div className="relative overflow-hidden">
        <img
          src="/uni-oxford.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative flex items-start justify-between gap-6 px-8 py-10 lg:px-12">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
              Universities & Institutions
            </p>
            <h1
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              className="mb-2 text-[36px] font-black text-[#1A1A2E]"
            >
              Explore Universities Worldwide
            </h1>
            <p className="max-w-2xl text-[14px] text-[#6B6B6B]">
              Discover universities and institutions with accounts on Gonn&apos;a Global.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-3 rounded-2xl border border-[#DBEAFE] bg-white/90 px-5 py-4 backdrop-blur-sm lg:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF]">
              <Globe className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1A1A2E]">Registered Institutions</p>
              <p className="text-[12px] font-semibold text-[#2563EB]">
                {loading ? "Loading..." : `${institutions.length} listed`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 lg:px-12">
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-[#ABABAB]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by institution name, country, or type..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#B0B0B0]"
          />
        </div>

        <p className="mb-5 text-[14px] font-bold text-[#1A1A2E]">
          {loading ? "Loading institutions..." : `${filteredInstitutions.length} Institutions`}
        </p>

        {error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-[#E0E0E0] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#687995]">Loading institution accounts...</p>
          </div>
        ) : filteredInstitutions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8DDE8] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3FF]">
              <Globe className="h-7 w-7 text-[#2563EB]" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1A2E]">
              {search ? "No matching institutions" : "No institution accounts found"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687995]">
              {search
                ? "Try a different name, country, or institution type."
                : "Registered institution accounts will appear here once their profiles contain a name."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredInstitutions.map((institution) => (
              <Link
                key={institution.id}
                href={`/institution/${institution.id}`}
                className="block rounded-2xl border border-[#E5E7EB] bg-white p-5 transition hover:border-[#BFDBFE] hover:shadow-sm"
              >
                <div className="mb-4 flex items-start gap-3">
                  {institution.logo ? (
                    <img
                      src={institution.logo}
                      alt=""
                      className="h-12 w-12 rounded-xl border border-[#E5E7EB] object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF]">
                      <Building2 className="h-6 w-6 text-[#2563EB]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-bold text-[#1A1A2E]">{institution.name}</h2>
                    {institution.institutionType && (
                      <p className="mt-1 text-xs text-[#687995]">{institution.institutionType}</p>
                    )}
                  </div>
                </div>

                {institution.country && (
                  <p className="mb-2 text-sm text-[#687995]">{institution.country}</p>
                )}
                {institution.bio && (
                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-[#5A5A6A]">
                    {institution.bio}
                  </p>
                )}
                {institution.website && (
                  <p className="break-all text-sm text-[#2563EB]">
                    Website: {institution.website}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
      </div>
    </div>
  )
}
