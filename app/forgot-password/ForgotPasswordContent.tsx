"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ArrowLeft, Mail, Lock, EyeOff, Eye, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

// ── shared input class ──
const inputCls =
  "w-full rounded-[10px] border border-gray-200 py-3 pl-11 pr-10 text-[13px] text-gray-900 outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] placeholder:text-gray-400"

// ── Logo ──
function Logo() {
  return (
    <div className="flex justify-center">
      <Image src="/gonna-global-logo.png" alt="Gonn'a Global" width={150} height={75} className="h-auto w-[120px] object-contain [mix-blend-mode:multiply]" priority />
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
function Step2({ email, onNext, onBack }: { email: string; onNext: () => void; onBack: () => void }) {
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

      {/* For demo — move to next step */}
      <button
        onClick={onNext}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6]"
      >
        I&apos;ve Received the Code <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 3 — Enter verification code (OTP)
// ─────────────────────────────────────────────
function Step3({ email, onNext, onBack }: { email: string; onNext: (code: string) => void; onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [resendTimer, setResendTimer] = useState(60)

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    setOtp([...data.padEnd(6, "").split("").slice(0, 6)])
    refs.current[Math.min(data.length, 5)]?.focus()
  }

  const code = otp.join("")

  return (
    <div className="w-full max-w-[400px]">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Logo />

      <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        Enter Verification Code
      </h1>
      <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">
        We&apos;ve sent a 6-digit code to
      </p>
      <p className="text-center text-[13px] font-semibold text-gray-900">{email}</p>

      {/* OTP inputs */}
      <div className="mt-8 flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => { refs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            className={`h-12 w-12 rounded-[10px] border-2 text-center text-[18px] font-bold outline-none transition ${
              digit ? "border-[#0066FF] bg-blue-50 text-[#0066FF]" : "border-gray-200 text-gray-900 focus:border-[#0066FF]"
            }`}
          />
        ))}
      </div>

      <p className="mt-5 text-center text-[12px] text-gray-500">
        Didn&apos;t receive the code?{" "}
        <button
          disabled={resendTimer > 0}
          className={`font-semibold ${resendTimer > 0 ? "text-gray-400" : "text-[#0066FF] hover:underline"}`}
        >
          Resend Code {resendTimer > 0 ? `(${resendTimer}s)` : ""}
        </button>
      </p>

      <button
        onClick={() => code.length === 6 && onNext(code)}
        disabled={code.length < 6}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6] disabled:opacity-50"
      >
        Verify Code <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 4 — Create new password
// ─────────────────────────────────────────────
function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [error, setError] = useState("")

  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    letter: /[a-zA-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
  const allPass = Object.values(checks).every(Boolean)

  const handleReset = () => {
    if (!allPass) { setError("Please meet all password requirements."); return }
    if (password !== confirm) { setError("Passwords do not match."); return }
    onNext()
  }

  const Check = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-[12px] ${ok ? "text-green-600" : "text-gray-400"}`}>
      <CheckCircle2 className={`h-4 w-4 shrink-0 ${ok ? "text-green-500" : "text-gray-300"}`} />
      {label}
    </div>
  )

  return (
    <div className="w-full max-w-[400px]">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Logo />

      <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        Create New Password
      </h1>
      <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">
        Your new password must be different from your previous password.
      </p>

      <div className="mt-7 space-y-4">
        {/* New password */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-800">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              className={inputCls}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          {/* Strength checks */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <Check ok={checks.length} label="At least 8 characters" />
            <Check ok={checks.number} label="Includes a number" />
            <Check ok={checks.letter} label="Includes a letter" />
            <Check ok={checks.special} label="Includes a special character (e.g. !@#)" />
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-800">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showCf ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className={inputCls}
            />
            <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showCf ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-[12px] text-red-500">{error}</p>}

        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0066FF] py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6]"
        >
          Reset Password <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 5 — Success (split screen with bg image)
// ─────────────────────────────────────────────
function Step5() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left — success content */}
      <div className="flex w-full flex-col items-start justify-center px-12 py-16 lg:w-1/2 xl:px-20">
        <Logo />

        {/* Green success circle */}
        <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="mt-6 text-[32px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Password Reset Successful!
        </h1>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-gray-500">
          Your password has been updated successfully. You can now log in to your account.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="mt-8 flex items-center gap-2 rounded-[10px] bg-[#0066FF] px-8 py-3 text-[14px] font-medium text-white transition hover:bg-[#0055e6]"
        >
          Go to Login <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Right — background photo panel */}
      <div
        className="relative hidden overflow-hidden rounded-l-[40px] lg:block lg:w-1/2"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Handwritten note top-right */}
        <div
          className="absolute right-10 top-10 text-right text-white"
          style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", fontSize: "24px", lineHeight: 1.3 }}
        >
          A global<br />you tomorrow.
        </div>

        {/* GG watermark center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-[64px] font-black text-white/20"
            style={{ fontFamily: "Georgia, serif" }}
          >
            GG
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
            LEARN · APPLY · CONNECT · GONN'A GLOBAL
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ROOT COMPONENT — orchestrates all steps
// ─────────────────────────────────────────────
export default function ForgotPasswordContent() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  // Full-screen on step 5
  if (step === 5) return <Step5 />

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-4 py-12 font-sans sm:items-center sm:py-0">
      {step === 1 && (
        <Step1 onNext={e => { setEmail(e); setStep(2) }} />
      )}
      {step === 2 && (
        <Step2 email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <Step3 email={email} onNext={c => { setCode(c); setStep(4) }} onBack={() => setStep(2)} />
      )}
      {step === 4 && (
        <Step4 onNext={() => setStep(5)} onBack={() => setStep(3)} />
      )}
    </main>
  )
}
