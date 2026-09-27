"use client"

import Input from "@/components/ui/Input"

interface VerificationProps {
  verificationStatus: string

  businessRegistration: string
  setBusinessRegistration: (
    value: string
  ) => void

  organizationCertificate: string
  setOrganizationCertificate: (
    value: string
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function Verification({
  verificationStatus,
  businessRegistration,
  setBusinessRegistration,
  organizationCertificate,
  setOrganizationCertificate,
  handleSaveProfile,
}: VerificationProps) {

  return (

    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
        Verification
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">
        Build trust with students.
      </h2>

      <div className="mt-8 rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] p-5">

        <p className="text-sm text-[#8B7355]">
          Verification Status
        </p>

        <p className="mt-2 text-lg font-semibold text-[#2563EB]">

          {verificationStatus || "Not Verified"}

        </p>

      </div>

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
          Business Registration Link
        </label>

        <Input
          value={businessRegistration}
          onChange={(e) =>
            setBusinessRegistration(
              e.target.value
            )
          }
        />

      </div>

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
          Organization Certificate Link
        </label>

        <Input
          value={organizationCertificate}
          onChange={(e) =>
            setOrganizationCertificate(
              e.target.value
            )
          }
        />

      </div>

      <button
        onClick={() =>
          handleSaveProfile(
            "Verification"
          )
        }
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >
        Save Verification Details
      </button>

    </div>

  )

}
