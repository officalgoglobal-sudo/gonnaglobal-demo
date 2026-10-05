
"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"
import { GraduationCap, Users, FileText, Globe, Mail, Lock, EyeOff, ArrowRight, Building2, Sparkles } from "lucide-react"

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
      {/* LEFT PANEL — scrolls with page */}
      <section 
        className="hidden w-1/2 flex-shrink-0 self-stretch overflow-hidden lg:block" 
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#e8f4fc",
          minHeight: "100vh",
        }}
      />

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

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-gray-200 py-3 text-[12px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.5 6.9l6.2 5.2C39.7 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-[12px] text-gray-600">
            Don't have an account? <Link href="/signup" className="font-semibold text-[#0066FF] hover:underline">Sign Up</Link>
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-center text-[11px] font-medium text-gray-400">
            <Link href="/terms" className="transition hover:text-gray-600">Terms</Link>
            <span>&bull;</span>
            <Link href="/privacy-policy" className="transition hover:text-gray-600">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/contact" className="transition hover:text-gray-600">Contact</Link>
          </div>
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
