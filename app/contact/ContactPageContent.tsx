"use client"

import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-black">
      <Sidebar />

      <div className="lg:ml-24">
        <Topbar />

        <section className="px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm sm:p-12">
            
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
              GoGlobal
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#2B1D16] sm:text-5xl">
              Contact Us
            </h1>

            <p className="mt-4 max-w-3xl leading-8 text-[#6B5B52]">
              Have questions, feedback, partnership opportunities, or need support?
              Reach out to the GoGlobal team through any of the channels below.
              We're here to help students discover opportunities beyond their
              campus, beyond their country, and beyond their borders.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">

              {/* EMAIL 1 */}

              <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] p-6 transition-all hover:shadow-md">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
                  Primary Email
                </p>

                <a
                  href="mailto:offical.goglobal@gmail.com"
                  className="mt-3 block text-lg font-semibold text-[#2563EB] hover:underline"
                >
                  offical.goglobal@gmail.com
                </a>
              </div>

              {/* EMAIL 2 */}

              <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] p-6 transition-all hover:shadow-md">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
                  Business Email
                </p>

                <a
                  href="mailto:offical.goglobal@zohomail.in"
                  className="mt-3 block text-lg font-semibold text-[#2563EB] hover:underline"
                >
                  offical.goglobal@zohomail.in
                </a>
              </div>

              {/* INSTAGRAM */}

              <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] p-6 transition-all hover:shadow-md">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
                  Instagram
                </p>

                <a
                  href="https://www.instagram.com/offical.goglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-lg font-semibold text-[#2563EB] hover:underline"
                >
                  @offical.goglobal
                </a>
              </div>

              {/* LINKEDIN */}

              <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] p-6 transition-all hover:shadow-md">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
                  LinkedIn
                </p>

                <a
                  href="https://www.linkedin.com/in/offical-goglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-lg font-semibold text-[#2563EB] hover:underline"
                >
                  GoGlobal LinkedIn
                </a>
              </div>

              {/* WHATSAPP CHANNEL */}

              <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] p-6 transition-all hover:shadow-md md:col-span-2">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">
                  WhatsApp Channel
                </p>

                <a
                  href="https://whatsapp.com/channel/0029VbDDrzU0G0XYWuLgei1g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-lg font-semibold text-[#2563EB] hover:underline"
                >
                  Join Our Official WhatsApp Channel
                </a>
              </div>

            </div>

            <div className="mt-12 rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] p-8 text-center">
              <h2 className="text-2xl font-semibold text-[#2B1D16]">
                Go Beyond Borders
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#6B5B52]">
                GoGlobal helps students discover scholarships, internships,
                competitions, conferences, research programs, fellowships,
                and international opportunities from around the world.
                Dream locally. Compete globally. Build a future without limits.
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}