"use client"

import Link from "next/link"
import { Globe2 } from "lucide-react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F8F5F0] text-black">
      
          <Sidebar />
      
          <div className="lg:ml-24">
      
            <Topbar />
      
            <section className="px-5 py-10 sm:px-8 lg:px-12">

  <div className="mx-auto max-w-6xl">

    {/* HERO */}

    <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm sm:p-12">

<p className="text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
  About GoGlobal
</p>

<h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-tight text-[#2B1D16] sm:text-6xl">

  Discover opportunities.

  <span className="text-[#2563EB]">
    {" "}Build experiences. Create global impact.
  </span>

</h1>

<p className="mt-8 max-w-5xl text-lg leading-8 text-[#6B5B52]">

  Explore international and national opportunities including
  internships, fellowships, scholarships, research programs,
  conferences, global summits, competitions, hackathons,
  tournaments, leadership programs, exchange programs,
  networking events, student communities, Volunteering Opportunities
  and global career opportunities — all in one place.

  <br /><br />

  GoGlobal is building a global opportunities ecosystem that helps
students discover opportunities, gain exposure, build meaningful
connections and unlock experiences beyond geographical boundaries.

  <br /><br />

  Our mission is to help students gain exposure, build real-world
  experience, expand their network, discover new possibilities and
  unlock opportunities that shape their future on a national and
  international level.

</p>

</div>

    {/* MISSION */}

    <div className="mt-8 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 sm:p-12">

      <h2 className="text-3xl font-bold text-[#2B1D16]">
        Our Mission
      </h2>

      <p className="mt-6 leading-8 text-[#6B5B52]">

      Millions of students have the talent and ambition to succeed, but many never discover the opportunities available to them.

We exist to bridge that gap by making global opportunities accessible, discoverable and actionable for students everywhere.

Whether it's a fellowship in Europe, a research program in Asia, a conference in the United States or a virtual internship with a global organization, GoGlobal helps students find opportunities that would otherwise remain hidden.


</p>

    </div>

    {/* WHY WE BUILT */}

    <div className="mt-8 grid gap-6 lg:grid-cols-2">

      <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8">

        <h2 className="text-2xl font-bold text-[#2B1D16]">
          Why We Built GoGlobal
        </h2>

        <p className="mt-5 leading-8 text-[#6B5B52]">

        Students often spend hours searching across websites, social media pages, newsletters and communities trying to find quality opportunities.

Important opportunities are scattered across dozens of platforms and many students miss them simply because they never hear about them.

GoGlobal was built to become a single destination where students can discover verified opportunities from around the world without the frustration of searching everywhere.


</p>

      </div>

      <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8">

        <h2 className="text-2xl font-bold text-[#2B1D16]">
          Who It's For
        </h2>


        <div className="mt-5 space-y-2 text-[#6B5B52]">

<p>• Students</p>
<p>• University Students</p>
<p>• Recent Graduates</p>
<p>• Researchers</p>
<p>• Student Leaders</p>
<p>• Innovators & Creators</p>
<p>• Aspiring Professionals</p>
<p>• Anyone seeking global opportunities and experiences</p>

</div>


      </div>

    </div>

    {/* VISION */}

    <div className="mt-8 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 sm:p-12">

      <h2 className="text-3xl font-bold text-[#2B1D16]">
        Our Vision
      </h2>

      <p className="mt-6 leading-8 text-[#6B5B52]">

      We envision a future where every student, regardless of where they live, has equal access to opportunities from around the world.

Our goal is to become the most trusted destination for discovering internships, fellowships, conferences, competitions, hackathons, research programs and global experiences.

We want every ambitious student to have the opportunity to compete on a global stage.
</p>

    </div>
    <div className="mt-8 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 sm:p-12">

  <h2 className="text-3xl font-bold text-[#2B1D16]">
    What You'll Discover
  </h2>

  <div className="mt-8 grid gap-5 md:grid-cols-2">
  <div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • International Opportunities
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • National Opportunities
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Internships
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Fellowships
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Scholarships
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Research Programs
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Conferences
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Global Summits
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Competitions & Hackathons
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Tournaments
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Leadership Programs
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Exchange Programs
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Networking Events
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Student Communities
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Volunteering Opportunities
</div>
<div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-4">
  • Global Career Opportunities
</div>

</div>

</div>
<div className="mt-8 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 sm:p-12">

  <h2 className="text-3xl font-bold text-[#2B1D16]">
    The Problem We're Solving
  </h2>

  <p className="mt-6 leading-8 text-[#6B5B52]">

  Students should not have to rely on luck, social media algorithms or word of mouth to discover life-changing opportunities.

Today opportunities are fragmented across hundreds of websites, communities and platforms.

As a result, talented students miss internships, fellowships, conferences and experiences that could transform their future.

GoGlobal solves this by bringing global opportunities together into one trusted ecosystem designed specifically for students.
  </p>

</div>

    {/* VALUES */}

    <div className="mt-8 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 sm:p-12">

      <h2 className="text-3xl font-bold text-[#2B1D16]">
        Our Values
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div>

          <h3 className="font-semibold text-[#2B1D16]">
            Accessibility
          </h3>

          <p className="mt-3 text-[#6B5B52]">
          Every student deserves access to opportunities regardless of location.
          </p>

        </div>

        <div>

          <h3 className="font-semibold text-[#2B1D16]">
          Global Exposure
          </h3>

          <p className="mt-3 text-[#6B5B52]">
          We believe exposure creates confidence, growth and success.
          </p>

        </div>

        <div>

          <h3 className="font-semibold text-[#2B1D16]">
          Impact
          </h3>

          <p className="mt-3 text-[#6B5B52]">
          Every opportunity should help individuals create meaningful impact.
          </p>

        </div>
        <div>

  <h3 className="font-semibold text-[#2B1D16]">
    Excellence
  </h3>

  <p className="mt-3 text-[#6B5B52]">
    Curating high-quality opportunities from around the world.
  </p>

</div>

      </div>

    </div>

    {/* TEAM */}

    <div className="mt-8 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 sm:p-12">

      <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
        Team
      </p>

      <h2 className="mt-4 text-3xl font-bold text-[#2B1D16]">
        Meet The Team
      </h2>

      <p className="mt-5 text-[#6B5B52] leading-8">
      GoGlobal is being built by students and young builders who believe opportunity should not be limited by geography.

We're creating a platform that helps ambitious students discover opportunities, gain exposure, build confidence and connect with the world.
This is only the beginning of our mission to help students compete beyond borders and access opportunities on a global scale.
      </p>

    </div>

  </div>

</section>
      
          </div>
      
        </main>
      )
 
}