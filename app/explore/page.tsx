import type { Metadata } from "next"
import ExplorePageContent from "./ExplorePageContent"

export const metadata: Metadata = {
  title: "Explore Global Opportunities",
  description:
    "Explore internships, fellowships, scholarships, hackathons, conferences and other global opportunities from around the world with Gonn'a Global.",

  alternates: {
    canonical: "/explore",
  },
}

export default function ExplorePage() {
  return <ExplorePageContent />
}