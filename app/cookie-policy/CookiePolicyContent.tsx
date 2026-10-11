"use client"

import Link from "next/link"
import { useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import Footer from "@/components/home/Footer"
import { Cookie, CheckCircle2 } from "lucide-react"

const TOC = [
  "1. Introduction",
  "2. What Are Cookies?",
  "3. How Gonn'a Global Uses Cookies",
  "4. Types of Cookies We May Use",
  "5. Third-Party Cookies",
  "6. Managing Cookies",
  "7. Local Storage & Similar Technologies",
  "8. Cookie Duration",
  "9. Privacy & Personal Information",
  "10. Changes to This Cookie Policy",
  "11. Contact Information",
]
const TOC_IDS = TOC.map((_, i) => `cp-section-${i + 1}`)

const SectionNum = ({ n }: { n: number }) => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50 text-[13px] font-bold text-amber-600">{n}</div>
)

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
    <span className="text-[13px] leading-relaxed text-gray-700">{text}</span>
  </li>
)

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-4">
    <p className="text-[13px] font-semibold text-gray-900">{title}</p>
    <div className="mt-2">{children}</div>
  </div>
)

export default function CookiePolicyContent() {
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Cookie className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gray-400">Privacy &amp; Data Protection</p>
              <h1 className="text-[28px] font-black leading-tight tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                Cookie Policy
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
                            ? "bg-amber-50 text-amber-600"
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

              <div id="cp-section-1" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={1} /><h2 className="text-[16px] font-bold text-gray-900">Introduction</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">This Cookie Policy explains how <strong>Gonn&apos;a Global</strong> uses cookies and similar technologies when you access or use our website and platform.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">By continuing to use Gonn&apos;a Global, you acknowledge that cookies and similar technologies may be used as described in this policy.</p>
              </div>

              <div id="cp-section-2" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={2} /><h2 className="text-[16px] font-bold text-gray-900">What Are Cookies?</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, maintain functionality, understand how users interact with the platform, and improve the overall experience.</p>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-700">We may also use similar technologies such as local storage, pixels, tags, and other technical mechanisms for similar purposes.</p>
              </div>

              <div id="cp-section-3" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={3} /><h2 className="text-[16px] font-bold text-gray-900">How Gonn&apos;a Global Uses Cookies</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Gonn&apos;a Global may use cookies and similar technologies to:</p>
                <ul className="space-y-2">
                  <Bullet text="Keep users signed in." />
                  <Bullet text="Maintain account and session information." />
                  <Bullet text="Remember user preferences and settings." />
                  <Bullet text="Improve website and platform functionality." />
                  <Bullet text="Understand how users interact with our platform." />
                  <Bullet text="Monitor website performance." />
                  <Bullet text="Identify technical issues and errors." />
                  <Bullet text="Improve security and help prevent fraudulent or abusive activity." />
                  <Bullet text="Analyze platform usage and improve our services." />
                </ul>
              </div>

              <div id="cp-section-4" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={4} /><h2 className="text-[16px] font-bold text-gray-900">Types of Cookies We May Use</h2></div>

                <SubSection title="Essential Cookies">
                  <p className="text-[13px] leading-relaxed text-gray-700">These cookies are necessary for the basic operation and security of Gonn&apos;a Global. They may be used for authentication, login sessions, security, account functionality, and platform navigation. These cookies generally cannot be disabled through the platform because certain features may not function properly without them.</p>
                </SubSection>

                <SubSection title="Functional Cookies">
                  <p className="text-[13px] leading-relaxed text-gray-700">Functional cookies help remember choices and preferences so that the platform can provide a more convenient experience — such as user preferences, interface settings, session-related choices, and other settings required to improve the user experience.</p>
                </SubSection>

                <SubSection title="Analytics Cookies">
                  <p className="text-[13px] leading-relaxed text-gray-700">Analytics cookies help us understand how users interact with Gonn&apos;a Global — which pages are visited, how users navigate the platform, which features are used, general platform performance, and technical issues. Analytics information may be collected in an aggregated or appropriately protected form.</p>
                </SubSection>

                <SubSection title="Security Cookies">
                  <p className="text-[13px] leading-relaxed text-gray-700">Security-related cookies and similar technologies may be used to help protect accounts and the platform from unauthorized access, fraud, abuse, and malicious activity.</p>
                </SubSection>
              </div>

              <div id="cp-section-5" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={5} /><h2 className="text-[16px] font-bold text-gray-900">Third-Party Cookies</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Some third-party services used by Gonn&apos;a Global may place cookies or use similar technologies on your device. These services may include providers supporting:</p>
                <ul className="space-y-2">
                  <Bullet text="Authentication" />
                  <Bullet text="Analytics" />
                  <Bullet text="Hosting and infrastructure" />
                  <Bullet text="Security" />
                  <Bullet text="Communication" />
                  <Bullet text="Other platform functionality" />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">Third-party providers may have their own privacy and cookie policies. We recommend reviewing their policies where applicable.</p>
              </div>

              <div id="cp-section-6" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={6} /><h2 className="text-[16px] font-bold text-gray-900">Managing Cookies</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Depending on your browser and location, you may be able to control or manage cookies through your browser settings. You can generally:</p>
                <ul className="space-y-2">
                  <Bullet text="View stored cookies." />
                  <Bullet text="Delete existing cookies." />
                  <Bullet text="Block certain cookies." />
                  <Bullet text="Block all cookies." />
                  <Bullet text="Receive notifications when cookies are being used." />
                </ul>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">However, disabling essential cookies may affect the functionality of certain parts of Gonn&apos;a Global, including login and account-related features.</p>
              </div>

              <div id="cp-section-7" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={7} /><h2 className="text-[16px] font-bold text-gray-900">Local Storage &amp; Similar Technologies</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Gonn&apos;a Global may also use browser local storage and similar technologies to store certain information on your device. These technologies may be used to maintain sessions, remember preferences, improve performance, and support platform functionality.</p>
              </div>

              <div id="cp-section-8" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={8} /><h2 className="text-[16px] font-bold text-gray-900">Cookie Duration</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-3">Cookies may be either:</p>
                <div className="space-y-3">
                  <div className="rounded-[10px] border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-[13px] font-semibold text-gray-900">Session Cookies</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">Temporary cookies that are generally removed when you close your browser or when the relevant session ends.</p>
                  </div>
                  <div className="rounded-[10px] border border-amber-100 bg-amber-50 px-4 py-3">
                    <p className="text-[13px] font-semibold text-gray-900">Persistent Cookies</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">These remain on your device for a defined period or until you delete them through your browser or device settings.</p>
                  </div>
                </div>
              </div>

              <div id="cp-section-9" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={9} /><h2 className="text-[16px] font-bold text-gray-900">Privacy &amp; Personal Information</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">Cookies may sometimes be associated with information that can relate to your account or device. Our collection and use of personal information is described in our <Link href="/privacy-policy" className="text-[#0066FF] hover:underline">Privacy Policy</Link>.</p>
                <div className="mt-3 rounded-[10px] bg-green-50 border border-green-200 px-4 py-3 text-[13px] font-semibold text-green-700">✅ Gonn&apos;a Global does not sell personal information to third parties.</div>
              </div>

              <div id="cp-section-10" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={10} /><h2 className="text-[16px] font-bold text-gray-900">Changes to This Cookie Policy</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700">We may update this Cookie Policy from time to time to reflect changes in our platform, technology, services, legal requirements, or cookie practices. When changes are made, the <strong>Last Updated</strong> date at the top of this policy will be updated. Where appropriate, significant changes may also be communicated through the platform or other reasonable means.</p>
              </div>

              <div id="cp-section-11" className="scroll-mt-20 rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3"><SectionNum n={11} /><h2 className="text-[16px] font-bold text-gray-900">Contact Information</h2></div>
                <p className="text-[13px] leading-relaxed text-gray-700 mb-4">If you have questions or concerns regarding this Cookie Policy or how Gonn&apos;a Global uses cookies, please contact us at:</p>
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
