"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

export default function CategoriesPage() {
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

        <Sparkles className="h-9 w-9 text-white" />

      </div>

      <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
        Categories
      </p>

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#2B1D16] sm:text-6xl">

      Discover Opportunities

<span className="text-[#2563EB]">
  {" "}by category.
</span>

      </h1>

      <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#6B5B52]">

        Discover opportunities organized by category so you can
        quickly find programs that match your goals and interests.

      </p>

    </div>

    {/* CATEGORIES */}

<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Artificial Intelligence
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Research labs, AI internships and global machine learning programs.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Scholarships
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Fully funded opportunities from universities and organizations.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Remote Roles
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Global remote internships, jobs and freelance opportunities.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Conferences
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    International summits, forums and networking events.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Fellowships
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Leadership and impact-driven fellowship programs.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Apprenticeships
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Hands-on industry learning with real organizations.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Mentorships
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Connect with experts and experienced professionals.
  </p>
</div>

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-md">
  <h3 className="font-semibold text-[#2B1D16]">
    Startup Programs
  </h3>
  <p className="mt-3 text-sm leading-7 text-[#6B5B52]">
    Accelerators, incubators and founder opportunities.
  </p>
</div>

</div>

    {/* COMING SOON */}

    <div className="mt-8 rounded-[32px] border border-dashed border-[#D6B08C] bg-[#FFFDF9] p-12 text-center">

    <h2 className="text-2xl font-bold text-[#2B1D16]">
  More Categories Coming Soon
</h2>

<p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6B5B52]">

  We're continuously expanding GoGlobal to include more
  industries, career paths and opportunity types so every
  student can discover opportunities tailored to their ambitions.

</p>

    </div>

    {/* CTA */}

    <div className="mt-8 text-center">

      <Link
        href="/explore"
        className="inline-flex items-center justify-center rounded-2xl bg-[#2563EB] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
      >
        Explore Opportunities
      </Link>

    </div>

  </div>

</section>
      
          </div>
      
        </main>
      )
}