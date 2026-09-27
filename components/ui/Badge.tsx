type BadgeProps = {
    children: React.ReactNode
  }
  
  export default function Badge({
    children,
  }: BadgeProps) {
    return (
      <div className="rounded-full bg-[#F8F5F0] px-4 py-2 text-sm text-[#6B5B52] border border-[#E7DDD1]">
        {children}
      </div>
    )
  }