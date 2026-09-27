"use client"

import Link from "next/link"
import {
  Bookmark,
  Share2,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  auth,
  db,
} from "@/lib/firebase"

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore"

type OpportunityCardProps = {
  id: string
  organization: string
  title: string
  description: string
  type: string
  location: string
  mode: string
  deadline: string
  posterUrl?: string
}

export default function OpportunityCard({
  id,
  organization,
  title,
  description,
  type,
  location,
  mode,
  deadline,
  posterUrl,
}: OpportunityCardProps) {

  const router = useRouter()

  const [saved, setSaved] = useState(false)

  useEffect(() => {

    const checkSaved = async () => {

      if (!auth.currentUser) return

      const savedRef = doc(
        db,
        "savedOpportunities",
        `${auth.currentUser.uid}_${id}`
      )

      const savedSnapshot = await getDoc(savedRef)

      setSaved(savedSnapshot.exists())

    }

    checkSaved()

  }, [id])

  const handleSave = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {

    // Prevent the card from opening
    event.stopPropagation()

    // If user is not logged in,
    // send them to login and remember this opportunity.
    if (!auth.currentUser) {

      router.push(
        `/login?redirect=/opportunity/${id}`
      )

      return
    }

    try {

      const saveRef = doc(
        db,
        "savedOpportunities",
        `${auth.currentUser.uid}_${id}`
      )

      if (saved) {

        await deleteDoc(saveRef)

        setSaved(false)

      } else {

        await setDoc(saveRef, {

          userId:
            auth.currentUser.uid,

          opportunityId:
            id,

          savedAt:
            new Date(),

        })

        setSaved(true)

      }

    } catch (error) {

      console.error(
        "Error saving opportunity:",
        error
      )

    }

  }

  const handleShare = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {

    // Prevent the card from opening
    event.stopPropagation()

    const url =
      `${window.location.origin}/opportunity/${id}`

    try {

      if (navigator.share) {

        await navigator.share({
          url,
        })

      } else {

        await navigator.clipboard.writeText(url)

        alert("Opportunity link copied!")

      }

    } catch (error: any) {

      if (
        error?.name === "AbortError"
      ) {

        return

      }

      console.error(
        "Error sharing opportunity:",
        error
      )

    }

  }

  const handleCardClick = () => {

    router.push(
      `/opportunity/${id}`
    )

  }

  return (

    <div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault()

          handleCardClick()

        }

      }}
      className="group flex h-full cursor-pointer flex-col rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl sm:p-7"
    >

      {/* POSTER */}

      {posterUrl && (

        <div className="-mx-5 -mt-5 mb-6 overflow-hidden rounded-t-[32px] sm:-mx-7 sm:-mt-7">

          <img
            src={posterUrl}
            alt={title}
            className="h-52 w-full object-cover"
          />

        </div>

      )}

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0 flex-1">

          <p className="text-sm text-[#8B7355]">
            {organization}
          </p>

          <h2 className="mt-3 line-clamp-3 text-2xl font-bold leading-tight tracking-tight text-[#2B1D16] sm:text-[30px]">
            {title}
          </h2>

        </div>

        {/* ACTIONS */}

        <div
          className="flex items-center gap-3"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            aria-label={
              saved
                ? "Unsave opportunity"
                : "Save opportunity"
            }
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
              saved
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-[#E7DDD1] bg-[#FFFDF9] hover:bg-[#2563EB] hover:text-white"
            }`}
          >

            <Bookmark className="h-5 w-5" />

          </button>

          {/* SHARE */}

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share opportunity"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] transition hover:bg-[#2563EB] hover:text-white"
          >

            <Share2 className="h-5 w-5" />

          </button>

          {/* MODE */}

          <span className="rounded-full border border-[#E7DDD1] bg-[#F8F5F0] px-4 py-2 text-sm font-medium">
            {mode}
          </span>

        </div>

      </div>

      {/* DESCRIPTION */}

      <p className="mt-5 line-clamp-4 text-[15px] leading-7 text-[#6B5B52]">
        {description}
      </p>

      {/* TAGS */}

      <div className="mt-6 flex flex-wrap gap-2">

        <span className="rounded-full border border-[#E7DDD1] bg-[#F8F5F0] px-4 py-2 text-sm font-medium">
          {type}
        </span>

        <span className="rounded-full border border-[#E7DDD1] bg-[#F8F5F0] px-4 py-2 text-sm font-medium">
          {location}
        </span>

      </div>

      {/* FOOTER */}

      <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-[#8B7355]">
          Deadline: {deadline}
        </p>

        {/* VIEW DETAILS */}

        <Link
          href={`/opportunity/${id}`}
          onClick={(event) =>
            event.stopPropagation()
          }
          className="flex items-center justify-center rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-[#1D4ED8]"
        >
          View Details
        </Link>

      </div>

    </div>

  )
}