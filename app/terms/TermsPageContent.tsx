"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { ShieldCheck, CheckCircle2, XCircle, Mail } from "lucide-react"

const TOC = [
  "1. Acceptance of Terms",
  "2. About Gonn'a Global",
  "3. User Accounts",
  "4. Use of Our Services",
  "5. Intellectual Property",
  "6. Third-Party Links",
  "7. Disclaimer",
  "8. Limitation of Liability",
  "9. Changes to These Terms",
  "10. Contact Us",
]
const TOC_IDS = TOC.map((_, i) => `section-${i + 1}`)

export default function TermsPageContent() {
  const [active, setActive] = useState(TOC_IDS[0])

  const scrollTo = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const SectionIcon = ({ n }: { n: number }) => (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-[13px] font-bold text-[#0066FF]">{n}</div>
  )

  const Check = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
      <span className="text-[13px] text-gray-700">{text}</span>
    </div>
  )

  const Deny = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2">
      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <span className="text-[13px] text-gray-700">{text}</span>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="lg:ml-24">
        <Topbar />

        {/* HERO */}
        <div className="relative overflow-hidden bg-white" style={{ minHeight: 200 }}>
          <div className="relative z-10 px-8 py-8 lg:px-10 lg:w-[55%]">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">Terms &amp; Conditions</p>
            <h1 className="mt-2 text-[36px] font-black leading-tight tracking-tight text-gray-900">
              {"Let's"} Build a<br />Global Future <span className="text-[#0066FF]">Together.</span>
            </h1>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-gray-600">
              These Terms and Conditions govern your use of Gonn&apos;a Global and our website, services, and content. By using our platform, you agree to these Terms.
            </p>
          </div>
          <div className="absolute right-0 top-0 hidden h-full w-[46%] lg:block">
            <Image src="/terms-hero.jpg" alt="Terms" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
            <div className="absolute right-8 top-6 -rotate-[6deg] text-[20px] leading-tight text-white" style={{ fontFamily: "cursive", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
              A global<br />you tomorrow.
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white px-8 py-2 text-[12px] text-gray-500 lg:px-10">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-1.5 text-gray-400">{">"}</span>
          Terms &amp; Conditions
        </div>

        {/* BODY */}
        <div className="px-5 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <div className="space-y-5">

              {/* Last updated */}
              <div className="flex gap-3 rounded-[12px] border border-blue-100 bg-blue-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0066FF]">
                  <span className="text-[12px] font-bold text-white">i</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">Last updated: 2 October 2026</p>
                  <p className="mt-0.5 text-[12px] text-gray-600">
                    Please read these Terms and Conditions carefully before using Gonn&apos;a Global. If you do not agree with these Terms, please do not use our website or services.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <div id="section-1" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={1} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Acceptance of Terms</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      By accessing or using Gonn&apos;a Global (the &quot;Platform&quot;), you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree, please do not use our services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div id="section-2" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={2} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">About Gonn&apos;a Global</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      Gonn&apos;a Global is a platform that helps students discover and access global opportunities such as internships, fellowships, scholarships, conferences, and other learning programs. We aim to provide accurate and updated information, but we do not guarantee the availability, authenticity, or outcomes of any opportunity listed on our platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="section-3" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={3} />
                  <div className="w-full">
                    <h2 className="text-[16px] font-bold text-gray-900">User Accounts</h2>
                    <div className="mt-3 space-y-2.5">
                      <Check text="You must provide accurate, complete, and up-to-date information when creating an account." />
                      <Check text="You are responsible for maintaining the confidentiality of your account credentials." />
                      <Check text="You must be at least 13 years old to use our services. If you are under 18, you must have parental consent." />
                      <Check text="You are responsible for all activities that occur under your account." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="section-4" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={4} />
                  <div className="w-full">
                    <h2 className="text-[16px] font-bold text-gray-900">Use of Our Services</h2>
                    <p className="mt-1 text-[12px] text-gray-500">You agree to use Gonn&apos;a Global only for lawful purposes and in a way that does not:</p>
                    <div className="mt-3 space-y-2.5">
                      <Deny text="Violate any applicable laws or regulations." />
                      <Deny text="Post false, misleading, or harmful information." />
                      <Deny text="Attempt to gain unauthorized access to our systems." />
                      <Deny text="Use our platform for spam, commercial solicitation, or illegal activities." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="section-5" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={5} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Intellectual Property</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      All content on Gonn&apos;a Global, including text, graphics, logos, design, and software, is the property of Gonn&apos;a Global or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, or use our content without prior written permission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div id="section-6" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={6} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Third-Party Links</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      Our platform may contain links to third-party websites (e.g., universities, organizations, program providers). We are not responsible for the content, accuracy, or policies of these external sites. You access them at your own risk.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div id="section-7" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={7} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Disclaimer</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      We strive to provide accurate and updated information, but we do not guarantee the completeness, reliability, or availability of any opportunity listed. Gonn&apos;a Global is not responsible for any outcomes, decisions, or consequences resulting from your use of the information on our platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 8 */}
              <div id="section-8" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={8} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Limitation of Liability</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      To the fullest extent permitted by law, Gonn&apos;a Global shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of data, missed opportunities, or reliance on third-party information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 9 */}
              <div id="section-9" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <SectionIcon n={9} />
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Changes to These Terms</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      We may update these Terms from time to time. Any changes will be posted on this page with an updated &quot;Last revised&quot; date. Your continued use of the platform after changes are posted constitutes your acceptance of the new Terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 10 */}
              <div id="section-10" className="rounded-[14px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0066FF]">
                    <span className="text-[12px] font-bold text-white">i</span>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Contact Us</h2>
                    <p className="mt-0.5 text-[12px] text-gray-500">If you have any questions about these Terms and Conditions, please contact us at:</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-gray-100 bg-gray-50 px-4 py-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#0066FF]" />
                  <div>
                    <p className="text-[12px] text-gray-600">
                      Email:{" "}
                      <a href="mailto:support@gonnaglobal.com" className="font-semibold text-[#0066FF] hover:underline">support@gonnaglobal.com</a>
                    </p>
                    <p className="text-[11px] text-gray-400">{"We'll"} be happy to help.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT sidebar */}
            <div className="space-y-4">
              <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[13px] font-bold text-gray-900">On this page</p>
                <div className="mt-3 space-y-1">
                  {TOC.map((item, i) => (
                    <button key={item} onClick={() => scrollTo(TOC_IDS[i])}
                      className={`block w-full rounded-[8px] px-3 py-2 text-left text-[12px] transition ${active === TOC_IDS[i] ? "border-l-2 border-[#0066FF] bg-blue-50 font-semibold text-[#0066FF]" : "text-gray-600 hover:bg-gray-50"}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[14px] border border-blue-100 bg-blue-50 p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0066FF]">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <p className="mt-3 text-[15px] font-black text-gray-900">A Safer,<br />More Global You.</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-gray-600">
                  We are committed to a safe, transparent, and trustworthy platform for students worldwide.
                </p>
                <div className="mt-4 flex justify-end opacity-25">
                  <div className="h-20 w-20 rounded-full border-4 border-[#0066FF]" />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="mt-10 rounded-[16px] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <Image src="/gonna-global-logo.png" alt="Gonna Global" width={120} height={60} className="h-auto w-[100px] object-contain" />
                <p className="mt-2 text-[12px] italic text-gray-500" style={{ fontFamily: "cursive" }}>A global you tomorrow.</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-900">Explore</p>
                <div className="mt-2 space-y-1">
                  <Link href="/explore" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">Opportunities</Link>
                  <Link href="/events" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">Events</Link>
                  <Link href="/categories" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">Categories</Link>
                  <Link href="/explore" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">Countries</Link>
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-900">Company</p>
                <div className="mt-2 space-y-1">
                  <Link href="/about" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">About Us</Link>
                  <Link href="/contact" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">Contact</Link>
                  <Link href="/privacy-policy" className="block text-[12px] text-gray-500 hover:text-[#0066FF]">Privacy Policy</Link>
                  <Link href="/terms" className="block text-[12px] font-semibold text-[#0066FF]">Terms of Service</Link>
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-900">Follow Us</p>
                <div className="mt-2 flex gap-2">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.213 5.567 5.951-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
