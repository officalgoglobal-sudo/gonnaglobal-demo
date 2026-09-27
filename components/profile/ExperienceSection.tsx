"use client"

import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"

interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

interface ExperienceSectionProps {
  experiences: Experience[]

  setExperiences: (
    value: Experience[]
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function ExperienceSection({
  experiences,
  setExperiences,
  handleSaveProfile,
}: ExperienceSectionProps) {

  const addExperience = () => {

    setExperiences([
      ...experiences,
      {
        id: crypto.randomUUID(),

        company: "",

        role: "",

        startDate: "",

        endDate: "",

        currentlyWorking: false,

        description: "",
      },
    ])

  }

  const removeExperience = (
    id: string
  ) => {

    setExperiences(
      experiences.filter(
        (item) => item.id !== id
      )
    )

  }

  const updateExperience = (
    id: string,
    field: string,
    value: any
  ) => {

    setExperiences(

      experiences.map((item) =>

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

            Experience

          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">

            Your work and leadership experience.

          </h2>

        </div>

        <button
          onClick={addExperience}
          className="rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
        >

          + Add Experience

        </button>

      </div>

      {/* EMPTY */}

      {experiences.length === 0 && (

        <div className="mt-10 rounded-3xl border border-dashed border-[#E7DDD1] p-10 text-center">

          <p className="text-[#8B7355]">

            No experiences added yet.

          </p>

        </div>

      )}

      {/* EXPERIENCE CARDS */}

      <div className="mt-10 flex flex-col gap-8">

        {experiences.map((item) => (

          <div
            key={item.id}
            className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6"
          >

            {/* TOP */}

            <div className="flex items-center justify-between">

              <h3 className="text-xl font-semibold text-[#2B1D16]">

                Experience Entry

              </h3>

              <button
                onClick={() =>
                  removeExperience(item.id)
                }
                className="text-sm font-medium text-red-500"
              >

                Remove

              </button>

            </div>

            {/* COMPANY + ROLE */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  Company / Organization

                </label>

                <Input
                  value={item.company}
                  onChange={(e) =>
                    updateExperience(
                      item.id,
                      "company",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  Your Role

                </label>

                <Input
                  value={item.role}
                  onChange={(e) =>
                    updateExperience(
                      item.id,
                      "role",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* DATES */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  Start Date

                </label>

                <Input
                  type="date"
                  value={item.startDate}
                  onChange={(e) =>
                    updateExperience(
                      item.id,
                      "startDate",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                  End Date

                </label>

                <Input
                  type="date"
                  value={item.endDate}
                  disabled={item.currentlyWorking}
                  onChange={(e) =>
                    updateExperience(
                      item.id,
                      "endDate",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* CURRENTLY WORKING */}

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h4 className="font-medium text-[#2B1D16]">

                  Currently Working Here

                </h4>

                <p className="mt-1 text-sm text-[#8B7355]">

                  Enable if this is your current role.

                </p>

              </div>

              <button
                onClick={() =>
                  updateExperience(
                    item.id,
                    "currentlyWorking",
                    !item.currentlyWorking
                  )
                }
                className={`h-8 w-16 rounded-full transition-all duration-300 ${
                  item.currentlyWorking
                    ? "bg-[#2563EB]"
                    : "bg-[#D6B08C]"
                }`}
              >

                <div
                  className={`h-8 w-8 rounded-full bg-white transition-all duration-300 ${
                    item.currentlyWorking
                      ? "translate-x-8"
                      : "translate-x-0"
                  }`}
                />

              </button>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">

            <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                Description

              </label>

              <Textarea
                rows={5}
                value={item.description}
                onChange={(e) =>
                  updateExperience(
                    item.id,
                    "description",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        ))}

      </div>

      {/* SAVE */}

      <button
        onClick={() =>
          handleSaveProfile(
            "Experience"
          )
        }
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >

        Save Experiences

      </button>

    </div>

  )

}