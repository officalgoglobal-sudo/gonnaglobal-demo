import type { Metadata } from "next"
import HomePageContent from "./HomePageContent"

export const metadata: Metadata = {
  title: "Discover Global Opportunities",
  description:
    "Discover internships, fellowships, scholarships, hackathons, conferences and other global opportunities from around the world with GoGlobal.",

  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return <HomePageContent />
}