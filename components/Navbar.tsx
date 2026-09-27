import Link from "next/link"
import {
  Search,
  Bell,
} from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#E7DDD1] bg-[#F8F5F0]/90 backdrop-blur-xl">

      <div className="flex h-20 items-center justify-between px-10">

       {/* LEFT */}

<div className="flex items-center gap-10">

{/* LOGO SPACE */}

<Link
  href="/"
  className="flex h-12 w-[140px] items-center"
>

  {/* ADD YOUR LOGO IMAGE HERE LATER */}

  {/* 
  <Image
    src="/logo.png"
    alt="GoGlobal"
    width={140}
    height={40}
  />
  */}

</Link>

   {/* NAV LINKS */}

<div className="hidden items-center gap-10 md:flex">

<Link
  href="/explore"
  className="text-[15px] font-medium text-[#6B5B52] transition hover:text-[#2563EB]"
>
  Explore
</Link>

<Link
  href="/categories"
  className="text-[15px] font-medium text-[#6B5B52] transition hover:text-[#2563EB]"
>
  Categories
</Link>

<Link
  href="/events"
  className="text-[15px] font-medium text-[#6B5B52] transition hover:text-[#2563EB]"
>
  Events
</Link>

<Link
  href="/about"
  className="text-[15px] font-medium text-[#6B5B52] transition hover:text-[#2563EB]"
>
  About
</Link>

</div>
         

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* SEARCH */}

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] transition hover:border-[#2563EB] hover:bg-[#F8F5F0]">

            <Search className="h-5 w-5 text-[#6B5B52]" />

          </button>

          {/* NOTIFICATIONS */}

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] transition hover:border-[#2563EB] hover:bg-[#F8F5F0]">

            <Bell className="h-5 w-5 text-[#6B5B52]" />

          </button>

          {/* LOGIN */}

          <Link
            href="/login"
            className="text-[15px] font-medium text-[#6B5B52] transition hover:text-[#2563EB]"
          >
            Login
          </Link>

          {/* CTA */}

          <Link
            href="/signup"
            className="rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
          >
            Sign up
          </Link>

        </div>

      </div>

    </nav>
  )
}