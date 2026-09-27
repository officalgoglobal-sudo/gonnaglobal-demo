import type { Metadata } from "next"
import EventsPageContent from "./EventsPageContent"

export const metadata: Metadata = {
  title: "Global Events & Opportunities",
  description:
    "Discover global conferences, webinars, workshops, networking sessions, competitions and community events with GoGlobal.",

  alternates: {
    canonical: "/events",
  },
}

export default function EventsPage() {
  return <EventsPageContent />
}