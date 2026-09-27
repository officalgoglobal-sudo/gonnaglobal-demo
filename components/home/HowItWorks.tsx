const steps = [
    {
      number: "01",
      title: "Discover",
      desc: "Explore internships, fellowships, scholarships, conferences and more from around the world.",
    },
    {
      number: "02",
      title: "Save",
      desc: "Bookmark opportunities, build your personalized space and track what matters most.",
    },
    {
      number: "03",
      title: "Apply",
      desc: "Apply directly through official sources and continue discovering new opportunities daily.",
    },
  ]
  
  export default function HowItWorks() {
    return (
      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
  
        {/* HEADER */}
  
        <div className="max-w-3xl">
  
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8B7355]">
            How It Works
          </p>
  
          <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl xl:text-5xl">
  
            A simpler way
            <span className="mt-1 block text-[#2563EB]">
              to discover global opportunities.
            </span>
  
          </h2>
  
        </div>
  
        {/* STEPS */}
  
        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-3">
  
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-[28px] border border-[#E7DDD1] bg-[#F8F5F0] p-6 shadow-[0_4px_20px_rgba(43,29,22,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B08C] hover:shadow-[#E7DDD1]/60 hover:shadow-2xl sm:p-7"
            >
  
              {/* NUMBER */}
  
              <div className="text-4xl font-bold tracking-tight text-[#D6B08C]/40 transition-all duration-300 group-hover:text-[#C4A484] sm:text-5xl">
  
                {step.number}
  
              </div>
  
              {/* CONTENT */}
  
              <h3 className="mt-6 text-xl font-semibold text-[#2B1D16] sm:mt-8 sm:text-2xl">
  
                {step.title}
  
              </h3>
  
              <p className="mt-4 text-[15px] leading-7 text-[#6B5B52] sm:mt-5 sm:text-[16px]">
  
                {step.desc}
  
              </p>
  
            </div>
          ))}
  
        </div>
  
      </section>
    )
  }