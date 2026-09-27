import type { Metadata } from "next"
import TermsPageContent from "./TermsPageContent"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the GoGlobal Terms & Conditions covering use of the platform, accounts, opportunities, content and services.",

  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return <TermsPageContent />
}