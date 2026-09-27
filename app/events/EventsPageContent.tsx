"use client"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-[#F8F5F0] text-black">
      
          <Sidebar />
      
          <div className="lg:ml-24">
      
            <Topbar />
      
            <section className="px-5 py-10 sm:px-8 lg:px-12">

  <div className="mx-auto max-w-5xl">

    {/* HERO */}

    <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 text-center shadow-sm sm:p-12">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB]">

        <CalendarDays className="h-9 w-9 text-white" />

      </div>

      <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
        Events
      </p>

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#2B1D16] sm:text-6xl">

        Global Events

        <span className="text-[#2563EB]">
          {" "}coming soon.
        </span>

      </h1>

      <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#6B5B52]">

        Discover conferences, webinars, workshops, networking sessions,
        competitions and community events from around the world.

      </p>

    </div>

    {/* WHAT'S COMING */}

    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6">

        <h3 className="font-semibold text-[#2B1D16]">
          Conferences
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
          Global academic and professional conferences.
        </p>

      </div>

      <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6">

        <h3 className="font-semibold text-[#2B1D16]">
          Webinars
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
          Learn from experts across industries and domains.
        </p>

      </div>

      <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6">

        <h3 className="font-semibold text-[#2B1D16]">
          Workshops
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
          Hands-on sessions to build practical skills.
        </p>

      </div>

      <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6">

        <h3 className="font-semibold text-[#2B1D16]">
          Networking
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
          Meet students, recruiters and global communities.
        </p>

      </div>

    </div>

    {/* NO EVENTS */}

    <div className="mt-8 rounded-[32px] border border-dashed border-[#D6B08C] bg-[#FFFDF9] p-12 text-center">

      <h2 className="text-2xl font-bold text-[#2B1D16]">
        No Events Available Yet
      </h2>

      <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6B5B52]">

        We're currently preparing the events platform.
        Once launched, you'll be able to discover and register
        for global events directly through GoGlobal.

      </p>

    </div>

    {/* CTA */}

    <div className="mt-8 text-center">

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-2xl bg-[#2563EB] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
      >
        Back to Home
      </Link>

    </div>

  </div>

</section>
      
          </div>
      
        </main>
      )
}