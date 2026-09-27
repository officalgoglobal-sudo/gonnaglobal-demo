"use client"

import Input from "@/components/ui/Input"
import { useState } from "react"
interface RecruiterDetailsProps {
  recruiterName: string
  setRecruiterName: (
    value: string
  ) => void

  designation: string
  setDesignation: (
    value: string
  ) => void

  workEmail: string
  setWorkEmail: (
    value: string
  ) => void

  recruiterPhone: string
  setRecruiterPhone: (
    value: string
  ) => void

  recruiterLinkedin: string
  setRecruiterLinkedin: (
    value: string
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function RecruiterDetails({
  recruiterName,
  setRecruiterName,
  designation,
  setDesignation,
  workEmail,
  setWorkEmail,
  recruiterPhone,
  setRecruiterPhone,
  recruiterLinkedin,
  setRecruiterLinkedin,
  handleSaveProfile,
}: RecruiterDetailsProps) {
  const [error, setError] = useState("")
  return (

    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
        Recruiter Details
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">
        Tell students who they are speaking with.
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <div>

          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Recruiter Name
          </label>

          <Input
            value={recruiterName}
            onChange={(e) =>
              setRecruiterName(e.target.value)
            }
          />

        </div>

        <div>

          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Designation
          </label>

          <Input
            value={designation}
            onChange={(e) =>
              setDesignation(e.target.value)
            }
          />

        </div>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <div>

          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Work Email
          </label>

          <Input
            value={workEmail}
            onChange={(e) =>
              setWorkEmail(e.target.value)
            }
          />

        </div>

        <div>

          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Phone Number
          </label>

          <Input
            value={recruiterPhone}
            onChange={(e) =>
              setRecruiterPhone(e.target.value)
            }
          />

        </div>

      </div>

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
          LinkedIn Profile
        </label>

        <Input
          value={recruiterLinkedin}
          onChange={(e) =>
            setRecruiterLinkedin(e.target.value)
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
      !recruiterName.trim() ||
      !designation.trim() ||
      !workEmail.trim() ||
      !recruiterPhone.trim() ||
      !recruiterLinkedin.trim()
    ) {

      setError(
        "Please complete all recruiter details"
      )

      return
    }

    setError("")

    handleSaveProfile(
      "Recruiter Details"
    )

  }}
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >

        Save Recruiter Details

      </button>

    </div>

  )

}