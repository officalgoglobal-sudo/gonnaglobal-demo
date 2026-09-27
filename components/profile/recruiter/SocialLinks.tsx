"use client"

import Input from "@/components/ui/Input"
import { useState } from "react"
interface SocialLinksProps {
  companyLinkedin: string
  setCompanyLinkedin: (
    value: string
  ) => void

  companyInstagram: string
  setCompanyInstagram: (
    value: string
  ) => void

  companyTwitter: string
  setCompanyTwitter: (
    value: string
  ) => void

  companyYoutube: string
  setCompanyYoutube: (
    value: string
  ) => void

  companyGithub: string
  setCompanyGithub: (
    value: string
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function SocialLinks({
  companyLinkedin,
  setCompanyLinkedin,
  companyInstagram,
  setCompanyInstagram,
  companyTwitter,
  setCompanyTwitter,
  companyYoutube,
  setCompanyYoutube,
  companyGithub,
  setCompanyGithub,
  handleSaveProfile,
}: SocialLinksProps) {
  const [error, setError] = useState("")
  return (

    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
        Social Links
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">
        Connect students with your organization.
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            LinkedIn Page
          </label>

          <Input
            value={companyLinkedin}
            onChange={(e) =>
              setCompanyLinkedin(e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Instagram
          </label>

          <Input
            value={companyInstagram}
            onChange={(e) =>
              setCompanyInstagram(e.target.value)
            }
          />
        </div>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            X / Twitter
          </label>

          <Input
            value={companyTwitter}
            onChange={(e) =>
              setCompanyTwitter(e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            YouTube
          </label>

          <Input
            value={companyYoutube}
            onChange={(e) =>
              setCompanyYoutube(e.target.value)
            }
          />
        </div>

      </div>

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
          GitHub
        </label>

        <Input
          value={companyGithub}
          onChange={(e) =>
            setCompanyGithub(e.target.value)
          }
        />

      </div>
      {error && (
  <p className="mt-8 text-sm text-red-500">
    {error}
  </p>
)}
      <button
  onClick={() => {

    if (
      !companyLinkedin.trim()
    ) {

      setError(
        "LinkedIn page is required"
      )

      return
    }

    setError("")

    handleSaveProfile(
      "Social Links"
    )

  }}
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >
        Save Social Links
      </button>

    </div>

  )

}