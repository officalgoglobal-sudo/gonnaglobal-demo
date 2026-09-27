"use client"

import Input from "@/components/ui/Input"
import { useState } from "react"
interface Education {
  id: string
  institution: string
  degree: string
  stream: string
  startYear: string
  endYear: string
  collegeEmail: string
}

interface EducationSectionProps {
  education: Education[]

  setEducation: (
    value: Education[]
  ) => void

  isDropper: boolean

  setIsDropper: (
    value: boolean
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function EducationSection({
  education,
  setEducation,
  isDropper,
  setIsDropper,
  handleSaveProfile,
}: EducationSectionProps) {
  const [error, setError] = useState("")

  const addEducation = () => {

    setEducation([
      ...education,
      {
        id: crypto.randomUUID(),

        institution: "",

        degree: "",

        stream: "",

        startYear: "",

        endYear: "",

        collegeEmail: "",
      },
    ])

  }

  const removeEducation = (
    id: string
  ) => {

    setEducation(
      education.filter(
        (item) => item.id !== id
      )
    )

  }

  const updateEducation = (
    id: string,
    field: string,
    value: string
  ) => {

    setEducation(

      education.map((item) =>

        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item

      )

    )

  }

  return (

    <div>

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">

            Education

          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">

            Your educational journey.

          </h2>

        </div>

        <button
          onClick={addEducation}
          className="rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
        >

          + Add Education

        </button>

      </div>

      {/* DROPPER */}

      <div className="mt-10 flex items-center justify-between rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] px-6 py-5">

        <div>

          <h3 className="font-semibold text-[#2B1D16]">

            Are you a dropper?

          </h3>

          <p className="mt-1 text-sm text-[#8B7355]">

            This helps personalize opportunities.

          </p>

        </div>

        <button
          onClick={() =>
            setIsDropper(!isDropper)
          }
          className={`h-8 w-16 rounded-full transition-all duration-300 ${
            isDropper
              ? "bg-[#2563EB]"
              : "bg-[#D6B08C]"
          }`}
        >

          <div
            className={`h-8 w-8 rounded-full bg-white transition-all duration-300 ${
              isDropper
                ? "translate-x-8"
                : "translate-x-0"
            }`}
          />

        </button>

      </div>

      {/* EMPTY */}

      {education.length === 0 && (

        <div className="mt-10 rounded-3xl border border-dashed border-[#E7DDD1] p-10 text-center">

          <p className="text-[#8B7355]">

            No education added yet.

          </p>

        </div>

      )}

      {/* EDUCATION CARDS */}

      <div className="mt-10 flex flex-col gap-8">

        {education.map((item) => (

          <div
            key={item.id}
            className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6"
          >

            {/* TOP */}

            <div className="flex items-center justify-between">

              <h3 className="text-xl font-semibold text-[#2B1D16]">

                Education Entry

              </h3>

              <button
                onClick={() =>
                  removeEducation(item.id)
                }
                className="text-sm font-medium text-red-500"
              >

                Remove

              </button>

            </div>

            {/* GRID */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  School / College

                </label>

                <Input
                  value={item.institution}
                  onChange={(e) =>
                    updateEducation(
                      item.id,
                      "institution",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  Degree

                </label>

                <Input
                  value={item.degree}
                  onChange={(e) =>
                    updateEducation(
                      item.id,
                      "degree",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* SECOND GRID */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  Stream

                </label>

                <Input
                  value={item.stream}
                  onChange={(e) =>
                    updateEducation(
                      item.id,
                      "stream",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  College Email

                </label>

                <Input
                  value={item.collegeEmail}
                  onChange={(e) =>
                    updateEducation(
                      item.id,
                      "collegeEmail",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* YEARS */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  Start Year

                </label>

                <Input
                  value={item.startYear}
                  onChange={(e) =>
                    updateEducation(
                      item.id,
                      "startYear",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  End Year

                </label>

                <Input
                  value={item.endYear}
                  onChange={(e) =>
                    updateEducation(
                      item.id,
                      "endYear",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* SAVE */}
      {error && (
  <p className="mt-8 text-sm text-red-500">
    {error}
  </p>
)}
      <button
  onClick={() => {

    if (education.length === 0) {

      setError(
        "At least one education entry is required"
      )

      return
    }

    const hasInvalidEducation =
      education.some(
        (item) =>
          !item.institution.trim() ||
          !item.degree.trim() ||
          !item.stream.trim() ||
          !item.startYear.trim()
      )

    if (hasInvalidEducation) {

      setError(
        "School/College, Degree, Stream and Start Year are required"
      )

      return
    }

    setError("")

    handleSaveProfile(
      "Education"
    )

  }}
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >

        Save Education

      </button>

    </div>

  )

}