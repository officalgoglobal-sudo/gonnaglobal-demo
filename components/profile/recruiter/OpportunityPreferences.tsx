"use client"
import { useState } from "react"
interface OpportunityPreferencesProps {
  opportunityTypes: string[]
  setOpportunityTypes: (
    value: string[]
  ) => void

  eligibleRegions: string[]
  setEligibleRegions: (
    value: string[]
  ) => void

  educationLevels: string[]
  setEducationLevels: (
    value: string[]
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function OpportunityPreferences({
  opportunityTypes,
  setOpportunityTypes,
  eligibleRegions,
  setEligibleRegions,
  educationLevels,
  setEducationLevels,
  handleSaveProfile,
}: OpportunityPreferencesProps) {
  const [error, setError] = useState("")
  const opportunityOptions = [
    "Internships",
    "Jobs",
    "Scholarships",
    "Hackathons",
    "Fellowships",
    "Competitions",
    "Research Programs",
    "Conferences",
  ]

  const regionOptions = [
    "Global",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Oceania",
  ]

  const educationOptions = [
    "High School",
    "Gap Year / Dropper",
    "Undergraduate",
    "Graduate",
    "PhD",
    "Professionals",
  ]

  const toggleItem = (
    item: string,
    current: string[],
    setter: (value: string[]) => void
  ) => {

    if (current.includes(item)) {

      setter(
        current.filter(
          (i) => i !== item
        )
      )

    } else {

      setter([...current, item])

    }

  }

  return (

    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
        Opportunity Preferences
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">
        Define who you want to reach.
      </h2>

      {/* OPPORTUNITY TYPES */}

      <div className="mt-10">

        <label className="mb-4 block text-sm font-medium text-[#2B1D16]">
          Opportunity Types
        </label>

        <div className="flex flex-wrap gap-3">

          {opportunityOptions.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() =>
                toggleItem(
                  item,
                  opportunityTypes,
                  setOpportunityTypes
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                opportunityTypes.includes(item)
                  ? "bg-[#2563EB] text-white"
                  : "border border-[#E7DDD1] bg-[#FFFDF9] text-[#6B5B52]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* REGIONS */}

      <div className="mt-10">

        <label className="mb-4 block text-sm font-medium text-[#2B1D16]">
          Eligible Regions
        </label>

        <div className="flex flex-wrap gap-3">

          {regionOptions.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() =>
                toggleItem(
                  item,
                  eligibleRegions,
                  setEligibleRegions
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                eligibleRegions.includes(item)
                  ? "bg-[#2563EB] text-white"
                  : "border border-[#E7DDD1] bg-[#FFFDF9] text-[#6B5B52]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* EDUCATION */}

      <div className="mt-10">

        <label className="mb-4 block text-sm font-medium text-[#2B1D16]">
          Eligible Education Levels
        </label>

        <div className="flex flex-wrap gap-3">

          {educationOptions.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() =>
                toggleItem(
                  item,
                  educationLevels,
                  setEducationLevels
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                educationLevels.includes(item)
                  ? "bg-[#2563EB] text-white"
                  : "border border-[#E7DDD1] bg-[#FFFDF9] text-[#6B5B52]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>
      {error && (
  <p className="mt-8 text-sm text-red-500">
    {error}
  </p>
)}
      <button
  onClick={() => {

    if (
      opportunityTypes.length === 0
    ) {

      setError(
        "Select at least one opportunity type"
      )

      return
    }

    setError("")

    handleSaveProfile(
      "Opportunity Preferences"
    )

  }}
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >
        Save Preferences
      </button>

    </div>

  )

}