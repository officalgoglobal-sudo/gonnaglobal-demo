"use client"

import Input from "@/components/ui/Input"
import { useState } from "react"
interface CompanyDetailsProps {
  companyName: string
  setCompanyName: (value: string) => void

  companyWebsite: string
  setCompanyWebsite: (value: string) => void

  industry: string
  setIndustry: (value: string) => void

  organizationType: string
  setOrganizationType: (value: string) => void

  companySize: string
  setCompanySize: (value: string) => void

  foundedYear: string
  setFoundedYear: (value: string) => void

  headquartersCountry: string
  setHeadquartersCountry: (
    value: string
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function CompanyDetails({
  companyName,
  setCompanyName,
  companyWebsite,
  setCompanyWebsite,
  industry,
  setIndustry,
  organizationType,
  setOrganizationType,
  companySize,
  setCompanySize,
  foundedYear,
  setFoundedYear,
  headquartersCountry,
  setHeadquartersCountry,
  handleSaveProfile,
}: CompanyDetailsProps) {
  const [error, setError] = useState("")
  return (
    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
        Company Details
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">
        Tell students about your organization.
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Company Name
          </label>

          <Input
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Company Website
          </label>

          <Input
            value={companyWebsite}
            onChange={(e) =>
              setCompanyWebsite(e.target.value)
            }
          />
        </div>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Industry
          </label>

          <Input
            value={industry}
            onChange={(e) =>
              setIndustry(e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Organization Type
          </label>

          <select
            value={organizationType}
            onChange={(e) =>
              setOrganizationType(
                e.target.value
              )
            }
            className="h-14 w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 outline-none"
          >
            <option value="">
              Select Type
            </option>

            <option>
              Startup
            </option>

            <option>
              Company
            </option>

            <option>
              NGO
            </option>

            <option>
              University
            </option>

            <option>
              Government
            </option>

            <option>
              Research Lab
            </option>
          </select>
        </div>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Company Size
          </label>

          <select
            value={companySize}
            onChange={(e) =>
              setCompanySize(
                e.target.value
              )
            }
            className="h-14 w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 outline-none"
          >
            <option value="">
              Select Size
            </option>

            <option>
              1-10
            </option>

            <option>
              11-50
            </option>

            <option>
              51-200
            </option>

            <option>
              201-1000
            </option>

            <option>
              1000+
            </option>

          </select>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
            Founded Year
          </label>

          <Input
            value={foundedYear}
            onChange={(e) =>
              setFoundedYear(
                e.target.value
              )
            }
          />
        </div>

      </div>

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium text-[#2B1D16]">
          Headquarters Country
        </label>

        <Input
          value={headquartersCountry}
          onChange={(e) =>
            setHeadquartersCountry(
              e.target.value
            )
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
            !companyName.trim() ||
            !companyWebsite.trim() ||
            !industry.trim() ||
            !organizationType.trim() ||
            !foundedYear.trim() ||
            !headquartersCountry.trim()
          ) {
        
            setError(
              "Please complete all required company fields"
            )
        
            return
          }
        
          setError("")
        
          handleSaveProfile(
            "Company Details"
          )
        
        }}
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >
        Save Company Details
      </button>

    </div>
  )
}