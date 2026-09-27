"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { onAuthStateChanged } from "firebase/auth"

import {
  doc,
  updateDoc,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"

import { interests } from "@/lib/interests"

import InterestCard from "@/components/onboarding/InterestCard"

export default function InterestsPage() {
  const router = useRouter()

  const [selectedInterests, setSelectedInterests] =
    useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const [userId, setUserId] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          router.push("/login")
          return
        }

        setUserId(user.uid)
      }
    )

    return () => unsubscribe()
  }, [router])

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }

      return [...prev, id]
    })
  }

  const handleContinue = async () => {
    if (!userId) return

    try {
      setLoading(true)

      await updateDoc(doc(db, "users", userId), {
        preferences: {
          ecosystems: selectedInterests,
        },

        onboardingCompleted: true,
      })

      router.push("/")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-10 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-6xl">

        <div className="max-w-2xl">

        <div className="inline-flex rounded-full border border-[#E7DDD1] bg-[#FFFDF9] px-4 py-2 text-sm font-medium text-[#6B5B52]">

            Personalization

          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#2B1D16] sm:text-5xl">

            Let’s personalize your journey.

          </h1>

          <p className="mt-5 text-lg leading-8 text-[#6B5B52]">

            Choose areas that excite you the most.

          </p>

        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {interests.map((interest) => (
            <InterestCard
              key={interest.id}
              title={interest.title}
              tags={interest.tags}
              selected={selectedInterests.includes(
                interest.id
              )}
              onClick={() =>
                toggleInterest(interest.id)
              }
            />
          ))}

        </div>

        <div className="sticky bottom-0 mt-10 border-t border-[#E7DDD1] bg-[#F8F5F0] py-5">

          <button
            onClick={handleContinue}
            disabled={
              selectedInterests.length === 0 ||
              loading
            }
           className="w-full rounded-2xl bg-[#2563EB] py-4 text-lg font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving preferences..."
              : "Start Exploring"}
          </button>

        </div>

      </div>

    </main>
  )
}