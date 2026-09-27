import {
    Brain,
    GraduationCap,
    Globe,
    Briefcase,
    Trophy,
    Laptop,
    Users,
    Sparkles,
  } from "lucide-react"
  
  const categories = [
    {
      title: "Artificial Intelligence",
      icon: Brain,
      desc: "Research labs, AI internships and global ML programs.",
    },
    {
      title: "Scholarships",
      icon: GraduationCap,
      desc: "Fully funded opportunities from top universities.",
    },
    {
      title: "Remote Roles",
      icon: Laptop,
      desc: "Global remote internships and freelance projects.",
    },
    {
      title: "Conferences",
      icon: Globe,
      desc: "International summits, forums and networking events.",
    },
    {
      title: "Fellowships",
      icon: Trophy,
      desc: "Leadership and impact-driven fellowship programs.",
    },
    {
      title: "Apprenticeships",
      icon: Briefcase,
      desc: "Hands-on industry learning with real organizations.",
    },
    {
      title: "Mentorships",
      icon: Users,
      desc: "Connect with experts and experienced professionals.",
    },
    {
      title: "Startup Programs",
      icon: Sparkles,
      desc: "Accelerators, incubators and founder opportunities.",
    },
  ]
  
  export default function TrendingCategories() {
    return (
      <section className="border-t border-[#E7DDD1] bg-[#F8F5F0] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
  
        {/* HEADER */}
  
        <div className="max-w-4xl">
  
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8B7355]">
            Trending Categories
          </p>
  
          <h2 className="mt-5 text-4xl font-bold leading-[1.03] tracking-tight xl:text-5xl">
  
          Where Ambition Find

  
            <span className="mt-2 block text-[#3B82F6]">
            It's Opportunity
            </span>
  
          </h2>
  
        </div>
  
        {/* GRID */}
  
        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-4">
  
          {categories.map((item) => {
            const Icon = item.icon
  
            return (
              <div
                key={item.title}
                className="group min-w-[320px] shrink-0 snap-center rounded-[30px] border border-[#E7DDD1] bg-[#FFFDF9] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:bg-[#F8F5F0] hover:shadow-[#D6B08C]/20 hover:scale-[1.01] hover:shadow-2xl lg:min-w-0"
              >
  
                {/* ICON */}
  
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] transition-all duration-300 group-hover:bg-[#2563EB]">
  
                  <Icon className="h-6 w-6 text-[#6B5B52] transition group-hover:text-white" />
  
                </div>
  
                {/* CONTENT */}
  
                <h3 className="mt-8 text-[30px] font-semibold leading-tight text-[#2B1D16]">
  
                  {item.title}
  
                </h3>
  
                <p className="mt-5 text-[15px] leading-8 text-[#6B5B52]">
  
                  {item.desc}
  
                </p>
  
                {/* LINK */}
  
                <button className="mt-8 text-sm font-medium text-[#6B5B52] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#2563EB]">
  
                  Explore Category →
  
                </button>
  
              </div>
            )
          })}
  
        </div>
  
      </section>
    )
  }
  