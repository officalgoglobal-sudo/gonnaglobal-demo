
import Link from "next/link"

export default function RecruitPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#2B1D16]">


      {/* HEADER */}

      <section className="mx-auto max-w-7xl px-6 py-14">

        <p className="text-sm text-[#8B7355]">
          Recruit Dashboard
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[#2B1D16]">
          Manage global opportunities.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-[#6B5B52]">
          Add, manage, and publish curated opportunities for students worldwide.
        </p>

      </section>

      {/* DASHBOARD GRID */}

      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="grid gap-6 md:grid-cols-3">

          {/* CARD 1 */}

          <div className="mt-10 rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm shadow-[#E7DDD1]/40">

            <p className="text-sm text-[#8B7355]">
              Total Opportunities
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              124
            </h2>

          </div>

          {/* CARD 2 */}

          <div className="mt-10 rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm shadow-[#E7DDD1]/40">

            <p className="text-sm text-[#8B7355]">
              Active Listings
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              87
            </h2>

          </div>

          {/* CARD 3 */}

          <div className="mt-10 rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm shadow-[#E7DDD1]/40">

            <p className="text-sm text-[#8B7355]">
              Applications
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              3.2K
            </h2>

          </div>

        </div>

        {/* ACTION SECTION */}

        <div className="mt-10 rounded-3xl border border-[#E7DDD1] bg-[#FFFDF9] p-8 shadow-sm shadow-[#E7DDD1]/40">

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div>

              <h2 className="text-2xl font-semibold">
                Add new opportunity
              </h2>

              <p className="mt-2 text-[#6B5B52]">
                Publish internships, fellowships, and global programs.
              </p>

            </div>

            <Link
  href="/recruit/create"
  className="rounded-2xl bg-[#2563EB] px-8 py-4 text-white transition hover:bg-[#1D4ED8]"
>
  Create Opportunity
</Link>

          </div>

        </div>

      </section>

    </main>
  )
}