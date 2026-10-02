
"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"
import { GraduationCap, Users, FileText, Globe, Mail, Lock, EyeOff, ArrowRight, Building2 } from "lucide-react"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Toggle state for the UI
  const [activeRole, setActiveRole] = useState("Student")

  // Role-specific content — each tab shows different context
  const roleConfig = {
    Student: {
      subtitle: "Log in to discover global opportunities for your future.",
      emailLabel: "Student Email",
      emailPlaceholder: "student@university.edu",
      buttonLabel: "Log In as Student",
    },
    Mentor: {
      subtitle: "Log in to guide and inspire the next generation.",
      emailLabel: "Mentor Email",
      emailPlaceholder: "mentor@example.com",
      buttonLabel: "Log In as Mentor",
    },
    Institution: {
      subtitle: "Log in to manage your institution's global presence.",
      emailLabel: "Institutional Email",
      emailPlaceholder: "admin@institution.edu",
      buttonLabel: "Log In as Institution",
    },
  } as const

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please enter all details")
        return
      }
      setError("")
      setLoading(true)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await user.reload()

      if (!user.emailVerified) {
        router.push("/verify-email")
        return
      }

      await getDoc(doc(db, "users", user.uid))
      router.push(redirect)
    } catch (error) {
      console.error(error)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setError("Password reset email sent")
    } catch (error) {
      console.error(error)
      setError("Unable to send reset email")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const userDoc = await getDoc(doc(db, "users", user.uid))
      
      if (!userDoc.exists()) {
        setError("No account found. Please sign up first.")
        return
      }
      router.push(redirect)
    } catch (error) {
      console.error(error)
      setError("Unable to login with Google")
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-white font-sans text-gray-900">
      {/* LEFT SIDE */}
      <section className="relative hidden w-1/2 flex-col overflow-hidden lg:flex" style={{ backgroundColor: "#e8f4fc" }}>

        {/* ── PHOTO: strictly bottom 47% of the panel ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "47%",
            backgroundImage: "url('/login-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        >
          {/* Top fade — photo dissolves into the light blue above */}
          <div
            className="absolute inset-x-0 top-0"
            style={{ height: "45%", background: "linear-gradient(to bottom, #e8f4fc 0%, rgba(232,244,252,0) 100%)" }}
          />
          {/* Bottom dark overlay for stats readability */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{ height: "40%", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)" }}
          />
        </div>

        {/* ── CONTENT LAYER ── */}
        <div className="relative z-10 flex h-full flex-col px-9 py-8 xl:px-12 xl:py-10">

          {/* TOP: logo + tagline + heading + description + icons */}
          <div>
            {/* Gonn'a Global logo — left panel */}
            <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="h-auto w-[150px] object-contain" />

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              LEARN · APPLY · CONNECT · GONN'A GLOBAL
            </p>

            <h1 className="mt-3 text-[38px] font-black leading-[1.08] tracking-tight text-gray-900 xl:text-[46px]">
              A Brighter<br />
              Tomorrow<br />
              <span style={{ color: "#0055FF" }}>Knows No Borders.</span>
            </h1>

            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-gray-700">
              Your global journey starts here. Explore opportunities, get guidance, and turn your dreams into reality.
            </p>

            {/* Feature icon grid */}
            <div className="mt-6 flex w-full justify-between">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] shadow-sm" style={{ backgroundColor: "#dbeeff", color: "#2563eb" }}>
                  <GraduationCap className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <p className="text-center text-[10.5px] font-medium leading-tight text-gray-800">Global<br />Opportunities</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] shadow-sm" style={{ backgroundColor: "#d2f5e3", color: "#059669" }}>
                  <Users className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <p className="text-center text-[10.5px] font-medium leading-tight text-gray-800">Expert<br />Mentorship</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] shadow-sm" style={{ backgroundColor: "#ecdffe", color: "#7c3aed" }}>
                  <FileText className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <p className="text-center text-[10.5px] font-medium leading-tight text-gray-800">AI-Powered<br />Guidance</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[15px] shadow-sm" style={{ backgroundColor: "#fde9c8", color: "#d97706" }}>
                  <Globe className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <p className="text-center text-[10.5px] font-medium leading-tight text-gray-800">A Supportive<br />Community</p>
              </div>
            </div>
          </div>

          {/* BOTTOM: handwritten notes + stats (sit over the photo) */}
          <div className="relative mt-auto w-full">
            {/* Handwritten note — left side */}
            <div
              className="-rotate-[8deg] text-[15px] text-gray-900"
              style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", display: "inline-block", marginBottom: "6px" }}
            >
              Students today.<br />Global leaders<br />tomorrow.
            </div>

            {/* Handwritten note — right side */}
            <div
              className="absolute right-6 rotate-[5deg] text-[15px] text-gray-800"
              style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", top: "-8px" }}
            >
              Same<br />Curiosity.<br />Bigger<br />Horizons.
            </div>

            {/* "A global you tomorrow." over photo bottom-right */}
            <div
              className="absolute bottom-8 right-3 -rotate-[4deg] text-[14px]"
              style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", color: "rgba(255,255,255,0.85)" }}
            >
              A global you<br />tomorrow.
            </div>

            {/* Stats row — white on dark photo gradient */}
            <div className="flex items-end justify-between pb-5 pt-28 text-white xl:pt-32">
              <div className="text-center">
                <p className="text-[18px] font-bold xl:text-[20px]">180+</p>
                <p className="text-[9px] text-white/75 xl:text-[10px]">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold xl:text-[20px]">10K+</p>
                <p className="text-[9px] text-white/75 xl:text-[10px]">Opportunities</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold xl:text-[20px]">50K+</p>
                <p className="text-[9px] text-white/75 xl:text-[10px]">Students</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold xl:text-[20px]">4.9★</p>
                <p className="text-[9px] text-white/75 xl:text-[10px]">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex w-full flex-col p-6 sm:p-8 lg:w-1/2 xl:p-12">
        <div className="flex justify-end text-[13px] text-gray-600">
          <span className="flex items-center">
            Don't have an account? 
            <Link href="/signup" className="ml-1.5 flex items-center font-semibold text-[#0066FF] hover:underline">
              Sign Up <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <div className="text-center">
            {/* Gonn'a Global logo — actual brand image */}
            <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="mx-auto h-auto w-[160px] object-contain" />
            <p className="mt-3 text-[8px] font-bold tracking-[0.25em] text-gray-400">
              OPPORTUNITIES BEYOND BORDERS
            </p>
            <h2 className="mt-5 text-[30px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Welcome Back</h2>
            <p className="mt-1.5 text-[13px] text-gray-500">{roleConfig[activeRole as keyof typeof roleConfig].subtitle}</p>
          </div>

          <div className="mt-7 flex rounded-[12px] border border-gray-200 p-1">
            <button 
              onClick={() => setActiveRole("Student")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-[9px] py-2.5 text-[13px] font-medium transition ${activeRole === "Student" ? "bg-[#0066FF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <GraduationCap className="h-4 w-4" /> Student
            </button>
            <button 
              onClick={() => setActiveRole("Mentor")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-[9px] py-2.5 text-[13px] font-medium transition ${activeRole === "Mentor" ? "bg-[#0066FF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Users className="h-4 w-4" /> Mentor
            </button>
            <button 
              onClick={() => setActiveRole("Institution")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-[9px] py-2.5 text-[13px] font-medium transition ${activeRole === "Institution" ? "bg-[#0066FF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Building2 className="h-4 w-4" /> Institution
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-800">
                {roleConfig[activeRole as keyof typeof roleConfig].emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleConfig[activeRole as keyof typeof roleConfig].emailPlaceholder}
                  className="w-full rounded-[10px] border border-gray-200 py-3 pl-10 pr-4 text-[13px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" 
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-800">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  className="w-full rounded-[10px] border border-gray-200 py-3 pl-10 pr-10 text-[13px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Mail className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input 
                  type="checkbox" 
                  className="h-3.5 w-3.5 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]" 
                  defaultChecked 
                />
                <span className="text-[12px] font-medium text-gray-700">Remember me</span>
              </label>
              <Link 
                href="/forgot-password"
                className="text-[12px] font-medium text-[#0066FF] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-[13px] font-medium text-red-500">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6] active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? "Logging In..." : roleConfig[activeRole as keyof typeof roleConfig].buttonLabel} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-200"></div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">OR</span>
            <div className="h-[1px] flex-1 bg-gray-200"></div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-3 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.5 6.9l6.2 5.2C39.7 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              <span className="whitespace-nowrap">Continue with Google</span>
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-3 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-4 w-4 shrink-0">
                <path fill="#000000" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <span className="whitespace-nowrap">Continue with Apple</span>
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-3 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              <span className="whitespace-nowrap">Continue with Microsoft</span>
            </button>
          </div>

          <p className="mt-8 text-center text-[12px] text-gray-600">
            Don't have an account? <Link href="/signup" className="font-semibold text-[#0066FF] hover:underline">Sign Up</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <>
      <h1 className="sr-only">Log in to Gonn'a Global</h1>

      <Suspense fallback={null}>
        <LoginPageContent />
      </Suspense>
    </>
  )
}
