import Link from "next/link"
import { Globe } from "lucide-react"

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/go-global-a1553b415",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/offical.goglobal",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/offcialgoglobal",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF8] border-t border-[#EBEBEB] px-8 py-12 lg:px-12 lg:py-14">

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">

        {/* Brand column */}
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/goglobal-icon.png"
              alt="GG"
              className="h-10 w-10 object-contain"
              onError={(e) => (e.currentTarget.src = "/gonna-global-logo.png")}
            />
            <div style={{ fontFamily: "var(--font-lora), Georgia, 'Times New Roman', serif" }}>
              <span className="text-[20px] font-normal" style={{ color: "#8B6914" }}>Gonn&apos;a&nbsp;</span>
              <span className="text-[20px] font-bold text-[#1A1A2E]">Global</span>
            </div>
          </div>

          <p className="text-[13px] leading-relaxed text-[#6B6B6B] max-w-[220px]">
            Connecting students to global opportunities.<br />
            Explore. Apply. Learn. Grow.
          </p>

          {/* Social icons */}
          <div className="mt-5 flex items-center gap-2.5">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#6B6B6B] transition hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EEF3FF]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-[#8A8A8A]">Explore</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "Scholarships", href: "/explore?type=Scholarship" },
              { label: "Internships", href: "/explore?type=Internship" },
              { label: "Events", href: "/events" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-[13.5px] text-[#5A5A6A] transition hover:text-[#2563EB]">{label}</Link>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-[#8A8A8A]">Resources</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "Guides", href: "/about" },
              { label: "Student Stories", href: "/about" },
              { label: "Help Center", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-[13.5px] text-[#5A5A6A] transition hover:text-[#2563EB]">{label}</Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-[#8A8A8A]">Company</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy-policy" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-[13.5px] text-[#5A5A6A] transition hover:text-[#2563EB]">{label}</Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-10 flex flex-col gap-3 border-t border-[#EBEBEB] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[#8A8A8A]">© 2025 Gonn&apos;a Global. All rights reserved.</p>
        <div className="flex items-center gap-2 text-[13px] text-[#8A8A8A]">
          <Globe className="h-4 w-4" />
          <span>Opportunities. People. Experiences. A Global Future.</span>
        </div>
      </div>

    </footer>
  )
}
