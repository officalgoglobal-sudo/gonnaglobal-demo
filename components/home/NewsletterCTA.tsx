"use client"

import { useState } from "react"

import {
  doc,
setDoc,
getDoc,
  serverTimestamp,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export default function NewsletterCTA() {
  const [email, setEmail] = useState<string>("")

const [loading, setLoading] = useState(false)

const [success, setSuccess] = useState(false)
const handleSubscribe = async () => {

  if (!email.trim()) return

  try {

    setLoading(true)

    const cleanEmail =
      email.trim().toLowerCase()

    const subscriberRef = doc(
      db,
      "newsletterSubscribers",
      cleanEmail
    )

    const existingSubscriber =
      await getDoc(subscriberRef)

    if (existingSubscriber.exists()) {

      alert("Email already subscribed.")

      return

    }

    await setDoc(subscriberRef, {
      email: cleanEmail,
      createdAt: serverTimestamp(),
    })

    setSuccess(true)

    setEmail("")

  } catch (error) {

    console.error(error)

  } finally {

    setLoading(false)

  }

}
    return (
      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
  
  <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#F8F5F0] to-[#EFE7DC] px-6 py-10 sm:px-8 sm:py-14 lg:rounded-[36px] lg:px-20 lg:py-16">
  
          {/* CONTENT */}
  
          <div className="max-w-4xl">
  
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8B7355]">
              Stay Updated
            </p>
  
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#2B1D16] sm:text-4xl xl:text-5xl">
  
              Never miss a global
              <span className="block text-[#2563EB]">
                opportunity again.
              </span>
  
            </h2>
  
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#6B5B52] sm:mt-6 sm:text-lg sm:leading-8">
  
              Get curated internships, fellowships, scholarships,
              conferences and opportunities delivered directly to your inbox.
  
            </p>
  
          </div>
  
          {/* FORM */}
  
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 md:flex-row">
  
          <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  className="h-13 flex-1 rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[#2563EB]/20 sm:h-14"
/>
  
<button
  onClick={handleSubscribe}
  disabled={loading}
  className="h-13 rounded-2xl bg-[#2563EB] px-8 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#2563EB] disabled:opacity-50 sm:h-14 sm:px-10"
>

  {loading ? "Saving..." : "Subscribe"}

</button>
  
          </div>
          {success && (

<p className="mt-4 text-sm font-medium text-[#8B7355]">

  Successfully subscribed.

</p>

)}
  
        </div>
  
      </section>
    )
  }
  