const stats = [
    {
      number: "12K+",
      label: "Students Exploring",
    },
    {
      number: "4K+",
      label: "Global Opportunities",
    },
    {
      number: "80+",
      label: "Countries Reached",
    },
    {
      number: "300+",
      label: "Partner Organizations",
    },
  ]
  
  export default function GlobalStats() {
    return (
      <section className="bg-[#2B1D16] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
  
        {/* HEADER */}
  
        <div className="max-w-3xl">
  
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#C4A484]">
            Global Impact
          </p>
  
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl">
  
          Empowering Students

            <span className="block text-[#D6B08C]">
            Beyond Borders
            </span>
  
          </h2>
  
        </div>
  
        {/* STATS */}
  
        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
  
          {stats.map((item) => (
            <div
              key={item.label}
              className="group rounded-[28px] border border-[#4A382E] bg-[#3A2A21] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#4A382E] hover:border-[#D6B08C]/30 hover:shadow-[#2B1D16]/40 hover:shadow-2xl sm:p-7"
            >
  
              <h3 className="text-4xl font-bold tracking-tight text-white transition-all duration-300 group-hover:scale-[1.02] sm:text-5xl">
  
                {item.number}
  
              </h3>
  
              <p className="mt-3 text-sm text-[#D8C3B3] sm:mt-4 sm:text-base">
  
                {item.label}
  
              </p>
  
            </div>
          ))}
  
        </div>
  
      </section>
    )
  }