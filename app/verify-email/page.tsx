"use client"

import Link from "next/link"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { Mail, ArrowRight } from "lucide-react"

import {
  sendEmailVerification,
} from "firebase/auth"

import { auth, db } from "@/lib/firebase"
import {
  doc,
  getDoc,
} from "firebase/firestore"

export default function VerifyEmailPage() {
    const router = useRouter()

const [email, setEmail] = useState("")

const [loading, setLoading] = useState(false)
useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
  
      if (user?.email) {
  
        setEmail(user.email)
  
      }
  
    })
  
    return () => unsubscribe()
  
  }, [])
  const handleVerificationCheck = async () => {

    if (!auth.currentUser) return
  
    setLoading(true)
  
    await auth.currentUser.reload()
  
    if (auth.currentUser.emailVerified) {

      const user = auth.currentUser
    
      if (!user) return
    
      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      )
    
      const userData = userDoc.data()
    
      if (userData?.role === "recruiter") {

        router.push("/")
      
      } else {
      
        router.push("/onboarding/interests")
      
      }
    
    } else {
    
      alert("Email not verified yet")
    
    }
  
    setLoading(false)
  
  }
  const resendVerification = async () => {

    if (!auth.currentUser) return
  
    try {
  
      await sendEmailVerification(auth.currentUser)
  
      alert("Verification email resent")
  
    } catch (error) {
  
      console.error(error)
  
      alert("Something went wrong")
  
    }
  
  }
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F5F0]">
        {/* LEFT BLACK STRIP */}

        <div className="hidden lg:block absolute left-0 top-0 h-full w-[84px] bg-[#2B1D16]" />
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}

        <section className="hidden flex-1 flex-col justify-center border-r border-[#E7DDD1] bg-[#FFFDF9] pl-40 pr-16 py-20 lg:flex">

  <div className="max-w-xl">

    <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
      GoGlobal
    </p>

    <h1 className="mt-8 text-6xl font-bold leading-[1.02] tracking-tight text-[#2B1D16]">

      Verify your
      <span className="text-[#D6B08C]">
        {" "}email.
      </span>

    </h1>

    <p className="mt-8 max-w-lg text-lg leading-8 text-[#6B5B52]">

      You're one step away from accessing internships,
      fellowships, scholarships and global opportunities
      curated for ambitious students.

    </p>

    {/* STATS */}

    <div className="mt-10 flex gap-4">

      <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] px-6 py-5">

        <p className="text-3xl font-bold text-[#2B1D16]">
          4K+
        </p>

        <p className="mt-1 text-sm text-[#8B7355]">
          Opportunities
        </p>

      </div>

      <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] px-6 py-5">

        <p className="text-3xl font-bold text-[#2B1D16]">
          80+
        </p>

        <p className="mt-1 text-sm text-[#8B7355]">
          Countries
        </p>

      </div>

    </div>

  </div>

</section>
        {/* RIGHT SIDE */}

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-10">

        <div className="w-full max-w-md rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm sm:p-10 sm:rounded-[32px]">

            {/* TOP BADGE */}

            <div className="inline-flex items-center rounded-full border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-2 text-sm text-[#8B7355]">

              Email Verification

            </div>

            {/* ICON */}

            <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2B1D16] sm:mt-10 sm:h-20 sm:w-20 sm:rounded-3xl">

              <Mail className="h-10 w-10 text-white" />

            </div>

            {/* CONTENT */}

            <h1 className="mt-7 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-[#2B1D16]">

              Check your inbox

            </h1>

            <p className="mt-5 text-[16px] leading-8 text-[#6B5B52]">

              We’ve sent a verification link to your email address.

              Please check your inbox and spam folder to verify your account before continuing.

            </p>

            {/* EMAIL */}

            <div className="mt-8 rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-6 py-5">

              <p className="text-sm text-[#8B7355]">
                Verification sent to
              </p>

              <p className="mt-1 break-all text-base font-semibold text-[#2B1D16] sm:text-lg">
              {email}
              </p>

            </div>

            {/* BUTTONS */}

            <div className="mt-8 space-y-4">

            <button
  onClick={handleVerificationCheck}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] py-4 text-base sm:py-5 sm:text-lg font-medium text-white transition hover:bg-[#1D4ED8]"
  >

    {loading ? "Checking..." : "I’ve verified my email"}

                <ArrowRight className="h-5 w-5" />

              </button>

              <button
  onClick={resendVerification}
  className="w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] py-4 text-base sm:py-5 sm:text-lg font-medium text-[#2B1D16] transition hover:bg-[#F8F5F0]"
  >

                Resend verification email

              </button>

            </div>

            {/* FOOTER */}

            <p className="mt-8 text-center text-sm text-[#8B7355]">

              Wrong email?{" "}

              <Link
                href="/signup"
                className="font-medium text-[#2563EB]"
              >
                Change email
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  )
}