interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className = "",
  ...props
}: InputProps) {

  return (

    <input
      {...props}
      className={`h-14 w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 text-base text-[#2B1D16] outline-none transition focus:border-[#2563EB] ${className}`}
    />

  )

}