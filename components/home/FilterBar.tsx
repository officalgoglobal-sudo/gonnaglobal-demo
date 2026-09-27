import Link from "next/link"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Laptop,
  Globe,
  Trophy,
  Briefcase,
  Users,
  Sparkles,
  BadgeDollarSign,
  ChevronRight,
  Map,
  Mic,
  Rocket,
  Code2,
  PartyPopper,
  UserRound,
  Dumbbell,
} from "lucide-react"
  
const categories = [
  {
    title: "Global",
    icon: Globe,
  },
  {
    title: "Regional",
    icon: Map,
  },
  {
    title: "Internships",
    icon: Briefcase,
  },
  {
    title: "Freelancing",
    icon: BadgeDollarSign,
  },
  {
    title: "Meet Ups",
    icon: Users,
  },
  {
    title: "Conferences",
    icon: Mic,
  },
  {
    title: "Startup Programs",
    icon: Rocket,
  },
  {
    title: "Hackathons",
    icon: Code2,
  },
  {
    title: "Sports",
    icon: Dumbbell,
  },
  {
    title: "Mentorship",
    icon: UserRound,
  },
  {
    title: "Fellowships",
    icon: Trophy,
  },
  {
    title: "Scholarships",
    icon: GraduationCap,
  },
  {
    title: "Cultural Events",
    icon: PartyPopper,
  },
]
  
  export default function FilterBar() {
    const scrollRef =
  useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [search, setSearch] = useState("")
const scrollRight = () => {

  if (scrollRef.current) {

    scrollRef.current.scrollBy({
      left: 400,
      behavior: "smooth",
    })

  }

}
    return (
      <section className="border-b border-[#E7DDD1] bg-[#F8F5F0] px-4 py-4 sm:px-6 lg:px-8">
  
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
  
          {/* SEARCH */}
  
          <div className="w-full lg:w-[340px] lg:shrink-0">
  
            <div className="flex h-12 items-center rounded-2xl border border-[#E7DDD1] bg-[#EFE7DC] px-5">
  
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#8B7355]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
  
              <input
  type="text"
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  onKeyDown={(e) => {

    if (
      e.key === "Enter" &&
      search.trim()
    ) {

      router.push(
        `/explore?search=${encodeURIComponent(
          search
        )}`
      )

    }

  }}
  placeholder="Search opportunities..."
  className="ml-4 w-full bg-transparent text-[15px] text-[#2B1D16] outline-none placeholder:text-[#8B7355]"
/>
  
            </div>
  
          </div>
  
          {/* CATEGORY STRIP */}
  
          <div
  ref={scrollRef}
  className="flex w-full items-center gap-4 overflow-x-auto scroll-smooth scrollbar-hide lg:flex-1 lg:gap-5"
 >
  
            {categories.map((item) => {
              const Icon = item.icon
  
              return (
                <Link
  key={item.title}
  href={
    item.title === "Global"
      ? "/explore?feed=global"
      : item.title === "Regional"
      ? "/explore?feed=regional"
      : `/explore?type=${encodeURIComponent(item.title)}`
  }
  className="group flex min-w-[110px] sm:min-w-[130px] shrink-0 flex-col items-center gap-2"
>
  
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] transition-all duration-300 group-hover:border-[#2563EB] group-hover:bg-[#2563EB]">
  
                    <Icon className="h-5 w-5 text-[#6B5B52] transition group-hover:text-white" />
  
                  </div>
                  <div className="text-center">

<span className="block whitespace-nowrap text-[13px] font-medium text-[#6B5B52] transition group-hover:text-[#2563EB]">

  {item.title}

</span>

{(item.title === "Global" ||
  item.title === "Regional") && (

  <span className="block whitespace-nowrap text-[13px] font-medium text-[#6B5B52] transition group-hover:text-[#2563EB]">

    Opportunities

  </span>

)}

</div>
  
</Link>
              )
            })}
  
          </div>
  
          {/* ARROW */}
  
          <button
  onClick={scrollRight}
  className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EFE7DC] transition hover:bg-[#2563EB] hover:text-white lg:flex"
  >
  
            <ChevronRight className="h-5 w-5" />
  
          </button>
  
        </div>
  
      </section>
    )
  }