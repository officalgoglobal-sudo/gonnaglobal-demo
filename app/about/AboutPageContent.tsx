"use client"

import Image from "next/image"
import Link from "next/link"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Target, Eye, Heart, Globe, ArrowRight, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Sidebar />
      <div className="lg:ml-24">
        <Topbar />
        <section className="px-5 py-8 sm:px-8 lg:px-10">

          {/* ── HERO ── */}
          <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1fr_420px]">
              {/* Left content */}
              <div className="p-8 xl:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-gray-500">About Us</p>
                <h1 className="mt-3 text-[36px] font-black leading-[1.1] tracking-tight text-gray-900 xl:text-[42px]">
                  A More Connected<br />World, <span className="text-[#0066FF]">A Brighter You.</span>
                </h1>
                <p className="mt-4 max-w-md text-[14px] leading-relaxed text-gray-600">
                  Gonn&apos;a Global is a platform built by students, for students — to make global opportunities more inclusive, and more impactful.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link href="/explore" className="flex items-center gap-2 rounded-[10px] bg-[#0066FF] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0055e6]">
                    Our Mission <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className="rounded-[10px] border border-gray-200 px-5 py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                    Join the Movement
                  </Link>
                </div>
              </div>
              {/* Right — hero image */}
              <div className="relative h-[260px] overflow-hidden lg:h-auto">
                <Image src="/about-hero.jpg" alt="Students exploring the world" fill className="object-cover object-center" />
                {/* Overlay handwritten notes */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
                <div
                  className="absolute left-6 top-6 -rotate-[4deg] text-[17px] leading-tight text-gray-900"
                  style={{ fontFamily: "'Caveat','Comic Sans MS',cursive" }}
                >
                  Dif ferent<br />paths.<br />A brighter<br />tomorrow.
                </div>
                <div
                  className="absolute bottom-6 right-6 text-right text-[14px] leading-tight text-white"
                  style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                >
                  More opportunities.<br />More perspectives.<br />A more equal world.
                </div>
              </div>
            </div>
          </div>

          {/* ── MISSION / VISION / VALUES / IMPACT + QUOTE ── */}
          <div className="mt-5 grid grid-cols-5 gap-4">
            {[
              { icon: <Target className="h-6 w-6 text-[#0066FF]" />, bg: "bg-blue-50", title: "Our Mission", body: "To empower students worldwide by connecting them with global opportunities and resources." },
              { icon: <Eye className="h-6 w-6 text-purple-600" />, bg: "bg-purple-50", title: "Our Vision", body: "A world where every student, regardless of background, has access to global exposure." },
              { icon: <Users className="h-6 w-6 text-green-600" />, bg: "bg-green-50", title: "Our Values", body: "Inclusivity, curiosity, collaboration and impact drive everything we do." },
              { icon: <Globe className="h-6 w-6 text-orange-500" />, bg: "bg-orange-50", title: "Our Impact", body: "Building a global community of learners, dreamers and changemakers." },
            ].map(({ icon, bg, title, body }) => (
              <div key={title} className="col-span-1 rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm">
                <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${bg}`}>{icon}</div>
                <h2 className="mt-3 text-[15px] font-bold text-gray-900">{title}</h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
            {/* Quote */}
            <div className="col-span-1 rounded-[16px] border border-blue-100 bg-blue-50 p-5 shadow-sm">
              <div className="text-[28px] font-black leading-none text-[#0066FF]">&ldquo;</div>
              <p className="mt-2 text-[12px] italic leading-relaxed text-gray-700">
                &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
              </p>
              <p className="mt-3 text-[11px] font-semibold text-gray-500">— Nelson Mandela</p>
            </div>
          </div>

          {/* ── OUR STORY ── */}
          <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr_200px]">
            {/* Story image */}
            <div className="relative overflow-hidden rounded-[16px] shadow-sm" style={{ minHeight: "260px" }}>
              <Image src="/about-story.jpg" alt="Students together" fill className="object-cover object-center" />
              <div
                className="absolute bottom-6 left-4 -rotate-[5deg] text-[16px] leading-tight text-white"
                style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
              >
                Students today.<br />A brighter tomorrow.
              </div>
            </div>

            {/* Story text */}
            <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">Our Story</p>
              <h2 className="mt-2 text-[22px] font-black leading-tight tracking-tight text-gray-900">
                From an Idea to a Global Community
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                Gonn&apos;a Global started with a simple idea — to make global opportunities easy to find and accessible for every student. What began as a small initiative among a group of students has now grown into a vibrant community connecting learners across countries, cultures and disciplines.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                We&apos;ve seen how the right opportunity can change a life. That&apos;s why we&apos;re committed to building a platform that bridges gaps, creates access and inspires students to think beyond borders.
              </p>
              <Link href="/explore" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0066FF] hover:underline">
                Our Journey <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              {[
                { icon: <Users className="h-5 w-5 text-[#0066FF]" />, bg: "bg-blue-50", num: "1M+", label: "Students Reached" },
                { icon: <Globe className="h-5 w-5 text-orange-500" />, bg: "bg-orange-50", num: "180+", label: "Countries" },
                { icon: <Heart className="h-5 w-5 text-purple-600" />, bg: "bg-purple-50", num: "10K+", label: "Opportunities Listed" },
                { icon: <Target className="h-5 w-5 text-green-600" />, bg: "bg-green-50", num: "500+", label: "Partner Organizations" },
              ].map(({ icon, bg, num, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-[12px] border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] ${bg}`}>{icon}</div>
                  <div>
                    <p className="text-[18px] font-black leading-none text-gray-900">{num}</p>
                    <p className="text-[11px] text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── OUR JOURNEY TIMELINE ── */}
          <div className="mt-5 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-[15px] font-bold text-gray-900">Our Journey</p>
            <p className="text-[12px] text-gray-500">Key milestones that shaped Gonn&apos;a Global.</p>

            {/* Timeline line */}
            <div className="relative mt-6">
              <div className="absolute left-0 right-0 top-3 h-[2px] bg-gray-200" />
              <div className="grid grid-cols-5 gap-4">
                {[
                  { year: "2023", title: "The Idea", body: "A small team with a big dream to make global opportunities accessible." },
                  { year: "2024", title: "Platform Launch", body: "Launched Gonn'a Global with scholarships, internships and events." },
                  { year: "2024", title: "Growing Community", body: "Reached 100K+ students across 50+ countries." },
                  { year: "2025", title: "Stronger Together", body: "Partnered with leading universities and organizations worldwide." },
                  { year: "2025+", title: "A Global Impact", body: "Continuing to expand, empower and create a more equal world for all students." },
                ].map(({ year, title, body }, i) => (
                  <div key={i} className="relative pt-6">
                    {/* Dot */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full border-2 border-[#0066FF] bg-white">
                      <div className="absolute inset-[4px] rounded-full bg-[#0066FF]" />
                    </div>
                    <p className="text-[12px] font-bold text-gray-900">{year}</p>
                    <p className="mt-1 text-[13px] font-semibold text-gray-800">{title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BE PART OF SOMETHING BIGGER ── */}
          <div className="mt-5 flex justify-end">
            <div className="relative w-full max-w-[340px] overflow-hidden rounded-[16px] shadow-sm" style={{ minHeight: "160px" }}>
              <Image src="/login-bg.jpg" alt="Join us" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative z-10 p-6 text-white">
                <p className="text-[18px] font-black leading-tight">Be Part of<br />Something Bigger.</p>
                <p className="mt-1 text-[11px] text-white/80">Join a global community that believes in people, possibilities and progress.</p>
                <Link href="/signup" className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] bg-white px-4 py-2 text-[12px] font-semibold text-gray-900 transition hover:bg-gray-100">
                  Get Involved <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </section>
      </div>
    </main>
  )
}

