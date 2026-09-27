type InterestCardProps = {
    title: string
    tags: string[]
    selected: boolean
    onClick: () => void
  }
  
  export default function InterestCard({
    title,
    tags,
    selected,
    onClick,
  }: InterestCardProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          rounded-[32px]
          border
          p-5
          text-left
          transition-all
          duration-300
          hover:-translate-y-1
  
          ${
            selected
              ? "border-[#2563EB] bg-[#2563EB] text-white"
              : "border-[#E7DDD1] bg-[#FFFDF9] text-[#2B1D16] hover:border-[#2563EB]"
          }
        `}
      >
        <h3 className="text-lg font-semibold tracking-tight">
          {title}
        </h3>
  
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
  
                ${
                  selected
                    ? "bg-white/15 text-white"
                    : "bg-[#F8F5F0] text-[#6B5B52]"
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </button>
    )
  }