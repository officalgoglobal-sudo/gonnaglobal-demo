"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Footer from "@/components/home/Footer"
import { BookOpen, Search, ArrowRight, GraduationCap } from "lucide-react"

export default function CoursesPage() {
  const [search, setSearch] = useState("")

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 text-black">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[80px]">
        <Topbar />

        <section className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="rounded-[20px] border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
                Learn & Grow
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Courses
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                Discover learning opportunities, build new skills, and take the next step towards your goals.
              </p>

              <div className="mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10">
                <Search className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

          </div>
          <div className="mx-auto mt-6 max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="rounded-[18px] border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                No Courses Added Yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                New courses will be added soon. Stay tuned!
              </p>
            </div>
          </div>
        </section>

        <div className="mt-auto -mx-5 sm:-mx-8 lg:-mx-10">
          <Footer />
        </div>
      </div>
    </main>
  )
}
