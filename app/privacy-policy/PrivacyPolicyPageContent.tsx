"use client"

import Link from "next/link"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Footer from "@/components/home/Footer"
import { ShieldCheck, CheckCircle2 } from "lucide-react"

const TOC = [
  "1. Introduction",
  "2. Information We Collect",
  "3. How We Use Your Information",
  "4. Data Storage & Security",
  "5. Third-Party Services",
  "6. Data Sharing",
  "7. Cookies & Analytics",
  "8. Your Rights & Choices",
  "9. Children's Privacy",
  "10. Data Retention",
  "11. International Data Processing",
  "12. Links to Third-Party Websites",
  "13. Changes to This Policy",
  "14. Contact Information",
]
const TOC_IDS = TOC.map((_, i) => `pp-section-${i + 1}`)

const SectionNum = ({ n }: { n: number }) => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-[13px] font-bold text-[#0066FF]">{n}</div>
)

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
    <span className="text-[13px] leading-relaxed text-gray-700">{text}</span>
  </li>
)

export default function PrivacyPolicyPageContent() {
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
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gray-400">Privacy &amp; Data Protection</p>
              <h1 className="text-[28px] font-black leading-tight tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                Privacy Policy
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

              <div id="pp-section-1" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={1} /><h2 className="text-[16px] font-bold text-gray-900">Introduction</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">At <strong>Gonn&apos;a Global</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard information when you access or use our platform and services.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">By using Gonn&apos;a Global, you acknowledge that you have read and understood this Privacy Policy.</p>
              </div>

              <div id="pp-section-2" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={2} /><h2 className="text-[16px] font-bold text-gray-900">Information We Collect</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Depending on how you use Gonn&apos;a Global, we may collect the following information:</p>
                <ul className="space-y-2">
                  <Bullet text="Full name and profile information." />
                  <Bullet text="Email address and authentication details." />
                  <Bullet text="Country, education, interests, skills, and opportunity preferences." />
                  <Bullet text="Saved opportunities, applications, bookmarks, and platform activity." />
                  <Bullet text="Information you provide through your profile or account." />
                  <Bullet text="Device, browser, IP address, and technical usage information." />
                  <Bullet text="Communication preferences." />
                  <Bullet text="Support requests, feedback, and other communications with us." />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">We only seek to collect information that is reasonably necessary to provide, maintain, secure, and improve our services.</p>
              </div>

              <div id="pp-section-3" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={3} /><h2 className="text-[16px] font-bold text-gray-900">How We Use Your Information</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">We may use collected information to:</p>
                <ul className="space-y-2">
                  <Bullet text="Provide and personalize opportunity recommendations." />
                  <Bullet text="Create and manage your Gonn'a Global account." />
                  <Bullet text="Improve platform functionality and user experience." />
                  <Bullet text="Understand user interests and platform usage." />
                  <Bullet text="Maintain account security and prevent fraud, abuse, and misuse." />
                  <Bullet text="Respond to support requests and inquiries." />
                  <Bullet text="Communicate important account, security, and platform updates." />
                  <Bullet text="Analyze platform performance and growth." />
                  <Bullet text="Develop and improve new features and services." />
                </ul>
              </div>

              <div id="pp-section-4" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={4} /><h2 className="text-[16px] font-bold text-gray-900">Data Storage &amp; Security</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global uses trusted cloud infrastructure, secure authentication mechanisms, access controls, and reasonable technical and organizational security measures to protect user information.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">We take reasonable steps to protect personal information against unauthorized access, alteration, disclosure, loss, or misuse. However, no internet-based service or electronic storage system can guarantee absolute security. Users are also responsible for maintaining the security of their account credentials and devices.</p>
              </div>

              <div id="pp-section-5" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={5} /><h2 className="text-[16px] font-bold text-gray-900">Third-Party Services</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Gonn&apos;a Global may use trusted third-party service providers to operate and improve the platform. These services may include providers for:</p>
                <ul className="space-y-2">
                  <Bullet text="Authentication" />
                  <Bullet text="Cloud hosting and infrastructure" />
                  <Bullet text="Database and data storage" />
                  <Bullet text="File storage" />
                  <Bullet text="Analytics" />
                  <Bullet text="Email and communication" />
                  <Bullet text="Security and platform monitoring" />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">Third-party providers may process information only as necessary to provide their services to Gonn&apos;a Global, subject to their applicable policies and agreements.</p>
              </div>

              <div id="pp-section-6" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={6} /><h2 className="text-[16px] font-bold text-gray-900">Data Sharing</h2></div>
                <div className="mb-3 rounded-[10px] bg-green-50 border border-green-200 px-4 py-3 text-[13px] font-semibold text-green-700">✅ Gonn&apos;a Global does not sell personal information to third parties.</div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">We may share or disclose information when reasonably necessary:</p>
                <ul className="space-y-2">
                  <Bullet text="To provide and operate our services." />
                  <Bullet text="With trusted service providers that support our platform." />
                  <Bullet text="To protect the security and integrity of Gonn'a Global." />
                  <Bullet text="To prevent fraud, abuse, or illegal activity." />
                  <Bullet text="To comply with applicable laws, regulations, legal processes, or lawful requests." />
                  <Bullet text="To protect the rights, safety, and property of Gonn'a Global, our users, or others." />
                </ul>
                <p className="mt-3 text-[13px] text-gray-600">We aim to limit information shared with third parties to what is reasonably necessary for the relevant purpose.</p>
              </div>

              <div id="pp-section-7" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={7} /><h2 className="text-[16px] font-bold text-gray-900">Cookies &amp; Analytics</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Gonn&apos;a Global may use cookies, local storage, analytics technologies, and similar technologies to:</p>
                <ul className="space-y-2">
                  <Bullet text="Keep users signed in." />
                  <Bullet text="Maintain preferences." />
                  <Bullet text="Improve platform functionality." />
                  <Bullet text="Understand how users interact with the platform." />
                  <Bullet text="Monitor performance and identify technical issues." />
                  <Bullet text="Improve the overall user experience." />
                </ul>
                <p className="mt-3 text-[13px] text-gray-600">For more details, see our <Link href="/cookie-policy" className="text-[#0066FF] hover:underline">Cookie Policy</Link>.</p>
              </div>

              <div id="pp-section-8" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={8} /><h2 className="text-[16px] font-bold text-gray-900">Your Rights &amp; Choices</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Depending on applicable law, you may have rights regarding your personal information, including:</p>
                <ul className="space-y-2">
                  <Bullet text="Access personal information associated with your account." />
                  <Bullet text="Request correction of inaccurate or incomplete information." />
                  <Bullet text="Request deletion of your account and personal information, subject to legal or operational requirements." />
                  <Bullet text="Request information about how your data is used." />
                  <Bullet text="Withdraw certain communications or marketing preferences." />
                  <Bullet text="Contact us regarding privacy concerns." />
                </ul>
                <p className="mt-3 text-[13px] text-gray-600">To make a privacy-related request, contact us using the information provided in Section 14.</p>
              </div>

              <div id="pp-section-9" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={9} /><h2 className="text-[16px] font-bold text-gray-900">Children&apos;s Privacy</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global is primarily intended for students, young professionals, and opportunity seekers. Users must comply with applicable laws and age requirements when creating and using an account. If we become aware that personal information has been collected in circumstances where collection is not permitted by applicable law, we may take appropriate steps to delete or restrict that information.</p>
              </div>

              <div id="pp-section-10" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={10} /><h2 className="text-[16px] font-bold text-gray-900">Data Retention</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">We retain personal information for as long as reasonably necessary to provide our services, maintain accounts, comply with legal obligations, resolve disputes, enforce agreements, and maintain legitimate business and security records. When information is no longer required, we may delete, anonymize, or securely dispose of it in accordance with applicable requirements.</p>
              </div>

              <div id="pp-section-11" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={11} /><h2 className="text-[16px] font-bold text-gray-900">International Data Processing</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Because Gonn&apos;a Global uses cloud-based infrastructure and third-party service providers, personal information may be processed or stored in locations outside your country. Where applicable, we take reasonable steps to ensure that such processing is carried out using appropriate safeguards and in accordance with applicable data protection requirements.</p>
              </div>

              <div id="pp-section-12" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={12} /><h2 className="text-[16px] font-bold text-gray-900">Links to Third-Party Websites</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global may contain links to external websites, organizations, opportunity providers, or other third-party services. This Privacy Policy applies only to Gonn&apos;a Global. We are not responsible for the privacy practices, security, or content of third-party websites or services. We recommend reviewing the privacy policy of any third-party service before providing personal information.</p>
              </div>

              <div id="pp-section-13" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={13} /><h2 className="text-[16px] font-bold text-gray-900">Changes to This Policy</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">We may update this Privacy Policy from time to time to reflect changes to our platform, services, technology, legal requirements, or privacy practices. When changes are made, the <strong>Last Updated</strong> date at the top of this policy will be updated. Where appropriate, significant changes may also be communicated through the platform or other reasonable means.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">Your continued use of Gonn&apos;a Global after an updated Privacy Policy becomes effective constitutes acceptance of the revised policy.</p>
              </div>

              <div id="pp-section-14" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={14} /><h2 className="text-[16px] font-bold text-gray-900">Contact Information</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at:</p>
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
