import type { Metadata } from "next"
import CategoriesPageContent from "./CategoriesPageContent"

export const metadata: Metadata = {
  title: "Global Opportunity Categories",
  description:
    "Explore global opportunities by category, including AI programs, scholarships, internships, fellowships, conferences, mentorships and startup programs.",

  alternates: {
    canonical: "/categories",
  },
}

export default function CategoriesPage() {
  return <CategoriesPageContent />
}