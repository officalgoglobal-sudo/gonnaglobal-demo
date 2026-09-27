import type { Metadata } from "next"
import PrivacyPolicyPageContent from "./PrivacyPolicyPageContent"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the GoGlobal Privacy Policy to learn how we collect, use, protect and manage information when you use our global opportunities platform.",

  alternates: {
    canonical: "/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageContent />
}