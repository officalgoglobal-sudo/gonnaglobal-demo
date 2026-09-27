type ButtonProps = {
    children: React.ReactNode
    variant?: "primary" | "secondary"
    type?: "button" | "submit"
  }
  
  export default function Button({
    children,
    variant = "primary",
    type = "button",
  }: ButtonProps) {
  
    const baseStyles =
      "rounded-2xl px-8 py-4 transition"
  
    const variants = {
      primary:
        "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
  
      secondary:
        "border border-[#E7DDD1] bg-[#FFFDF9] text-[#2B1D16] hover:bg-[#F8F5F0]",
    }
  
    return (
      <button
        type={type}
        className={`${baseStyles} ${variants[variant]}`}
      >
        {children}
      </button>
    )
  }