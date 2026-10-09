
import Image from "next/image"
import Link from "next/link"
import {
  Linkedin,
  Instagram,
  MessageCircle,
  Globe,
} from "lucide-react"

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/go-global-a1553b415",
    Icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/offical.goglobal",
    Icon: Instagram,
  },
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029VbDDrzU0G0XYWuLgei1g",
    Icon: MessageCircle,
  },
  {
    label: "X",
    href: "https://x.com/offcialgoglobal",
    Icon: null,
  },
]

const linkClass =
  "w-fit rounded-sm text-[15px] leading-6 text-[#687995] transition-colors duration-200 hover:text-[#1769E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#E9E4DF] bg-[#FCFAF7]">
      {/* Decorative globe background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-36 -z-10 h-[420px] w-[520px] opacity-70 sm:-right-32 sm:-top-48 sm:h-[550px] sm:w-[680px] lg:-right-20 lg:-top-64 lg:h-[700px] lg:w-[850px]"
      >
        <svg
          viewBox="0 0 900 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            <radialGradient
              id="footerGlobeFill"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(490 390) rotate(90) scale(310)"
            >
              <stop stopColor="#DCE8F3" stopOpacity="0.8" />
              <stop offset="0.75" stopColor="#E9F0F7" stopOpacity="0.6" />
              <stop offset="1" stopColor="#F7F8FA" stopOpacity="0.1" />
            </radialGradient>
            <clipPath id="footerGlobeClip">
              <circle cx="490" cy="390" r="310" />
            </clipPath>
          </defs>

          <circle
            cx="490"
            cy="390"
            r="310"
            fill="url(#footerGlobeFill)"
            stroke="#D8E4EF"
            strokeWidth="2"
          />

          <g
            clipPath="url(#footerGlobeClip)"
            stroke="#C8D9E9"
            strokeWidth="1.4"
            opacity="0.85"
          >
            <ellipse cx="490" cy="390" rx="230" ry="310" />
            <ellipse cx="490" cy="390" rx="140" ry="310" />
            <ellipse cx="490" cy="390" rx="55" ry="310" />
            <ellipse cx="490" cy="390" rx="310" ry="220" />
            <ellipse cx="490" cy="390" rx="310" ry="125" />
            <ellipse cx="490" cy="390" rx="310" ry="55" />
            <path d="M180 390H800" />
          </g>

          <g fill="#D4E2EF" opacity="0.65">
            <path d="M350 150L390 128L424 145L440 174L423 198L434 223L402 246L383 277L358 263L344 226L321 211L329 179Z" />
            <path d="M455 260L485 242L514 257L531 291L513 321L522 347L500 378L482 421L457 404L447 365L426 338L435 305L417 284Z" />
            <path d="M550 146L582 130L613 145L644 140L675 169L705 183L694 213L660 223L641 248L610 237L588 213L558 203Z" />
            <path d="M622 302L652 287L685 302L707 326L692 351L663 356L643 341Z" />
            <path d="M300 340L322 322L348 331L358 354L342 375L317 367Z" />
          </g>

          <g
            stroke="#BFD3E7"
            strokeWidth="1.5"
            opacity="0.75"
          >
            <ellipse
              cx="490"
              cy="390"
              rx="365"
              ry="230"
              transform="rotate(-25 490 390)"
            />
            <ellipse
              cx="490"
              cy="390"
              rx="390"
              ry="185"
              transform="rotate(-48 490 390)"
            />
            <path d="M155 365C270 40 625 10 825 285" />
          </g>

          <g fill="#BFD5E9">
            <circle cx="255" cy="200" r="5" />
            <circle cx="350" cy="100" r="4" />
            <circle cx="670" cy="170" r="5" />
            <circle cx="780" cy="280" r="4" />
            <circle cx="730" cy="470" r="5" />
            <circle cx="405" cy="570" r="4" />
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 pb-8 pt-12 sm:px-10 sm:pt-14 lg:px-16 lg:pb-9 lg:pt-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.8fr_1fr_1fr_0.75fr_1.05fr] lg:gap-x-10">

          {/* BRAND */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:pr-8">
            <Link
              href="/"
              aria-label="Gonn'a Global home"
              className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            >
              <Image
                src="/gonna-global-logo.png"
                alt="Gonn'a Global"
                width={360}
                height={110}
                sizes="(max-width: 640px) 260px, 330px"
                className="h-auto w-[260px] max-w-full object-contain object-left sm:w-[300px] lg:w-[330px]"
              />
            </Link>

            <p className="mt-4 max-w-[390px] text-[15px] leading-[1.9] text-[#687995]">
              Connecting students to global opportunities.
              <br />
              Explore. Apply. Learn. Grow.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Gonn'a Global on ${label} (opens in a new tab)`}
                  className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F0ECE6] text-[#171717] transition-all duration-200 hover:-translate-y-1 hover:bg-[#E3EAF4] hover:text-[#1769E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] focus-visible:ring-offset-2"
                >
                  {Icon ? (
                    <Icon
                      size={22}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="text-[25px] font-medium leading-none"
                    >
                      𝕏
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* EXPLORE */}
          <div className="lg:border-l lg:border-[#E8E2DC] lg:pl-8">
            <h3 className="font-serif text-[18px] font-bold tracking-tight text-[#171717]">
              Explore
            </h3>

            <nav
              aria-label="Explore"
              className="mt-4 flex flex-col items-start gap-2.5"
            >
              <Link href="/explore" className={linkClass}>
                Scholarships
              </Link>
              <Link href="/explore" className={linkClass}>
                Internships
              </Link>
              <Link href="/events" className={linkClass}>
                Events
              </Link>
              <Link href="/categories" className={linkClass}>
                Communities
              </Link>
            </nav>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="font-serif text-[18px] font-bold tracking-tight text-[#171717]">
              Resources
            </h3>

            <nav
              aria-label="Resources"
              className="mt-4 flex flex-col items-start gap-2.5"
            >
              <Link href="/about" className={linkClass}>
                Guides
              </Link>
              <Link href="/events" className={linkClass}>
                Student Stories
              </Link>
              <Link href="/contact" className={linkClass}>
                Help Center
              </Link>
            </nav>
          </div>

          {/* COMPANY */}
          <div className="lg:border-r lg:border-[#E8E2DC] lg:pr-8">
            <h3 className="font-serif text-[18px] font-bold tracking-tight text-[#171717]">
              Company
            </h3>

            <nav
              aria-label="Company"
              className="mt-4 flex flex-col items-start gap-2.5"
            >
              <Link href="/about" className={linkClass}>
                About Us
              </Link>
              <Link href="/contact" className={linkClass}>
                Contact
              </Link>
            </nav>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-serif text-[18px] font-bold tracking-tight text-[#171717]">
              Legal
            </h3>

            <nav
              aria-label="Legal"
              className="mt-4 flex flex-col items-start gap-2.5"
            >
              <Link href="/terms" className={linkClass}>
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className={linkClass}>
                Privacy Policy
              </Link>
              <Link href="/privacy-policy" className={linkClass}>
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-[#E8E2DC] pt-6 sm:mt-12 sm:pt-7 md:flex-row md:items-center md:justify-between">
          <p className="text-[14px] leading-6 text-[#687995]">
            © {new Date().getFullYear()} Gonn'a Global. All rights reserved.
          </p>

          <p className="flex items-center gap-3 text-[14px] leading-6 text-[#687995]">
            <Globe
              aria-hidden="true"
              size={25}
              strokeWidth={2.2}
              className="shrink-0"
            />
            <span>
              Opportunities. People. Experiences. A Global Future.
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
