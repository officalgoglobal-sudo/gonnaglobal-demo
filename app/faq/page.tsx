import Link from "next/link"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"

const faqs = [
  { q: "What is Gonn’a Global?", a: "Gonn’a Global helps students discover opportunities to learn, grow, and connect globally." },
  { q: "How can I find opportunities?", a: "Explore the opportunities section and review the eligibility criteria and application details for each listing." },
  { q: "How do I apply?", a: "Open an opportunity and follow its application instructions. Keep your profile information up to date." },
  { q: "How can I connect with a mentor?", a: "Visit the mentorship section to explore available mentors and their profiles." },
  { q: "Who can I contact for help?", a: "Use the Contact page to send a message to the Gonn’a Global team." },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-[#1A1A2E]">
      <Sidebar />
      <div className="lg:ml-24">
        <Topbar />
        <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/contact" className="text-sm font-semibold text-blue-600 hover:underline">← Back to Contact</Link>
        <h1 className="mt-5 text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="mt-2 text-sm text-gray-500">Quick answers about Gonn’a Global, opportunities, applications, and mentorship.</p>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <section key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{faq.q}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{faq.a}</p>
            </section>
          ))}
        </div>
        </div>
        </section>
      </div>
    </main>
  )
}
