interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({
  className = "",
  ...props
}: TextareaProps) {

  return (

    <textarea
      {...props}
      className={`w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-4 text-base text-[#2B1D16] outline-none transition focus:border-[#2563EB] ${className}`}
    />

  )

}