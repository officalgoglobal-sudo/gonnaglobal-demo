"use client"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface HeroProps {
  fullName: string
  isLoggedIn: boolean
  userType?: string
}

const QUICK_TAGS = ["Scholarships", "Internships", "Conferences", "Exchange Programs", "Research", "Volunteering"]

const STATS = [
  { number: "10K+", label: "Opportunities" },
  { number: "195+", label: "Countries" },
  { number: "500+", label: "Partner Organizations" },
  { number: "1M+", label: "Students Exploring" },
]

export default function Hero({ fullName, isLoggedIn, userType }: HeroProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const handleSearch = () => {
    if (search.trim()) router.push(`/explore?search=${encodeURIComponent(search)}`)
  }

  return (
    <section
      style={{
        position: "relative",
        background: "#F5F4F0",
        overflow: "hidden",
        minHeight: "530px",
      }}
    >
      {/* Subtle globe watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "42%",
          transform: "translate(-50%, -50%)",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          border: "1.5px solid rgba(37,99,235,0.09)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "42%",
          transform: "translate(-50%, -50%)",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          border: "1px solid rgba(37,99,235,0.06)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "530px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── LEFT CONTENT ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "44px 40px 44px 44px",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "13px",
              color: "#6B6B6B",
              fontWeight: 400,
              letterSpacing: "0.01em",
              marginBottom: "10px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Your global journey starts here
          </p>

          {/* Main heading — matching reference exactly */}
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#111111",
              margin: 0,
              padding: 0,
            }}
          >
            {isLoggedIn ? (
              <>
                Welcome back,
                <span style={{ display: "block", color: "#6B5B52", marginTop: "4px" }}>
                  {fullName || "Explorer"}.
                </span>
              </>
            ) : (
              <>
                Same Dreams.
                <span style={{ display: "block", color: "#2563EB" }}>A Bigger World.</span>
              </>
            )}
          </h1>

          {/* Description — PLAIN text, no highlights */}
          <p
            style={{
              marginTop: "20px",
              fontSize: "15.5px",
              lineHeight: 1.65,
              color: "#555555",
              maxWidth: "430px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {userType === "recruiter"
              ? "Explore and recruit students, freshers, and professionals across different nationalities, universities, and domains."
              : "Discover global opportunities, build your skills,\nconnect with people, and grow without borders."}
          </p>

          {/* Search bar */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              maxWidth: "490px",
              background: "white",
              borderRadius: "50px",
              border: "1.5px solid #DEDED8",
              padding: "9px 9px 9px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Search style={{ height: "15px", width: "15px", color: "#AAAAAA", marginRight: "10px", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search scholarships, internships, conferences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                background: "transparent",
                fontSize: "13px",
                color: "#2B2B2B",
                outline: "none",
                border: "none",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "34px",
                width: "34px",
                flexShrink: 0,
                borderRadius: "50%",
                background: "#2563EB",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ArrowRight style={{ height: "16px", width: "16px" }} />
            </button>
          </div>

          {/* Quick filter tags — single row, no wrapping */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "8px",
              flexWrap: "nowrap",
              overflowX: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none" as const,
            }}
          >
            {QUICK_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/explore?type=${encodeURIComponent(tag)}`}
                style={{
                  flexShrink: 0,
                  borderRadius: "50px",
                  border: "1px solid #D8D8D5",
                  background: "transparent",
                  padding: "5px 14px",
                  fontSize: "12.5px",
                  color: "#555555",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              gap: 0,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  borderLeft: i > 0 ? "1.5px solid #DEDED8" : "none",
                  paddingLeft: i > 0 ? "26px" : "0",
                  paddingRight: "26px",
                }}
              >
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#111111",
                    lineHeight: 1,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    margin: 0,
                  }}
                >
                  {s.number}
                </p>
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "#888888",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    margin: "4px 0 0 0",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — large organic blob shape matching reference ── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Blob shape exactly matching reference — large left curve, right fills to edge */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "0px",
              right: "0px",
              bottom: "8px",
              borderRadius: "50% 20px 20px 50% / 50% 20px 20px 50%",
              overflow: "hidden",
            }}
          >
            <img
              src="/hero-hiker.jpg"
              alt="Hiker with backpack standing before snowy mountain panorama"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 25%",
              }}
            />
            {/* Quote text overlay — italic, white, matching reference */}
            <div
              style={{
                position: "absolute",
                bottom: "64px",
                left: "60px",
                maxWidth: "250px",
              }}
            >
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 500,
                  fontStyle: "italic",
                  lineHeight: 1.3,
                  color: "white",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  textShadow: "0 2px 20px rgba(0,0,0,0.65)",
                  margin: 0,
                  transform: "rotate(-3deg)",
                  transformOrigin: "left center",
                }}
              >
                A more<br />connected world<br />creates a more<br />equal world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}