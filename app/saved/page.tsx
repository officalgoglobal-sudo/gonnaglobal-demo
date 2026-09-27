"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  onAuthStateChanged,
} from "firebase/auth"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"

import {
  auth,
  db,
} from "@/lib/firebase"

import Sidebar from "@/components/home/Sidebar"

import OpportunityCard from "@/components/opportunity/OpportunityCard"

export default function SavedPage() {

  const router = useRouter()

  const [savedOpportunities, setSavedOpportunities] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {

            router.push("/login")

            return

          }

          const savedQuery = query(
            collection(db, "savedOpportunities"),
            where("userId", "==", user.uid)
          )

          const savedSnapshot =
            await getDocs(savedQuery)

          const savedItems =
            await Promise.all(

              savedSnapshot.docs.map(
                async (savedDoc) => {

                  const savedData =
                    savedDoc.data()

                  const opportunityRef =
                    doc(
                      db,
                      "opportunities",
                      savedData.opportunityId
                    )

                  const opportunitySnapshot =
                    await getDoc(opportunityRef)

                  if (
                    opportunitySnapshot.exists()
                  ) {

                    return {
                      id: opportunitySnapshot.id,
                      ...opportunitySnapshot.data(),
                    }

                  }

                  return null

                }
              )

            )

          setSavedOpportunities(
            savedItems.filter(Boolean)
          )

          setLoading(false)

        }
      )

    return () => unsubscribe()

  }, [router])

  if (loading) {

    return (
  
      <main className="min-h-screen bg-[#F8F5F0] pb-24 lg:ml-24 lg:pb-0">
  
        <Sidebar />
  
        <section className="border-b border-[#E7DDD1] bg-[#FFFDF9] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
  
          <div className="animate-pulse">
  
            <div className="h-4 w-40 rounded bg-[#E7DDD1]" />
  
            <div className="mt-4 h-12 w-80 rounded bg-[#E7DDD1]" />
  
            <div className="mt-5 h-5 w-[420px] max-w-full rounded bg-[#E7DDD1]" />
  
          </div>
  
        </section>
  
        <section className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
  
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
  
            {Array.from({ length: 4 }).map((_, index) => (
  
              <div
                key={index}
                className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40"
              >
  
                <div className="animate-pulse">
  
                  <div className="flex items-start justify-between">
  
                    <div>
  
                      <div className="h-4 w-24 rounded bg-[#E7DDD1]" />
  
                      <div className="mt-4 h-8 w-64 rounded bg-[#E7DDD1]" />
  
                    </div>
  
                    <div className="h-10 w-20 rounded-full bg-[#E7DDD1]" />
  
                  </div>
  
                  <div className="mt-6 h-4 w-full rounded bg-[#E7DDD1]" />
  
                  <div className="mt-3 h-4 w-4/5 rounded bg-[#E7DDD1]" />
  
                  <div className="mt-8 flex gap-3">
  
                    <div className="h-9 w-24 rounded-full bg-[#E7DDD1]" />
  
                    <div className="h-9 w-20 rounded-full bg-[#E7DDD1]" />
  
                  </div>
  
                  <div className="mt-8 flex justify-between border-t border-[#E7DDD1] pt-6">
  
                    <div className="h-4 w-24 rounded bg-[#E7DDD1]" />
  
                    <div className="h-4 w-20 rounded bg-[#E7DDD1]" />
  
                  </div>
  
                  <div className="mt-8 h-12 rounded-2xl bg-[#E7DDD1]" />
  
                </div>
  
              </div>
  
            ))}
  
          </div>
  
        </section>
  
      </main>
  
    )
  
  }

  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-[#F8F5F0] pb-24 text-[#2B1D16] lg:ml-24 lg:pb-0">

      <section className="border-b border-[#E7DDD1] bg-[#FFFDF9] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

          <p className="text-sm text-[#8B7355]">
            Saved Opportunities
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">

            Your saved opportunities.

          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#6B5B52] sm:text-lg sm:leading-8">

            Track opportunities you want to revisit later.

          </p>

        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          {savedOpportunities.length === 0 ? (

            <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 sm:p-8 lg:rounded-[32px] lg:p-10">

              <h2 className="text-2xl font-bold text-[#2B1D16] sm:text-3xl">

                Nothing saved yet.

              </h2>

              <p className="mt-4 max-w-xl leading-8 text-[#6B5B52]">

                Opportunities you bookmark will appear here.

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 lg:gap-6 xl:grid-cols-2">

              {savedOpportunities.map(
                (opportunity) => (

                  <OpportunityCard
                  key={opportunity.id}
                  id={opportunity.id}
                  organization={opportunity.organization}
                  title={opportunity.title}
                  description={opportunity.description}
                  type={opportunity.type}
                  location={opportunity.location}
                  mode={opportunity.mode}
                  deadline={opportunity.deadline}
                  posterUrl={opportunity.posterUrl}
                />

                )
              )}

            </div>

          )}

        </section>

      </main>
    </>
  )

}