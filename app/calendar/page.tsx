"use client"

import { useEffect, useState } from "react"
import {
  collection,
  getDocs,
} from "firebase/firestore"

import {
  db,
} from "@/lib/firebase"

import Sidebar from "@/components/home/Sidebar"

import dynamic from "next/dynamic"

const Calendar = dynamic(
  () => import("react-calendar"),
  {
    ssr: false,
  }
)

import "react-calendar/dist/Calendar.css"

export default function CalendarPage() {

  const [opportunities, setOpportunities] =
    useState<any[]>([])

  const [selectedDate, setSelectedDate] =
    useState(new Date())

  useEffect(() => {

    const fetchData =
      async () => {

        const snapshot =
          await getDocs(
            collection(
              db,
              "opportunities"
            )
          )

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          )

        setOpportunities(data)

      }

    fetchData()

  }, [])

  const selectedOpportunities =
    opportunities.filter((item) => {

      if (!item.deadline)
        return false

      const deadline =
        new Date(item.deadline)

      return (
        deadline.toDateString() ===
        selectedDate.toDateString()
      )

    })
   
  return (

    <>
      <Sidebar />

      <main className="min-h-screen bg-[#F8F5F0] lg:ml-24">

        <section className="px-5 py-10 sm:px-8 lg:px-10">

          <p className="text-sm text-[#8B7355]">
            Student Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#2B1D16]">

          Deadline Tracker

          </h1>

          <p className="mt-4 text-[#6B5B52]">

          Never miss an application deadline again.

          </p>

        </section>

        <section className="px-5 pb-10 sm:px-8 lg:px-10">

        <div className="grid gap-8 xl:grid-cols-[500px_1fr]">

        <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm min-h-[520px]">

            <Calendar
  value={selectedDate}
  onChange={(value: any) =>
    setSelectedDate(value)
  }
  tileContent={({ date }) => {

    const hasDeadline =
      opportunities.some((item) => {

        if (!item.deadline)
          return false

        return (
          new Date(item.deadline)
            .toDateString() ===
          date.toDateString()
        )

      })

    return hasDeadline ? (

      <div className="absolute bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#2563EB]" />

    ) : null

  }}
/>

            </div>

            <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-[#2B1D16]">

Deadlines on

{" "}

{selectedDate.getFullYear()}-
{String(selectedDate.getMonth() + 1).padStart(2, "0")}-
{String(selectedDate.getDate()).padStart(2, "0")}

</h2>

              <div className="mt-6 space-y-4">

                {selectedOpportunities.length === 0 ? (

                  <p className="text-[#6B5B52]">

                    No deadlines on this date.

                  </p>

                ) : (

                  selectedOpportunities.map(
                    (item) => (

                        <div
  key={item.id}
  className="rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all"
>
                       <h3 className="text-2xl font-bold text-[#2B1D16]">
  {item.title}
</h3>

                        <div className="mt-4 inline-flex rounded-full bg-[#DBEAFE] px-4 py-2 text-sm font-medium text-[#2563EB]">

Deadline: {item.deadline}

</div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>

        </section>

      </main>

    </>
  )
}