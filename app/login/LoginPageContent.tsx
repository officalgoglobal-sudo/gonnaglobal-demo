
"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"
import { GraduationCap, Users, Mail, Lock, EyeOff, Eye, ArrowRight, Building2 } from "lucide-react"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
const [rememberMe, setRememberMe] = useState(true)
  const [activeRole, setActiveRole] = useState("Student")

  const roleConfig = {
    Student: { subtitle: "Log in to discover global opportunities for your future.", emailLabel: "Student Email", emailPlaceholder: "student@university.edu", buttonLabel: "Log In as Student" },
    Mentor: { subtitle: "Log in to guide and inspire the next generation.", emailLabel: "Mentor Email", emailPlaceholder: "mentor@example.com", buttonLabel: "Log In as Mentor" },
    Institution: { subtitle: "Log in to manage your institution's global presence.", emailLabel: "Institutional Email", emailPlaceholder: "admin@institution.edu", buttonLabel: "Log In as Institution" },
  } as const

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !password) { setError("Please enter all details"); return }
    try {
      setError(""); setLoading(true)
      await setPersistence(
  auth,
  rememberMe ? browserLocalPersistence : browserSessionPersistence
)

const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await user.reload()
      if (!user.emailVerified) { router.push("/verify-email"); return }
      const userDoc = await getDoc(doc(db, "users", user.uid))
if (!userDoc.exists()) {
  await auth.signOut()
  setError("Account profile not found. Please contact support.")
  return
}
const userData = userDoc.data()

const expectedRole = {
  Student: "user",
  Mentor: "mentor",
  Institution: "institution",
}[activeRole]

const storedRole = userData.activeRole || userData.role

const roleMatches =
  storedRole === expectedRole ||
  (activeRole === "Institution" && storedRole === "recruiter")

if (!roleMatches) {
  await auth.signOut()
  setError(
    `This account is registered as ${storedRole === "user" ? "Student" : storedRole === "mentor" ? "Mentor" : storedRole === "institution" || storedRole === "recruiter" ? "Institution" : storedRole}. Please select the correct account type.`
  )
  return
}
 

      router.push(redirect)
    } catch { setError("Invalid email or password") }
    finally { setLoading(false) }
  }

 
const handleGoogleLogin = async () => {
  try {
    setError("")
    setLoading(true)

    await auth.signOut()

    await setPersistence(
  auth,
  rememberMe ? browserLocalPersistence : browserSessionPersistence
)

const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    await user.reload()
    if (!user.emailVerified) {
      router.replace("/verify-email")
      return
    }

      
const userDoc = await getDoc(doc(db, "users", user.uid))

if (!userDoc.exists()) {
  await auth.signOut()
  setError("No account found. Please sign up first.")
  return
}

const userData = userDoc.data()

const expectedRole = {
  Student: "user",
  Mentor: "mentor",
 Institution: "institution",
}[activeRole]


const storedRole = userData.activeRole || userData.role

const roleMatches =
  storedRole === expectedRole ||
  (activeRole === "Institution" && storedRole === "recruiter")

if (!roleMatches) {
  await auth.signOut()

  const registeredRole =
    storedRole === "user" ? "Student" :
    storedRole === "mentor" ? "Mentor" :
    storedRole === "institution" || storedRole === "recruiter" ? "Institution" :
    "an unknown role"

  setError(
    `This account is registered as ${registeredRole}. Please select the correct account type.`
  )
  return
}


router.push(redirect)

 } catch (error) {
  console.error("Google login failed:", error)
  await auth.signOut()
  setError("Unable to verify your account. Check your Firestore permissions and try again.")

} finally {
  setLoading(false)
}
}

const cfg = roleConfig[activeRole as keyof typeof roleConfig]

  return (
    <main className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900">

         {/* LEFT PANEL — fixed height, no scroll */}
     
<section
  className="hidden w-[41%] flex-shrink-0 h-screen overflow-hidden lg:block"
  

style={{
  backgroundImage: "url('/auth-bg.png')",
  backgroundSize: "105% 105%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#e8f4fc",
}}


/>


      {/* RIGHT PANEL */}
      <section className="flex h-screen w-full flex-col overflow-hidden p-5 sm:p-6 lg:w-1/2">
        {/* Top link */}
        <div className="flex justify-end text-[13px] text-gray-600">
          <span className="flex items-center">
            Don&apos;t have an account?
            <Link href="/signup" className="ml-1.5 flex items-center font-semibold text-[#0066FF] hover:underline">
              Sign Up <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
            </Link>
          </span>
        </div>

        {/* Center form */}
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-4">

          {/* Logo + title */}
          <div className="text-center">
            <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="mx-auto h-auto w-[120px] object-contain" />
            <p className="mt-2 text-[8px] font-bold tracking-[0.25em] text-gray-400">OPPORTUNITIES BEYOND BORDERS</p>
            <h2 className="mt-3 text-[24px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Welcome Back</h2>
            <p className="mt-1 text-[12px] text-gray-500">{cfg.subtitle}</p>
          </div>

          {/* Role tabs */}
          <div className="mt-5 flex rounded-[10px] border border-gray-200 p-1">
            {(["Student", "Mentor", "Institution"] as const).map((role) => {
              const icons = { Student: GraduationCap, Mentor: Users, Institution: Building2 }
              const Icon = icons[role]
              return (
                <button key={role} onClick={() => setActiveRole(role)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[8px] py-2 text-[12px] font-medium transition ${activeRole === role ? "bg-[#0066FF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}>
                  <Icon className="h-3.5 w-3.5" /> {role}
                </button>
              )
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-5 space-y-3">
            {/* Email */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-800">{cfg.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={cfg.emailPlaceholder}
                  className="w-full rounded-[8px] border border-gray-200 py-2.5 pl-9 pr-4 text-[12px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-800">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-[8px] border border-gray-200 py-2.5 pl-9 pr-9 text-[12px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
  type="checkbox"
checked={Boolean(rememberMe)}
  onChange={(e) => setRememberMe(e.target.checked)}
  className="h-3 w-3 rounded border-gray-300 accent-[#0066FF]"
/>
                <span className="text-[11px] font-medium text-gray-700">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[11px] font-medium text-[#0066FF] hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#0066FF] py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0055e6] active:scale-[0.99] disabled:opacity-70">
              {loading ? "Logging In..." : cfg.buttonLabel} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* OR divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">OR</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          {/* Google */}
          <button type="button" onClick={handleGoogleLogin} disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-gray-200 py-2.5 text-[12px] font-medium text-gray-700 transition hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.5 6.9l6.2 5.2C39.7 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer row */}
          <div className="mt-5 flex items-center justify-between pb-2 text-[11px] text-gray-500">
            <span>Don&apos;t have an account? <Link href="/signup" className="font-semibold text-[#0066FF] hover:underline">Sign Up</Link></span>
            <div className="flex gap-3 text-gray-400">
              <Link href="/terms" className="hover:text-gray-600">Terms</Link>
              <Link href="/privacy-policy" className="hover:text-gray-600">Privacy</Link>
              <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <>
      <h1 className="sr-only">Log in to Gonn&apos;a Global</h1>
      <Suspense fallback={null}>
        <LoginPageContent />
      </Suspense>
    </>
  )
}