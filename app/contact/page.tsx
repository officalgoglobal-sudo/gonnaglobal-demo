import type { Metadata } from "next"
import ContactPageContent from "./ContactPageContent"

export const metadata: Metadata = {
  title: "Contact GoGlobal",
  description:
    "Contact the GoGlobal team for support, feedback, partnerships and questions about global opportunities for students.",

  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return <ContactPageContent />
}