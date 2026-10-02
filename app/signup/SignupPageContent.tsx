"use client"
import Image from "next/image"
import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"
import { User, Globe, Mail, Lock, Phone, BookOpen, GraduationCap, Building2, EyeOff, Eye, ArrowRight, ChevronDown } from "lucide-react"

const COUNTRIES = [
  "Afghanistan","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada","China",
  "Denmark","Egypt","Finland","France","Germany","Greece","Hong Kong","India","Indonesia","Ireland",
  "Israel","Italy","Japan","Kenya","Malaysia","Mexico","Netherlands","New Zealand","Nigeria","Norway",
  "Pakistan","Philippines","Poland","Portugal","Qatar","Russia","Saudi Arabia","Singapore",
  "South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Taiwan","Thailand",
  "Turkey","Ukraine","United Arab Emirates","United Kingdom","United States","Vietnam",
]

const EDUCATION_LEVELS = [
  "High School","Undergraduate (Year 1-2)","Undergraduate (Year 3-4)",
  "Postgraduate / Masters","PhD / Doctorate","Recent Graduate","Working Professional",
]

const INTERESTS = ["Study Abroad","Scholarships","Internships","Research","Global Careers","Other"]

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [country, setCountry] = useState("")
  // Student-specific
  const [educationLevel, setEducationLevel] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  // Mentor-specific
  const [expertise, setExpertise] = useState("")
  const [experience, setExperience] = useState("")
  const [linkedin, setLinkedin] = useState("")
  // Institution-specific
  const [institutionType, setInstitutionType] = useState("")
  const [website, setWebsite] = useState("")
  const [bio, setBio] = useState("")

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeNewsletter, setAgreeNewsletter] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeRole, setActiveRole] = useState("Student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const roleMap: Record<string, string> = { Student: "user", Mentor: "mentor", Institution: "recruiter" }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 3 ? [...prev, interest] : prev
    )
  }

  const handleSignup = async () => {
    if (!fullName || !email || !password || !country) { setError("Please fill in all required fields"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    if (!agreeTerms) { setError("Please agree to the Terms & Conditions"); return }
    try {
      setError(""); setLoading(true)
      const role = roleMap[activeRole]
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await sendEmailVerification(user)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, fullName, email, phone, country, role,
        roles: role === "recruiter" ? ["user","recruiter"] : role === "mentor" ? ["user","mentor"] : ["user"],
        activeRole: role, onboardingCompleted: false, newsletter: agreeNewsletter, createdAt: serverTimestamp(),
        // Role-specific fields
        ...(activeRole === "Student" && { educationLevel, interests: selectedInterests }),
        ...(activeRole === "Mentor" && { expertise, experience, linkedin }),
        ...(activeRole === "Institution" && { institutionType, website, bio }),
      })
      router.push(`/verify-email?redirect=${encodeURIComponent(redirect)}`)
    } catch (err) {
      console.error(err)
      if (err instanceof Error && "code" in err) {
        const e = err as { code: string }
        setError(e.code === "auth/email-already-in-use" ? "An account already exists with this email"
          : e.code === "auth/weak-password" ? "Password should be at least 6 characters"
          : "Something went wrong. Please try again.")
      }
    } finally { setLoading(false) }
  }

  const handleGoogleSignup = async () => {
    try {
      const role = roleMap[activeRole]
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const userRef = doc(db, "users", user.uid)
      const existingUser = await getDoc(userRef)
      if (!existingUser.exists()) {
        await setDoc(userRef, {
          uid: user.uid, fullName: user.displayName || "", email: user.email || "",
          country: "", role,
          roles: role === "recruiter" ? ["user","recruiter"] : role === "mentor" ? ["user","mentor"] : ["user"],
          activeRole: role, onboardingCompleted: false, createdAt: serverTimestamp(),
        }, { merge: true })
        router.push(`/onboarding/interests?redirect=${encodeURIComponent(redirect)}`)
      } else { router.push(redirect) }
    } catch (err) { console.error(err); setError("Unable to sign up with Google") }
  }

  const roleCards = [
    { id: "Student", icon: <GraduationCap className="h-5 w-5" />, desc: "Explore, apply and grow globally." },
    { id: "Mentor", icon: <User className="h-5 w-5" />, desc: "Guide the next generation." },
    { id: "Institution", icon: <Building2 className="h-5 w-5" />, desc: "Connect with global talent." },
  ]

  return (
    <main className="flex min-h-screen w-full bg-white font-sans text-gray-900">

      {/* LEFT PANEL */}
      <section className="relative hidden w-1/2 flex-col overflow-hidden lg:flex" style={{ backgroundColor: "#e8f4fc" }}>
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "47%", backgroundImage: "url('/login-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center 20%" }}>
          <div className="absolute inset-x-0 top-0" style={{ height: "45%", background: "linear-gradient(to bottom, #e8f4fc 0%, rgba(232,244,252,0) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0" style={{ height: "40%", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)" }} />
        </div>

        <div className="relative z-10 flex h-full flex-col px-9 py-8 xl:px-12 xl:py-10">
          <div>
            <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="h-auto w-[130px] object-contain" />
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">LEARN · APPLY · CONNECT · GONN'A GLOBAL</p>
            <h1 className="mt-3 text-[38px] font-black leading-[1.06] tracking-tight text-gray-900 xl:text-[46px]">
              Same<br />Curiosity.<br /><span style={{ color: "#0055FF" }}>Bigger Horizons.</span>
            </h1>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-gray-700">
              Join a global community of learners, mentors and institutions. Create your account and take the first step towards a brighter tomorrow.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { icon: <Globe className="h-5 w-5" />, bg: "#dbeeff", color: "#2563eb", title: "Discover global opportunities", sub: "Universities, scholarships, internships & more." },
                { icon: <User className="h-5 w-5" />, bg: "#d2f5e3", color: "#059669", title: "Get expert guidance", sub: "Connect with verified mentors." },
                { icon: <BookOpen className="h-5 w-5" />, bg: "#ecdffe", color: "#7c3aed", title: "AI-powered support", sub: "Personalized recommendations." },
                { icon: <GraduationCap className="h-5 w-5" />, bg: "#fde9c8", color: "#d97706", title: "Be part of a global community", sub: "Learn, share and grow together." },
              ].map(({ icon, bg, color, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]" style={{ backgroundColor: bg, color }}>{icon}</div>
                  <div><p className="text-[13px] font-semibold text-gray-900">{title}</p><p className="text-[11.5px] text-gray-600">{sub}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-auto w-full">
            <div className="-rotate-[6deg] text-[16px] text-gray-900" style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", display: "inline-block", marginBottom: "6px" }}>
              A global you<br />tomorrow.
            </div>
            <div className="flex items-end justify-between pb-5 pt-16 text-white xl:pt-20">
              {[{ num: "180+", label: "Countries" }, { num: "10K+", label: "Opportunities" }, { num: "50K+", label: "Students" }, { num: "4.9★", label: "User Rating" }].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <p className="text-[18px] font-bold xl:text-[20px]">{num}</p>
                  <p className="text-[9px] text-white/75 xl:text-[10px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex w-full flex-col overflow-y-auto p-6 sm:p-8 lg:w-1/2 xl:p-10">
        <div className="flex justify-end text-[13px] text-gray-600">
          <span className="flex items-center">
            Already have an account?
            <Link href="/login" className="ml-1.5 flex items-center font-semibold text-[#0066FF] hover:underline">
              Log In <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
            </Link>
          </span>
        </div>

        <div className="mx-auto w-full max-w-[500px] py-4">
          <div className="mb-4 flex justify-center">
            <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="h-auto w-[130px] object-contain" />
          </div>
          <h2 className="text-center text-[26px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Create Your Account</h2>
          <p className="mt-1 text-center text-[13px] text-gray-500">Join Gonn&apos;a Global and start your journey today.</p>

          {/* Role cards */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {roleCards.map(({ id, icon, desc }) => (
              <button key={id} type="button" onClick={() => setActiveRole(id)}
                className={`relative flex flex-col rounded-[12px] border-2 p-3 text-left transition ${activeRole === id ? "border-[#0066FF] bg-[#f0f5ff]" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <div className={`absolute right-2.5 top-2.5 h-4 w-4 rounded-full border-2 ${activeRole === id ? "border-[#0066FF]" : "border-gray-300"}`}>
                  {activeRole === id && <div className="absolute inset-[3px] rounded-full bg-[#0066FF]" />}
                </div>
                <div className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-[9px] ${activeRole === id ? "bg-[#0066FF] text-white" : "bg-gray-100 text-gray-600"}`}>{icon}</div>
                <p className="text-[13px] font-semibold text-gray-900">{id}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-gray-500">{desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name"
                  className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-4 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-3 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Phone Number <span className="font-normal text-gray-400">(Optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                    className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-3 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                </div>
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password"
                    className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-9 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password"
                    className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-9 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role-specific fields */}
            {activeRole === "Student" && (
              <>
                {/* Country + Education Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={country} onChange={e => setCountry(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select your country</option>
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Current Education Level</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={educationLevel} onChange={e => setEducationLevel(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select your level</option>
                        {EDUCATION_LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                {/* Interests */}
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-gray-800">Areas of Interest <span className="font-normal text-gray-400">(Select up to 3)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map(interest => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                        className={`rounded-full border px-3 py-1 text-[12px] font-medium transition ${selectedInterests.includes(interest) ? "border-[#0066FF] bg-[#0066FF] text-white" : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"}`}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeRole === "Mentor" && (
              <>
                {/* Country + Field of Expertise */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={country} onChange={e => setCountry(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select your country</option>
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Field of Expertise</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={expertise} onChange={e => setExpertise(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select your field</option>
                        {["Business & Entrepreneurship","Technology & Engineering","Medicine & Healthcare","Law & Policy","Arts & Design","Social Sciences","Education","Finance & Economics","Research & Academia","Other"].map(f => <option key={f}>{f}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                {/* Years of Experience + LinkedIn */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Years of Experience</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={experience} onChange={e => setExperience(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select range</option>
                        {["0–2 years","3–5 years","6–10 years","11–15 years","15+ years"].map(y => <option key={y}>{y}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">LinkedIn URL <span className="font-normal text-gray-400">(Optional)</span></label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/yourname"
                        className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-3 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeRole === "Institution" && (
              <>
                {/* Country + Institution Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={country} onChange={e => setCountry(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select your country</option>
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Institution Type</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <select value={institutionType} onChange={e => setInstitutionType(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option value="">Select type</option>
                        {["University / College","School","NGO / Non-profit","Corporate / Company","Government Body","Research Institute","Other"].map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                {/* Website */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Official Website <span className="font-normal text-gray-400">(Optional)</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourinstitution.edu"
                      className="w-full rounded-[10px] border border-gray-200 py-2.5 pl-10 pr-4 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                  </div>
                </div>
                {/* Brief Description */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Brief Description <span className="font-normal text-gray-400">(Optional)</span></label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} placeholder="Tell students about your institution, programs and opportunities..."
                    className="w-full rounded-[10px] border border-gray-200 px-4 py-2.5 text-[13px] outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] resize-none" />
                </div>
              </>
            )}

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]" />
                <span className="text-[12px] text-gray-700">
                  I agree to the <Link href="/terms" className="font-semibold text-[#0066FF] hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="font-semibold text-[#0066FF] hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input type="checkbox" checked={agreeNewsletter} onChange={e => setAgreeNewsletter(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]" />
                <span className="text-[12px] text-gray-700">I would like to receive updates, newsletters and opportunity alerts.</span>
              </label>
            </div>

            {error && <p className="text-[12px] font-medium text-red-500">{error}</p>}

            <button type="button" onClick={handleSignup} disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6] active:scale-[0.99] disabled:opacity-70">
              {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-gray-200" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">OR</span>
              <div className="h-[1px] flex-1 bg-gray-200" />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={handleGoogleSignup} className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-2.5 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.5 6.9l6.2 5.2C39.7 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
                </svg>
                <span className="whitespace-nowrap">Sign up with Google</span>
              </button>
              <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-2.5 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-4 w-4 shrink-0">
                  <path fill="#000" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <span className="whitespace-nowrap">Sign up with Apple</span>
              </button>
              <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-2.5 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                  <path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                <span className="whitespace-nowrap">Sign up with Microsoft</span>
              </button>
            </div>

            <p className="text-center text-[12px] text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#0066FF] hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function SignupPage() {
  return (
    <>
      <h1 className="sr-only">Create your Gonn&apos;a Global account</h1>
      <Suspense fallback={null}>
        <SignupPageContent />
      </Suspense>
    </>
  )
}
