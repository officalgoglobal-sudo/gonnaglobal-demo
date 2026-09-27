import type { Metadata } from "next"
import AboutPageContent from "./AboutPageContent"

export const metadata: Metadata = {
  title: "About GoGlobal | Global Opportunities Platform",
  description:
    "Learn about GoGlobal, a platform helping students discover global internships, fellowships, scholarships, research programs and career opportunities.",

  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  return <AboutPageContent />
}