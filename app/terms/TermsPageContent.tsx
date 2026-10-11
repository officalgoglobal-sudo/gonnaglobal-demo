"use client"

import Link from "next/link"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Footer from "@/components/home/Footer"
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react"

const TOC = [
  "1. Acceptance of Terms",
  "2. About Gonn'a Global",
  "3. User Accounts",
  "4. Recruiters, Organizations & Opportunity Providers",
  "5. Acceptable Use",
  "6. Opportunities & Third-Party Content",
  "7. Intellectual Property",
  "8. User-Submitted Content",
  "9. Privacy & Data",
  "10. Limitation of Liability",
  "11. Platform Availability & Changes",
  "12. Account Suspension & Termination",
  "13. Third-Party Links & Services",
  "14. Governing Law",
  "15. Contact Information",
]
const TOC_IDS = TOC.map((_, i) => `section-${i + 1}`)

const SectionNum = ({ n }: { n: number }) => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-[13px] font-bold text-[#0066FF]">{n}</div>
)

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
    <span className="text-[13px] leading-relaxed text-gray-700">{text}</span>
  </li>
)

const CrossBullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
    <span className="text-[13px] leading-relaxed text-gray-700">{text}</span>
  </li>
)

export default function TermsPageContent() {
  const [active, setActive] = useState(TOC_IDS[0])

  const scrollTo = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="lg:ml-[80px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

          {/* Header */}
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <ShieldCheck className="h-5 w-5 text-[#0066FF]" />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gray-400">Legal</p>
              <h1 className="text-[28px] font-black leading-tight tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                Terms &amp; Conditions
              </h1>
              <p className="mt-1 text-[12.5px] text-gray-500">Last updated: October 2026</p>
            </div>
          </div>

          <div className="flex gap-6">

            {/* TOC Sidebar */}
            <aside className="hidden lg:block w-[230px] shrink-0">
              <div className="sticky top-20 rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Contents</p>
                <ul className="flex flex-col gap-1">
                  {TOC.map((label, i) => (
                    <li key={i}>
                      <button
                        onClick={() => scrollTo(TOC_IDS[i])}
                        className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[11.5px] font-medium transition-all duration-150 ${
                          active === TOC_IDS[i]
                            ? "bg-blue-50 text-[#0066FF]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-4 pb-16">

              {/* Section 1 */}
              <div id="section-1" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={1} /><h2 className="text-[16px] font-bold text-gray-900">Acceptance of Terms</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">By accessing, registering for, or using <strong>Gonn&apos;a Global</strong>, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, please discontinue use of the platform.</p>
              </div>

              {/* Section 2 */}
              <div id="section-2" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={2} /><h2 className="text-[16px] font-bold text-gray-900">About Gonn&apos;a Global</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global is a global opportunity discovery platform that helps students, professionals, recruiters, organizations, and institutions discover and share opportunities, including internships, scholarships, fellowships, competitions, conferences, research programs, jobs, events, and other educational or career-related opportunities.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global primarily acts as a discovery and information platform and does not guarantee admission, selection, employment, funding, acceptance, or any particular outcome from an opportunity.</p>
              </div>

              {/* Section 3 */}
              <div id="section-3" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={3} /><h2 className="text-[16px] font-bold text-gray-900">User Accounts</h2></div>
                <ul className="mt-2 space-y-2">
                  <Bullet text="Users must provide accurate, current, and complete information when creating an account." />
                  <Bullet text="Users are responsible for maintaining the confidentiality and security of their account credentials." />
                  <Bullet text="Users must not impersonate another individual, organization, or entity." />
                  <Bullet text="Users are responsible for activities conducted through their account." />
                  <Bullet text="Users must notify Gonn'a Global if they believe their account has been accessed or used without authorization." />
                  <Bullet text="Users must not create accounts for fraudulent, abusive, or unlawful purposes." />
                </ul>
              </div>

              {/* Section 4 */}
              <div id="section-4" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={4} /><h2 className="text-[16px] font-bold text-gray-900">Recruiters, Organizations &amp; Opportunity Providers</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Organizations, recruiters, institutions, and other opportunity providers using Gonn&apos;a Global are responsible for the information they publish. They must:</p>
                <ul className="mt-3 space-y-2">
                  <Bullet text="Provide accurate and truthful opportunity information." />
                  <Bullet text="Clearly communicate eligibility requirements, deadlines, fees, and other relevant conditions where applicable." />
                  <Bullet text="Not publish misleading, fraudulent, discriminatory, or illegal opportunities." />
                  <Bullet text="Comply with applicable laws and regulations." />
                  <Bullet text="Maintain professional and respectful conduct with users." />
                  <Bullet text="Not misuse personal information obtained through the platform." />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">Gonn&apos;a Global reserves the right to review, modify, restrict, or remove opportunities and suspend or terminate accounts that violate these requirements.</p>
              </div>

              {/* Section 5 */}
              <div id="section-5" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={5} /><h2 className="text-[16px] font-bold text-gray-900">Acceptable Use</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Users must not:</p>
                <ul className="space-y-2">
                  <CrossBullet text="Attempt to gain unauthorized access to the platform, accounts, systems, or data." />
                  <CrossBullet text="Upload malware, harmful files, or malicious content." />
                  <CrossBullet text="Publish fraudulent, misleading, or illegal content." />
                  <CrossBullet text="Interfere with the normal operation or security of the platform." />
                  <CrossBullet text="Scrape, copy, reproduce, or systematically extract platform data without authorization." />
                  <CrossBullet text="Misuse personal information or platform resources." />
                  <CrossBullet text="Engage in spam, harassment, abuse, threats, or discriminatory behavior." />
                  <CrossBullet text="Use the platform for unlawful activities." />
                  <CrossBullet text="Attempt to circumvent platform security or access controls." />
                </ul>
                <p className="mt-3 text-[13px] text-gray-600">Violation of these requirements may result in removal of content, suspension, termination of an account, or other appropriate action.</p>
              </div>

              {/* Section 6 */}
              <div id="section-6" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={6} /><h2 className="text-[16px] font-bold text-gray-900">Opportunities &amp; Third-Party Content</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global acts primarily as an information and opportunity discovery platform. Opportunities listed may originate from third parties including companies, universities, organizations, institutions, governments, communities, and other external sources.</p>
                <p className="mt-3 text-[13px] text-gray-700 mb-2">While we make reasonable efforts to maintain useful and accurate information, Gonn&apos;a Global does not guarantee:</p>
                <ul className="space-y-2">
                  <CrossBullet text="The continued availability of an opportunity." />
                  <CrossBullet text="The accuracy or completeness of third-party information." />
                  <CrossBullet text="Eligibility for a particular opportunity." />
                  <CrossBullet text="Acceptance, admission, selection, employment, funding, or any other outcome." />
                  <CrossBullet text="The actions or conduct of third-party organizations or opportunity providers." />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">Users should independently verify important information, eligibility requirements, deadlines, fees, application procedures, and other conditions directly with the relevant opportunity provider before applying or making any decision.</p>
              </div>

              {/* Section 7 */}
              <div id="section-7" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={7} /><h2 className="text-[16px] font-bold text-gray-900">Intellectual Property</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">All Gonn&apos;a Global branding, logos, trademarks, designs, graphics, text, software, features, user interface elements, and other original platform assets are owned by or licensed to Gonn&apos;a Global and are protected by applicable intellectual property laws.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">Users may not reproduce, modify, distribute, publicly display, sell, license, or otherwise exploit Gonn&apos;a Global&apos;s proprietary content or assets without prior written permission. Third-party trademarks, logos, names, and content remain the property of their respective owners.</p>
              </div>

              {/* Section 8 */}
              <div id="section-8" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={8} /><h2 className="text-[16px] font-bold text-gray-900">User-Submitted Content</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Where users are permitted to submit content, users are responsible for ensuring that such content is accurate and lawful. Users must not submit content that:</p>
                <ul className="mt-3 space-y-2">
                  <CrossBullet text="Infringes another person's intellectual property or privacy rights." />
                  <CrossBullet text="Is fraudulent, defamatory, threatening, abusive, or unlawful." />
                  <CrossBullet text="Contains malicious software or harmful code." />
                  <CrossBullet text="Violates these Terms & Conditions." />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">By submitting content to Gonn&apos;a Global, you grant Gonn&apos;a Global the permissions reasonably necessary to store, process, display, and operate the platform using that content, subject to our Privacy Policy and applicable law.</p>
              </div>

              {/* Section 9 */}
              <div id="section-9" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={9} /><h2 className="text-[16px] font-bold text-gray-900">Privacy &amp; Data</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Your use of Gonn&apos;a Global is also subject to our <Link href="/privacy-policy" className="text-[#0066FF] hover:underline">Privacy Policy</Link>, which explains how we collect, use, store, and protect personal information.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">We aim to implement reasonable technical and organizational measures to protect user information. However, no online platform can guarantee absolute security. Users are responsible for keeping their account credentials and sensitive information secure.</p>
              </div>

              {/* Section 10 */}
              <div id="section-10" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={10} /><h2 className="text-[16px] font-bold text-gray-900">Limitation of Liability</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">To the maximum extent permitted by applicable law, Gonn&apos;a Global, its founders, team members, affiliates, partners, and service providers shall not be liable for any direct, indirect, incidental, consequential, special, or other damages arising from or related to:</p>
                <ul className="mt-3 space-y-2">
                  <CrossBullet text="Use or inability to use the platform." />
                  <CrossBullet text="Reliance on information listed on the platform." />
                  <CrossBullet text="Application decisions or outcomes." />
                  <CrossBullet text="Actions or conduct of third-party opportunity providers." />
                  <CrossBullet text="Loss or interruption of opportunities." />
                  <CrossBullet text="Unauthorized access or security incidents beyond our reasonable control." />
                  <CrossBullet text="Third-party websites, services, or content." />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">Users are responsible for independently evaluating opportunities and making their own application and participation decisions.</p>
              </div>

              {/* Section 11 */}
              <div id="section-11" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={11} /><h2 className="text-[16px] font-bold text-gray-900">Platform Availability &amp; Changes</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">We continuously improve Gonn&apos;a Global and may add, modify, restrict, suspend, or discontinue features, services, content, or parts of the platform at any time. We may also update these Terms &amp; Conditions when necessary. Where appropriate, material changes may be communicated through the platform or other reasonable means.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">Your continued use of Gonn&apos;a Global after updated Terms &amp; Conditions become effective constitutes acceptance of the updated terms.</p>
              </div>

              {/* Section 12 */}
              <div id="section-12" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={12} /><h2 className="text-[16px] font-bold text-gray-900">Account Suspension &amp; Termination</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Gonn&apos;a Global reserves the right to suspend, restrict, or terminate accounts that:</p>
                <ul className="space-y-2">
                  <CrossBullet text="Violate these Terms & Conditions." />
                  <CrossBullet text="Provide false or fraudulent information." />
                  <CrossBullet text="Engage in abusive, harmful, or unlawful activities." />
                  <CrossBullet text="Attempt to compromise platform security." />
                  <CrossBullet text="Misuse the platform or other users' information." />
                  <CrossBullet text="Engage in activities that may harm Gonn'a Global, its users, or its partners." />
                </ul>
                <p className="mt-3 text-[13px] text-gray-600">Where appropriate, Gonn&apos;a Global may remove associated content or restrict access to certain platform features.</p>
              </div>

              {/* Section 13 */}
              <div id="section-13" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={13} /><h2 className="text-[16px] font-bold text-gray-900">Third-Party Links &amp; Services</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global may contain links to websites, applications, services, or resources operated by third parties. These third-party services are not controlled by Gonn&apos;a Global, and we are not responsible for their content, availability, security, privacy practices, or terms.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">Users should review the relevant third party&apos;s terms and privacy policies before using external services.</p>
              </div>

              {/* Section 14 */}
              <div id="section-14" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={14} /><h2 className="text-[16px] font-bold text-gray-900">Governing Law</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">These Terms &amp; Conditions shall be governed by and interpreted in accordance with the applicable laws of India, unless otherwise required by applicable law. Any disputes arising in connection with these Terms &amp; Conditions shall be subject to the jurisdiction of the appropriate courts in India.</p>
              </div>

              {/* Section 15 */}
              <div id="section-15" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={15} /><h2 className="text-[16px] font-bold text-gray-900">Contact Information</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-4">If you have questions regarding these Terms &amp; Conditions, you can contact us at:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[13px] text-gray-700"><span className="font-semibold w-24">Email:</span><a href="mailto:official@gonnaglobal.com" className="text-[#0066FF] hover:underline">official@gonnaglobal.com</a></div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-700"><span className="font-semibold w-24">Instagram:</span><a href="https://instagram.com/gonnaglobal" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">@gonnaglobal</a></div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-700"><span className="font-semibold w-24">Website:</span><a href="https://gonnaglobal.com" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">gonnaglobal.com</a></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}
