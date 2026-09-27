import Input from "@/components/ui/Input"
import { useState } from "react"
interface SocialProfilesProps {
  linkedin: string
  setLinkedin: (
    value: string
  ) => void

  portfolio: string
  setPortfolio: (
    value: string
  ) => void

  instagram: string
  setInstagram: (
    value: string
  ) => void

  youtube: string

setYoutube: (
  value: string
) => void

handleSaveProfile: (
  sectionName?: string
) => void
}

export default function SocialProfiles({
  linkedin,
  setLinkedin,
  portfolio,
  setPortfolio,
  instagram,
  setInstagram,
  youtube,
  setYoutube,
  handleSaveProfile,
}: SocialProfilesProps) {
  const [linkedinError, setLinkedinError] =
  useState("")
  return (

    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">

        Social Profiles

      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">

        Build your online presence.

      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <div>

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            LinkedIn URL
          </label>

          <Input
            value={linkedin}
            onChange={(e) =>
              setLinkedin(e.target.value)
            }
          />
          {linkedinError && (
  <p className="mt-2 text-sm text-red-500">
    {linkedinError}
  </p>
)}

        </div>

        <div>

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Portfolio URL
          </label>

          <Input
            value={portfolio}
            onChange={(e) =>
              setPortfolio(e.target.value)
            }
          />

        </div>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <div>

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Instagram
          </label>

          <Input
            value={instagram}
            onChange={(e) =>
              setInstagram(e.target.value)
            }
          />

        </div>

        <div>

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
          YouTube Handle
          </label>

          <Input
            value={youtube}
            onChange={(e) =>
              setYoutube(e.target.value)
            }
          />

        </div>

      </div>

      <button
        onClick={() => {

          if (!linkedin.trim()) {
        
            setLinkedinError(
              "LinkedIn profile is required"
            )
        
            return
        
          }
        
          setLinkedinError("")
        
          handleSaveProfile(
            "Social Profiles"
          )
        
        }}
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >

        Save Social Profiles

      </button>

    </div>

  )

}