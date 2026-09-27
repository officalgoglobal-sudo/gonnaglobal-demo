"use client"

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import Link from "next/link"
import { useEffect, useState } from "react"

import OpportunityCard from "@/components/opportunity/OpportunityCard"

export default function FeaturedOpportunities() {

  const [loading, setLoading] =
    useState(true)

  const [opportunities, setOpportunities] =
    useState<any[]>([])

  useEffect(() => {

    const fetchOpportunities =
      async () => {

        try {

          const q = query(
            collection(
              db,
              "opportunities"
            ),
            orderBy(
              "createdAt",
              "desc"
            ),
            limit(5)
          )

          const snapshot =
            await getDocs(q)

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            )

          setOpportunities(data)

        } catch (error) {

          console.error(error)

        }

        setLoading(false)

      }

    fetchOpportunities()

  }, [])

  return (

    <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

      <div className="mb-10 flex items-end justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#6B5B52]">

            Featured Opportunities

          </p>

          <h2 className="mt-4 text-4xl xl:text-5xl font-bold leading-[1.08] tracking-tight text-[#2B1D16]">

            Connecting Students to

            <span className="mt-1 block text-[#2563EB]">

              World of Opportunities

            </span>

          </h2>

        </div>

        <Link
          href="/explore"
          className="hidden rounded-2xl border border-[#E7DDD1] px-6 py-3 text-sm font-medium transition hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#DBEAFE] md:flex"
        >

          View All

        </Link>

      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
  <div className="flex w-max gap-6 pb-2">

        {loading ? (

          Array.from({ length: 5 }).map((_, index) => (

            <div
              key={index}
              className="min-w-[320px] shrink-0 overflow-hidden rounded-3xl bg-[#F8F5F0] p-6 shadow-sm lg:min-w-0"
            >

              <div className="animate-pulse">

                <div className="h-52 rounded-2xl bg-[#E7DDD1]" />

                <div className="mt-6 h-4 w-24 rounded bg-[#E7DDD1]" />

                <div className="mt-4 h-8 w-full rounded bg-[#E7DDD1]" />

                <div className="mt-3 h-8 w-2/3 rounded bg-[#E7DDD1]" />

                <div className="mt-6 h-12 rounded-2xl bg-[#E7DDD1]" />

              </div>

            </div>

          ))

        ) : (

          opportunities.map((item) => (

            <div
              key={item.id}
              className="w-[380px] shrink-0"
            >
            
              <OpportunityCard
                id={item.id}
                organization={item.organization}
                title={item.title}
                description={item.description}
                type={item.type}
                location={item.location}
                mode={item.mode}
                deadline={item.deadline}
                posterUrl={item.posterUrl}
              />
            
            </div>
            
            ))

        )}
</div>
      </div>

    </section>

  )

}