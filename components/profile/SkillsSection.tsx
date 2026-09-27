"use client"

import { useState } from "react"

interface SkillsSectionProps {
  skills: string[]
  setSkills: (value: string[]) => void
  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function SkillsSection({
  skills,
  setSkills,
  handleSaveProfile,
}: SkillsSectionProps) {

  const [skillInput, setSkillInput] =
    useState("")

  const addSkill = () => {

    if (!skillInput.trim()) return

    setSkills([
      ...skills,
      skillInput.trim(),
    ])

    setSkillInput("")
  }

  const removeSkill = (
    skillToRemove: string
  ) => {

    setSkills(
      skills.filter(
        (skill) =>
          skill !== skillToRemove
      )
    )
  }

  return (

    <div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">

        Skills

      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">

        Showcase your strengths.

      </h2>

      <div className="mt-10 flex gap-4">

        <input
          value={skillInput}
          onChange={(e) =>
            setSkillInput(
              e.target.value
            )
          }
          placeholder="React, UI Design, Marketing..."
          className="h-14 flex-1 rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5"
        />

        <button
          onClick={addSkill}
          className="rounded-2xl bg-[#2563EB] px-6 text-white transition hover:bg-[#1D4ED8]"
        >

          Add

        </button>

      </div>

      <div className="mt-8 flex flex-wrap gap-3">

        {skills.map((skill) => (

          <div
            key={skill}
            className="flex items-center gap-3 rounded-full bg-[#F8F5F0] px-4 py-2"
          >

            <span>
              {skill}
            </span>

            <button
              onClick={() =>
                removeSkill(skill)
              }
              className="text-red-500"
            >

              ×

            </button>

          </div>

        ))}

      </div>

      <button
        onClick={() =>
          handleSaveProfile(
            "Skills"
          )
        }
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >

        Save Skills

      </button>

    </div>

  )
}