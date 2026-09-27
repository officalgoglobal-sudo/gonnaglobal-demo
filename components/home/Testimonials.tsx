const testimonials = [
    {
      name: "Aarav Mehta",
      role: "Computer Science Student",
      quote:
        "GoGlobal helped me discover research programs and internships I would have never found on my own.",
    },
    {
      name: "Sophia Chen",
      role: "AI Research Enthusiast",
      quote:
        "The platform feels clean, curated and actually useful compared to endlessly scrolling random websites.",
    },
    {
      name: "Daniel Kim",
      role: "Undergraduate Researcher",
      quote:
        "I found an international fellowship through GoGlobal within my first week of using it.",
    },
  ]
  
  export default function Testimonials() {
    return (
      <section className="border-t border-[#E7DDD1] bg-[#F8F5F0] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
  
        {/* HEADER */}
  
        <div className="max-w-3xl">
  
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8B7355]">
            Testimonials
          </p>
  
          <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl xl:text-5xl">
  
          From Local Talent to

            <span className="mt-1 block text-[#3B82F6]">
            Global Impact
            </span>
  
          </h2>
  
        </div>
  
        {/* GRID */}
  
        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-3">
  
          {testimonials.map((item, index) => (
            <div
              key={item.name}
              className={`group rounded-[28px] border border-[#E7DDD1] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-[#E7DDD1]/60 hover:shadow-2xl sm:p-7 ${
                index === 1
                  ? "bg-[#EFE7DC] text-[#2B1D16]"
                  : "bg-white text-[#2B1D16]"
              }`} 
            >
  
              {/* QUOTE */}
  
              <p
  className="text-[15px] leading-7 text-[#6B5B52] sm:text-[17px] sm:leading-8"
>

  “{item.quote}”

</p>
  
              {/* USER */}
  
              <div className="mt-8 flex items-center gap-4 sm:mt-10">
  
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE7DC] text-base font-semibold text-[#2563EB] sm:h-12 sm:w-12 sm:text-lg">
  
                  {item.name.charAt(0)}
  
                </div>
  
                <div>
  
                <h3
  className="font-semibold text-[#2B1D16]"
 > 
  
                    {item.name}
  
                  </h3>
  
                  <p className="text-sm text-[#8B7355]">
  
                    {item.role}
  
                  </p>
  
                </div>
  
              </div>
  
            </div>
          ))}
  
        </div>
  
      </section>
    )
  }