"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ArrowLeft, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

// ── shared input class ──
const inputCls =
  "w-full rounded-[10px] border border-gray-200 py-3 pl-11 pr-10 text-[13px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] placeholder:text-gray-400"

// ── Logo ──
function Logo() {
  return (
    <div className="flex justify-center">
      <img src="/gonna-global-logo.png" alt="Gonn'a Global" className="h-auto w-[120px] object-contain" />
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 1 — Enter email
// ─────────────────────────────────────────────
function Step1({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async () => {
    if (!email) { setError("Please enter your email address."); return }
    try {
      setError(""); setLoading(true)
      await sendPasswordResetEmail(auth, email)
      onNext(email)
    } catch {
      setError("Could not find an account with that email address.")
    } finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-[400px]">
      <Link href="/login" className="mb-6 flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> Back to Login
      </Link>

      <Logo />

      <h1 className="mt-5 text-center text-[28px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        Forgot Password?
      </h1>
      <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">
        No worries! Enter your email address and we&apos;ll send you instructions to reset your password.
      </p>

      <div className="mt-7">
        <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
        {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6] disabled:opacity-70"
      >
        {loading ? "Sending..." : "Send Reset Link"} <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-center text-[12px] text-gray-500">
        <Link href="/login" className="font-semibold text-[#0066FF] hover:underline">Back to Login</Link>
      </p>

      {/* Decorative bottom — globe + tagline */}
      <div className="mt-10 flex items-end justify-between">
        <div className="text-[12px] font-light italic text-gray-400" style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", fontSize: "16px" }}>
          Same<br />Curiosity.<br />Bigger<br />Horizons.
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 2 — Check your email
// ─────────────────────────────────────────────
function Step2({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter()
  const [resendTimer, setResendTimer] = useState(60)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      setResending(true)
      await sendPasswordResetEmail(auth, email)
      setResendTimer(60)
    } catch { /* ignore */ }
    finally { setResending(false) }
  }

  return (
    <div className="w-full max-w-[400px]">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Logo />

      {/* Email icon with green tick */}
      <div className="relative mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        <Mail className="h-9 w-9 text-[#0066FF]" />
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
          <CheckCircle2 className="h-4 w-4 text-white" />
        </div>
      </div>

      <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        Check Your Email
      </h1>
      <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">
        We&apos;ve sent a password reset link to
      </p>
      <p className="text-center text-[14px] font-semibold text-gray-900">{email}</p>
      <p className="mt-2 text-center text-[12px] leading-relaxed text-gray-400">
        Please check your inbox (and spam folder) and click the link to reset your password.
      </p>

      {/* Resend info box */}
      <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-blue-100 bg-blue-50 p-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
        <div className="flex-1">
          <p className="text-[12px] text-gray-700 font-medium">Didn&apos;t receive the email?</p>
          <p className="text-[11px] text-gray-500">
            {resendTimer > 0 ? `You can try again in ${resendTimer} seconds.` : "You can resend now."}
          </p>
        </div>
        <button
          onClick={handleResend}
          disabled={resendTimer > 0 || resending}
          className={`shrink-0 text-[12px] font-semibold transition ${resendTimer > 0 ? "text-gray-400" : "text-[#0066FF] hover:underline"}`}
        >
          {resending ? "Sending..." : "Resend Email"}
        </button>
      </div>

      <button
        onClick={() => router.push("/login")}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6]"
      >
        Go to Login <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}


// ─────────────────────────────────────────────
// ROOT COMPONENT — orchestrates all steps
// ─────────────────────────────────────────────
export default function ForgotPasswordContent() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-4 py-12 font-sans sm:items-center sm:py-0">
      {step === 1 && (
        <Step1 onNext={e => { setEmail(e); setStep(2) }} />
      )}
      {step === 2 && (
        <Step2 email={email} onBack={() => setStep(1)} />
      )}
    </main>
  )
}
