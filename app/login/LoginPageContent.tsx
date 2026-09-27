
"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense, useState } from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import {
  auth,
  db,
  googleProvider,
} from "@/lib/firebase"
function LoginPageContent() {
  const router = useRouter()

  const searchParams = useSearchParams()

  const redirect =
    searchParams.get("redirect") || "/"

const [email, setEmail] = useState("")

const [password, setPassword] = useState("")

const [loading, setLoading] = useState(false)

const [error, setError] = useState("")
const handleLogin = async () => {

  try {

    if (!email || !password) {

      setError("Please enter all details")

      return

    }

    setError("")

    setLoading(true)

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

    const user = userCredential.user

    await user.reload()

    if (!user.emailVerified) {

      router.push("/verify-email")

      return

    }

    const userDoc = await getDoc(
      doc(db, "users", user.uid)
    )

    const userData = userDoc.data()

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

    await sendPasswordResetEmail(
      auth,
      email
    )

    setError("Password reset email sent")

  } catch (error) {

    console.error(error)

    setError("Unable to send reset email")

  }

}
const handleGoogleLogin =
  async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        )

      const user =
        result.user

      const userDoc =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        )

      if (!userDoc.exists()) {

        setError(
          "No account found. Please sign up first."
        )

        return

      }

      router.push(redirect)

    } catch (error) {

      console.error(error)

      setError(
        "Unable to login with Google"
      )

    }

  }
    return (
      <main className="flex min-h-screen bg-[#F8F5F0] lg:ml-24">

  {/* LEFT SIDE */}

  <section className="hidden flex-1 flex-col justify-center border-r border-[#E7DDD1] bg-[#FFFDF9] px-12 py-20 xl:px-16 lg:flex">

    <div className="max-w-xl">

     <div>
     
     <Image
       src="/goglobal-logo.png"
       alt="GoGlobal"
       width={100}
       height={20}
       priority
     />
     
     <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355]">
       Global Opportunities Platform
     </p>
     
     </div>
     

     <h1 className="mt-8 text-5xl font-bold leading-[1.02] tracking-tight text-[#2B1D16] xl:text-6xl">
  Log in to GoGlobal and discover
  <span className="text-[#2563EB]">
    {" "}global opportunities.
  </span>
</h1>
      <p className="mt-8 max-w-lg text-lg leading-8 text-[#6B5B52]">

        Access internships, fellowships, scholarships,
        conferences and global programs curated for ambitious students.

      </p>

      {/* STATS */}

      <div className="mt-10 flex flex-wrap gap-4">

        <div className="rounded-3xl border border-[#E7DDD1] bg-[#F8F5F0] px-6 py-5">

          <p className="text-3xl font-bold text-[#2B1D16]">
            1000+
          </p>

          <p className="mt-1 text-sm text-[#8B7355]">
            Global Opportunities
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

  <section className="flex flex-1 items-center justify-center bg-[#F8F5F0] px-5 py-10 sm:px-8 lg:px-6 lg:py-20">

    <div className="w-full max-w-lg rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-lg shadow-[#E7DDD1]/40">

      {/* TOP */}

      

      <div>
        <div className="mb-6 flex justify-center lg:hidden">
        
          <Image
            src="/goglobal-logo.png"
            alt="GoGlobal"
            width={100}
            height={40}
            priority
          />
        
        </div>
        

        <h2 className="text-3xl font-bold tracking-tight text-[#2B1D16] sm:text-4xl">
          Welcome back
        </h2>

        <p className="mt-3 text-[#6B5B52]">
          Login to continue exploring global opportunities.
        </p>

      </div>

      {/* FORM */}

      <form className="mt-8 space-y-5 sm:mt-10">

        {/* EMAIL */}

        <div>

          <label className="mb-2 block text-sm font-medium text-[#2B1D16]">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3.5 sm:py-4 text-[#2B1D16] outline-none transition placeholder:text-[#8B7355] focus:border-[#2563EB]"
          />

        </div>

        {/* PASSWORD */}

        <div>

          <label className="mb-2 block text-sm font-medium text-[#2B1D16]">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3.5 sm:py-4 text-[#2B1D16] outline-none transition placeholder:text-[#8B7355] focus:border-[#2563EB]"
          />

        </div>

        {/* FORGOT */}

        <div className="flex justify-end">

        <button
  type="button"
  onClick={handleForgotPassword}
  className="text-sm text-[#8B7355] transition hover:text-[#2563EB]"
  >
            Forgot password?
          </button>

        </div>

        {error && (

<p className="text-sm font-medium text-[#8B7355]">

  {error}

</p>

  )}

        {/* LOGIN BUTTON */}

        <button
  type="button"
  onClick={handleLogin}
  className="block w-full rounded-2xl bg-[#2563EB] py-3.5 text-center font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-[#1D4ED8] sm:py-4"
>
{loading ? "Logging in..." : "Login"}
</button>

      </form>

      {/* DIVIDER */}

      <div className="my-6 flex items-center gap-4">

        <div className="h-px flex-1 bg-[#E7DDD1]" />

        <span className="text-sm text-[#8B7355]">
          OR
        </span>

        <div className="h-px flex-1 bg-[#E7DDD1]" />

      </div>

      {/* GOOGLE */}

      <button
  type="button"
  onClick={handleGoogleLogin}
  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] py-3.5 text-[15px] font-medium text-[#2B1D16] transition hover:bg-[#F8F5F0] sm:py-4"
>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
  className="h-5 w-5"
>
  <path
    fill="#FFC107"
    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
  />
  <path
    fill="#FF3D00"
    d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
  />
  <path
    fill="#4CAF50"
    d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
  />
  <path
    fill="#1976D2"
    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.5 6.9l6.2 5.2C39.7 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"
  />
</svg>

Continue with Google

</button>

      {/* FOOTER */}

      <p className="mt-8 text-center text-sm text-[#6B5B52]">

        Don’t have an account?{" "}

        <Link
          href="/signup"
          className="font-semibold text-[#2563EB]"
        >
          Sign up
        </Link>

      </p>

    </div>

  </section>

   </main>
    )
  }
  
  export default function LoginPage() {
    return (
      <>
        <h1 className="sr-only">Log in to GoGlobal</h1>
  
        <Suspense fallback={null}>
          <LoginPageContent />
        </Suspense>
      </>
    )
  }