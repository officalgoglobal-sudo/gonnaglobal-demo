"use client"
import {
    Compass,
    Bookmark,
    Clock3,
    Sparkles,
    ArrowRight,
  } from "lucide-react"
  import Sidebar from "@/components/home/Sidebar"
  import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { onAuthStateChanged } from "firebase/auth"

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
  
  export default function DashboardPage() {
    
    const router = useRouter()
    const handleLogout = async () => {

        await signOut(auth)
      
        router.push("/login")
      
      }
    const [fullName, setFullName] = useState("")
    const [savedOpportunities, setSavedOpportunities] =
  useState<any[]>([])
  const [applications, setApplications] =
  useState<any[]>([])
    useEffect(() => {

        const unsubscribe =
          onAuthStateChanged(auth, async (user) => {
      
            if (!user) {
      
              router.push("/login")
      
              return
      
            }
      
            const userDoc = await getDoc(
              doc(db, "users", user.uid)
            )
      
            const userData = userDoc.data()
            if (
              (
                userData?.activeRole ||
                userData?.role
              ) === "recruiter"
            ) {
            
              router.push("/recruit/dashboard")
            
              return
            
            }
      
            setFullName(userData?.fullName || "")
            const savedQuery = query(
              collection(db, "savedOpportunities"),
              where("userId", "==", user.uid)
            )
            
            const savedSnapshot =
              await getDocs(savedQuery)
            
            const savedItems = await Promise.all(
            
              savedSnapshot.docs.map(async (savedDoc) => {
            
                const savedData = savedDoc.data()
            
                const opportunityRef = doc(
                  db,
                  "opportunities",
                  savedData.opportunityId
                )
            
                const opportunitySnapshot =
                  await getDoc(opportunityRef)
            
                if (opportunitySnapshot.exists()) {
            
                  return {
                    id: opportunitySnapshot.id,
                    ...opportunitySnapshot.data(),
                  }
            
                }
            
                return null
            
              })
            
            )
            
            setSavedOpportunities(
              savedItems.filter(Boolean)
            )
            const applicationsQuery = query(
              collection(db, "applications"),
              where("userId", "==", user.uid)
            )
            
            const applicationsSnapshot =
              await getDocs(applicationsQuery)
            
            const fetchedApplications =
              await Promise.all(
            
                applicationsSnapshot.docs.map(
                  async (applicationDoc) => {
            
                    const applicationData =
                      applicationDoc.data()
            
                    const opportunityRef = doc(
                      db,
                      "opportunities",
                      applicationData.opportunityId
                    )
            
                    const opportunitySnapshot =
                      await getDoc(opportunityRef)
            
                    const opportunityData =
                      opportunitySnapshot.data()
            
                    return {
                      id: applicationDoc.id,
            
                      ...applicationData,
            
                      opportunityTitle:
                        opportunityData?.title || "Opportunity",
            
                      organization:
                        opportunityData?.organization || "Organization",
                    }
            
                  }
                )
            
              )
            
            setApplications(fetchedApplications)
      
          })
      
        return () => unsubscribe()
      
      }, [router])
      
    return (
        
        <>
  
        <Sidebar />
      
        <main className="min-h-screen bg-[#F8F5F0] pb-24 lg:ml-24 lg:pb-0">
  
        {/* TOP */}
  
        <section className="border-b border-[#E7DDD1] bg-[#FFFDF9] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
  
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
  
            <div>
  
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8B7355]">
                Dashboard
              </p>
  
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#2B1D16] sm:text-4xl lg:text-5xl">
  
                Welcome back,
                <span className="text-[#D6B08C]">
                  {" "}{fullName || "Explorer"}.
                </span>
  
              </h1>
  
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#6B5B52] sm:text-lg sm:leading-8">
  
                Discover curated global opportunities,
                track applications and explore programs
                tailored to your ambitions.
  
              </p>
  
            </div>
    
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

  <button
    onClick={handleLogout}
    className="rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] text-[#2B1D16] px-5 py-3 text-sm font-medium  transition hover:bg-[#EFE7DC]"
  >

    Logout

  </button>

  <button className="rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-4 font-medium text-white">

    Explore Opportunities

  </button>

</div>
  
          </div>
          
  
        </section>
  
        {/* CONTENT */}
  
        <section className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

<div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

  {/* LEFT */}

  <div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 sm:p-8 lg:rounded-[32px] lg:p-10">

    <p className="text-sm text-[#8B7355]">
      Personal Dashboard
    </p>

    <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#2B1D16] sm:text-3xl lg:text-4xl">

      Your global journey starts here.

    </h2>

    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B5B52]">

      Explore opportunities, save programs,
      track applications and build your
      international career journey.

    </p>

    <button
      onClick={() => router.push("/explore")}
      className="mt-10 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-4 font-medium text-white transition hover:opacity-90"
    >

      Explore Opportunities

    </button>

  </div>

  {/* RIGHT */}

  <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8">

  <p className="text-sm text-[#8B7355]">
    Saved Opportunities
  </p>

  {savedOpportunities.length === 0 ? (

    <>

      <h2 className="mt-4 text-2xl font-bold text-[#2B1D16]">

        Nothing saved yet.

      </h2>

      <p className="mt-4 leading-8 text-[#6B5B52]">

        Opportunities you save will appear here.

      </p>

    </>

  ) : (

    <div className="mt-6 space-y-4">

      {savedOpportunities.map((item) => (

        <div
          key={item.id}
          className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] p-5"
        >

          <p className="text-sm text-[#8B7355]">

            {item.organization}

          </p>

          <h3 className="mt-2 text-lg font-semibold text-[#2B1D16]">

            {item.title}

          </h3>

          <button
            onClick={() =>
              router.push(`/opportunity/${item.id}`)
            }
            className="mt-4 text-sm font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          >

            View Opportunity

          </button>

        </div>

      ))}

    </div>

  )}

</div>

</div>
<div className="mt-6 rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-8">

  <p className="text-sm text-[#8B7355]">
    Your Applications
  </p>

  {applications.length === 0 ? (

    <div className="mt-6">

      <h2 className="text-2xl font-bold text-[#2B1D16]">

        No applications yet.

      </h2>

      <p className="mt-4 leading-8 text-[#8B7355]">

        Opportunities you apply to will appear here.

      </p>

    </div>

  ) : (

    <div className="mt-8 space-y-4">

      {applications.map((item) => (

        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] p-5 sm:flex-row sm:items-center sm:justify-between"
        >

          <div>

            <p className="text-sm text-[#8B7355]">

              {item.organization}

            </p>

            <h3 className="mt-2 text-lg font-semibold text-[#2B1D16]">

              {item.opportunityTitle}

            </h3>

          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-medium text-white ${
              item.status === "Accepted"
                ? "bg-green-500"
                : item.status === "Rejected"
                ? "bg-red-500"
                : item.status === "Under Review"
                ? "bg-yellow-500"
                : "bg-[#2B1D16]"
            }`}
          >

            {item.status || "Applied"}

          </span>

        </div>

      ))}

    </div>

  )}

</div>

</section>
              
  
      </main>
      </>
    )
  }
