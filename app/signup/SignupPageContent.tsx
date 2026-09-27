"use client"
import Image from "next/image"
import Link from "next/link"

import { Suspense, useState } from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth"

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"

import {
  auth,
  db,
  googleProvider,
} from "@/lib/firebase"

function SignupPageContent() {
  const router = useRouter()

  const searchParams = useSearchParams()

  const redirect =
    searchParams.get("redirect") || "/"

const [fullName, setFullName] = useState("")

const [email, setEmail] = useState("")

const [password, setPassword] = useState("")

const [country, setCountry] = useState("")

const [loading, setLoading] = useState(false)
const [error, setError] = useState("")
const [role, setRole] = useState("user")
const handleSignup = async () => {

  try {
    if (
      !fullName ||
      !email ||
      !password ||
      !country
    ) {
    
      setError("Please enter all details")
    
      return
    
    }
    setError("")
    setLoading(true)

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

    const user = userCredential.user

    await sendEmailVerification(user)

    await setDoc(doc(db, "users", user.uid), {

      uid: user.uid,
    
      fullName,
    
      email,
    
      country,
    
      role,
    
      roles:
        role === "recruiter"
          ? ["user", "recruiter"]
          : ["user"],
    
      activeRole: role,
    
      onboardingCompleted: false,
    
      createdAt: serverTimestamp(),
    
    })

    router.push(
      `/verify-email?redirect=${encodeURIComponent(redirect)}`
    )
  } catch (error) {

    console.error(error)

    if (
      error instanceof Error &&
      "code" in error
    ) {
    
      const firebaseError = error as { code: string }
    
      if (
        firebaseError.code ===
        "auth/email-already-in-use"
      ) {
    
        setError(
          "An account already exists with this email"
        )
    
      } else {
    
        setError("Something went wrong")
    
      }
    
    }

  } finally {

    setLoading(false)

  }

}
const handleGoogleSignup =
  async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        )

      const user =
        result.user
        const userRef = doc(
          db,
          "users",
          user.uid
        )
        
        const existingUser =
          await getDoc(userRef)

          if (!existingUser.exists()) {

            await setDoc(
              userRef,
        {
          uid: user.uid,

          fullName:
            user.displayName || "",

          email:
            user.email || "",

          country: "",

          role,

          roles:
            role === "recruiter"
              ? [
                  "user",
                  "recruiter",
                ]
              : ["user"],

          activeRole: role,

          onboardingCompleted:
            false,

          createdAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      )
    }

    if (!existingUser.exists()) {

      router.push(
        `/onboarding/interests?redirect=${encodeURIComponent(redirect)}`
      )
    
    } else {
    
      router.push(redirect)
    
    }

    } catch (error) {

      console.error(error)

      setError(
        "Unable to signup with Google"
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


<h2 className="mt-8 text-5xl font-bold leading-[1.02] tracking-tight text-[#2B1D16] xl:text-6xl">
  Build your future
  <span className="text-[#2563EB]">
    {" "}globally.
  </span>
</h2>

          <p className="mt-8 max-w-lg text-lg leading-8 text-[#6B5B52]">

            Join ambitious students discovering internships,
            fellowships, scholarships and opportunities worldwide.

          </p>

          {/* STATS */}

          <div className="mt-10 flex flex-wrap gap-4">

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

      <section className="flex flex-1 items-center justify-center bg-[#F8F5F0] px-5 py-10 sm:px-8 lg:px-6 lg:py-20">

        <div className="w-full max-w-lg rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm sm:p-8 lg:rounded-[32px] lg:p-12">

          {/* TOP */}

          

          <div>

{/* MOBILE LOGO */}

<div className="mb-6 flex justify-center lg:hidden">

  <Image
    src="/goglobal-logo.png"
    alt="GoGlobal"
    width={100}
    height={40}
    priority
  />

</div>

<h1 className="text-3xl font-bold tracking-tight text-[#2B1D16] sm:text-4xl">
  Create account
</h1>

<p className="mt-3 text-[#6B5B52]">
  Start discovering global opportunities today.
</p>

</div>

          {/* FORM */}
          <form className="mt-8 space-y-5 sm:mt-10">
            {/* ROLE SELECTION */}

<div>

<label className="mb-3 block text-sm font-medium text-[#2B1D16]">

  Will you be posting opportunities?

</label>

<div className="grid gap-3 sm:grid-cols-2">

  {/* USER */}

  <button
    type="button"
    onClick={() => setRole("user")}
    className={`rounded-2xl border px-4 py-3.5 sm:py-4 text-left transition ${
      role === "user"
        ? "border-[#2563EB] bg-[#2563EB] text-white"
        : "border-[#E7DDD1] bg-[#FFFDF9] text-[#2B1D16]"
    }`}
  >

    <p className="font-semibold">
      Explore
    </p>

    <p className="mt-1 text-sm opacity-80">
      Discover opportunities globally
    </p>

  </button>

  {/* RECRUITER */}

  <button
    type="button"
    onClick={() => setRole("recruiter")}
    className={`rounded-2xl border px-4 py-3.5 sm:py-4 text-left transition ${
      role === "recruiter"
        ? "border-[#2563EB] bg-[#2563EB] text-white"
        : "border-[#E7DDD1] bg-[#FFFDF9] text-[#2B1D16]"
    }`}
  >

    <p className="font-semibold">
      Recruiter
    </p>

    <p className="mt-1 text-sm opacity-80">
      Post opportunities and programs
    </p>

  </button>

</div>

</div>

  {/* NAME */}

  <div>

    <label className="mb-2 block text-sm font-medium text-[#2B1D16]">
      Full Name
    </label>

    <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
      placeholder="John Doe"
      className="w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3.5 sm:py-4 text-[#2B1D16] outline-none transition placeholder:text-[#8B7355] focus:border-[#2563EB]"
    />

  </div>

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
      placeholder="Create a password"
      className="w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3.5 sm:py-4 text-[#2B1D16] outline-none transition placeholder:text-[#8B7355] focus:border-[#2563EB]"
    />

  </div>

  {/* COUNTRY */}

  <div>

    <label className="mb-2 block text-sm font-medium text-[#2B1D16]">
      Home Country
    </label>

    <select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
      className="w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3.5 sm:py-4 text-[15px] font-medium text-[#2B1D16] outline-none transition focus:border-[#2563EB]"
    >

<option>Select your country</option>

<option>Afghanistan</option>
<option>Argentina</option>
<option>Australia</option>
<option>Austria</option>
<option>Bangladesh</option>
<option>Belgium</option>
<option>Brazil</option>
<option>Canada</option>
<option>China</option>
<option>Denmark</option>
<option>Egypt</option>
<option>Finland</option>
<option>France</option>
<option>Germany</option>
<option>Greece</option>
<option>Hong Kong</option>
<option>India</option>
<option>Indonesia</option>
<option>Ireland</option>
<option>Israel</option>
<option>Italy</option>
<option>Japan</option>
<option>Kenya</option>
<option>Malaysia</option>
<option>Mexico</option>
<option>Netherlands</option>
<option>New Zealand</option>
<option>Nigeria</option>
<option>Norway</option>
<option>Pakistan</option>
<option>Philippines</option>
<option>Poland</option>
<option>Portugal</option>
<option>Qatar</option>
<option>Russia</option>
<option>Saudi Arabia</option>
<option>Singapore</option>
<option>South Africa</option>
<option>South Korea</option>
<option>Spain</option>
<option>Sri Lanka</option>
<option>Sweden</option>
<option>Switzerland</option>
<option>Taiwan</option>
<option>Thailand</option>
<option>Turkey</option>
<option>Ukraine</option>
<option>United Arab Emirates</option>
<option>United Kingdom</option>
<option>United States</option>
<option>Vietnam</option>
    </select>

  </div>
  {error && (

<p className="text-sm font-medium text-red-500">

  {error}

</p>

)}

  {/* CREATE ACCOUNT */}

  <button
  type="button"
  onClick={handleSignup}
  className="block w-full rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] py-3.5 text-center font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-90 sm:py-4"
>

  {loading ? "Creating account..." : "Continue"}

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
<button
  type="button"
  onClick={handleGoogleSignup}
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

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-[#2563EB]"
            >
              Login
              </Link>

          </p>

        </div>

      </section>

    </main>
   )
  }
  
  export default function SignupPage() {
    return (
      <>
        <h1 className="sr-only">Create your GoGlobal account</h1>
  
        <Suspense fallback={null}>
          <SignupPageContent />
        </Suspense>
      </>
    )
  }