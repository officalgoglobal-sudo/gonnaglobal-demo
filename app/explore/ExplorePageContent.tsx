"use client"
import { useEffect, useState } from "react"
import OpportunityCard from "@/components/opportunity/OpportunityCard"
import Sidebar from "@/components/home/Sidebar"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import {
  Search,
  Bell,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { onAuthStateChanged } from "firebase/auth"

import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import {
  isOpportunityExpired,
} from "@/lib/opportunityStatus"

export default function ExplorePage() {
  const router = useRouter()
  const [typeFromUrl, setTypeFromUrl] =
  useState("")

const [feedFromUrl, setFeedFromUrl] =
  useState("")



const [fullName, setFullName] = useState("")
const [userCountry, setUserCountry] =
  useState("")
const [opportunities, setOpportunities] =
  useState<any[]>([])

    const [search, setSearch] = useState("")

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
    const [selectedModes, setSelectedModes] = useState<string[]>([])
    const [selectedRegions, setSelectedRegions] =
  useState<string[]>([])

const [selectedFunding, setSelectedFunding] =
  useState<string[]>([])

const [selectedEcosystems, setSelectedEcosystems] =
  useState<string[]>([])
  const [selectedDeadlines, setSelectedDeadlines] =
  useState<string[]>([])
  const [sortBy, setSortBy] =
  useState("Most Recent")
  const [showMobileFilters, setShowMobileFilters] =
  useState(false)
    const filteredOpportunities = opportunities.filter((opportunity) => {

      const matchesSearch =
      opportunity.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
    
      opportunity.organization
        ?.toLowerCase()
        .includes(search.toLowerCase())
    
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(opportunity.type)
    
          const matchesMode =
          selectedModes.length === 0 ||
          selectedModes.includes(opportunity.mode)
        
        const matchesRegion =
          selectedRegions.length === 0 ||
          selectedRegions.includes(opportunity.location)
        
          const matchesFunding =
          selectedFunding.length === 0 ||
          selectedFunding.includes(
            opportunity.funding || ""
          )
        
          const matchesCareerDomain =
  selectedEcosystems.length === 0 ||
  selectedEcosystems.includes(
    opportunity.careerDomain || ""
  )

          const matchesDeadline =
  selectedDeadlines.length === 0 ||
  selectedDeadlines.includes(
    opportunity.deadlineType || ""
  )
  const matchesFeed =
  !feedFromUrl ||

  (
    feedFromUrl === "regional" &&
    opportunity.location === userCountry
  ) ||

  (
    feedFromUrl === "global" &&
    opportunity.location !== userCountry
  )
  return (
    matchesSearch &&
    matchesCategory &&
    matchesFeed &&
    matchesMode &&
    matchesRegion &&
    matchesFunding &&
    matchesDeadline &&
    matchesCareerDomain
  )
      })
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
      
            setFullName(userData?.fullName || "")
            setUserCountry(
              userData?.country || ""
            )
            const snapshot = await getDocs(
              collection(db, "opportunities")
            )
            
            const fetchedOpportunities =
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            
              const activeOpportunities =
              fetchedOpportunities.filter(
                (opportunity: any) =>
                  opportunity.status !== "archived" &&
                  !isOpportunityExpired(
                    opportunity.deadline
                  )
              )
            
            setOpportunities(activeOpportunities)
      
          })
      
        return () => unsubscribe()
      
      }, [router])
      useEffect(() => {

        if (typeFromUrl) {
      
          setSelectedCategories([
            typeFromUrl
          ])
      
        }
      
      }, [typeFromUrl])
      useEffect(() => {

        if (typeof window !== "undefined") {
      
          const params =
            new URLSearchParams(
              window.location.search
            )
      
          setTypeFromUrl(
            params.get("type") || ""
          )
      
          setFeedFromUrl(
            params.get("feed") || ""
          )
      
          setSearch(
            params.get("search") || ""
          )
      
        }
      
      }, [])
  return (
    <main className="min-h-screen bg-[#F8F5F0] pb-24 text-[#2B1D16] lg:ml-24 lg:pb-0">

<Sidebar />
<div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-8 sm:top-8 sm:gap-3">

  <button className="rounded-full border border-[#E7DDD1] bg-[#FFFDF9] p-3">
    <Search className="h-4 w-4 text-[#6B5B52]" />
  </button>

  <button className="rounded-full border border-[#E7DDD1] bg-[#FFFDF9] p-3">
    <Bell className="h-4 w-4 text-[#6B5B52]" />
  </button>

</div>

      {/* HEADER */}

      <section className="px-4 pt-20 pb-8 sm:px-8 lg:px-10 lg:py-14">

        <p className="text-sm text-[#8B7355]">
          Explore Opportunities
        </p>

        <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
        Welcome back, {fullName || "Explorer"}.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#6B5B52] sm:text-lg sm:leading-8">
        Discover opportunities curated for your goals,
        interests and global ambitions.
        </p>
      </section>

      {/* SEO CONTENT */}

<section className="px-4 pb-10 sm:px-8 lg:px-10">

<div className="rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-7 shadow-sm sm:p-9">

  <h2 className="text-2xl font-bold tracking-tight text-[#2B1D16]">
    Discover Global Opportunities
  </h2>

  <div className="mt-5 space-y-5 text-[15px] leading-7 text-[#6B5B52]">

    <p>
      Gonn'a Global helps students discover internships, scholarships,
      fellowships, research programs, conferences, hackathons,
      competitions, mentorships, startup programs and other
      opportunities from around the world. Instead of searching
      across dozens of websites and communities, students can
      explore opportunities in one organized platform.
    </p>

    <p>
      Use the search and filters to find opportunities based on
      category, location, work mode, funding, deadline and career
      domain. Whether you are looking for a remote internship,
      a fully funded scholarship, an international fellowship,
      a research program or a global conference, Gonn'a Global makes
      it easier to discover programs that match your interests
      and career goals.
    </p>

    <p>
      Explore opportunities across areas such as AI and technology,
      business and startups, research and science, leadership and
      policy, media and content, design and creativity, social
      impact, sports and fitness, finance and consulting, and
      environment and sustainability.
    </p>

    <p>
      Opportunities may be available nationally, internationally,
      remotely, onsite or through hybrid programs. Check each
      opportunity carefully for eligibility requirements, deadlines,
      funding information, location and application instructions
      before applying.
    </p>

  </div>

</div>

</section>

      {/* SEARCH */}

      <section className="px-5 pb-8 sm:px-8 lg:px-10 lg:pb-10">

      <input
  type="text"
  placeholder="Search opportunities..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
          className="h-14 w-full rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] placeholder:text-[#8B7355] px-5 text-[15px] shadow-sm outline-none transition focus:border-[#2563EB] focus:shadow-md sm:h-16 sm:rounded-3xl sm:px-6"
        />
        <div className="mt-4 flex xl:hidden">

<button
  onClick={() =>
    setShowMobileFilters(true)
  }
  className="flex items-center gap-2 rounded-2xl border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3 text-sm font-medium shadow-sm"
>

  <SlidersHorizontal className="h-4 w-4" />

  Filters

</button>

</div>

      </section>
      <section className="px-5 pb-6 sm:px-8 lg:px-10">

 

</section>
{/* MOBILE FILTER DRAWER */}

{showMobileFilters && (

<div className="fixed inset-0 z-50 bg-black/40 xl:hidden">

  <div className="absolute left-0 top-0 h-full w-[85%] max-w-[380px] overflow-y-auto bg-[#FFFDF9] p-6 shadow-2xl">

    {/* TOP */}

    <div className="flex items-center justify-between">

      <h2 className="text-xl font-semibold">
        Filters
      </h2>

      <button
        onClick={() =>
          setShowMobileFilters(false)
        }
        className="rounded-full border border-[#E7DDD1] p-2"
      >

        <X className="h-5 w-5" />

      </button>

    </div>

    {/* FILTER NOTE */}

    <p className="mt-4 text-sm text-[#8B7355]">

      Apply filters to refine opportunities.

    </p>

    {/* MOBILE FILTER CONTENT */}

    <div className="mt-8 space-y-8">
       {/* CATEGORY */}

       <div className="mt-8">

<p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">
  Category
</p>

<div className="space-y-2 text-sm">

{[
"Internships",
"Freelancing",
"Meet Ups",
"Conferences",
"Startup Programs",
"Hackathons",
"Sports",
"Mentorship",
"Fellowships",
"Scholarships",
"Cultural Events",
].map((category) => (

<label
key={category}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={selectedCategories.includes(category)}
onChange={() => {

if (
selectedCategories.includes(category)
) {

setSelectedCategories(
selectedCategories.filter(
  (item) => item !== category
)
)

} else {

setSelectedCategories([
...selectedCategories,
category,
])

}

}}
/>

{category}

</label>

))}

</div>

</div>
<div className="my-7 border-t border-[#E7DDD1]" />
{/* LOCATION */}

<div className="mt-8">

<p className="mb-3 text-sm font-medium text-[#8B7355]">
  Location Type
</p>

<div className="space-y-3 text-sm">

  <label className="flex items-center gap-2">
  <input
type="checkbox"
checked={selectedModes.includes("Remote")}
onChange={() => {

if (selectedModes.includes("Remote")) {
setSelectedModes(
selectedModes.filter((item) => item !== "Remote")
)
} else {
setSelectedModes([
...selectedModes,
"Remote",
])
}

}}
/>
    Remote
  </label>

  <label className="flex items-center gap-2">

<input
type="checkbox"
checked={selectedModes.includes("Onsite")}
onChange={() => {

if (selectedModes.includes("Onsite")) {

setSelectedModes(
selectedModes.filter(
(item) => item !== "Onsite"
)
)

} else {

setSelectedModes([
...selectedModes,
"Onsite",
])

}

}}
/>

Onsite

</label>

<label className="flex items-center gap-2">

<input
type="checkbox"
checked={selectedModes.includes("Hybrid")}
onChange={() => {

if (selectedModes.includes("Hybrid")) {

setSelectedModes(
selectedModes.filter(
(item) => item !== "Hybrid"
)
)

} else {

setSelectedModes([
...selectedModes,
"Hybrid",
])

}

}}
/>

Hybrid

</label>

</div>

</div>



<div className="my-7 border-t border-[#E7DDD1]" />

<div>

<p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">

Region

</p>

<div className="space-y-3 text-sm">

{[
"India",
"United States",
"United Kingdom",
"Canada",
"Australia",
"Germany",
"France",
"Singapore",
"Japan",
"South Korea",
"United Arab Emirates",
].map((region) => (

<label
key={region}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={selectedRegions.includes(region)}
onChange={() => {

if (selectedRegions.includes(region)) {

setSelectedRegions(
  selectedRegions.filter(
    (item) => item !== region
  )
)

} else {

setSelectedRegions([
  ...selectedRegions,
  region,
])

}

}}
/>

{region}

</label>

))}

</div>

</div>

<div className="my-7 border-t border-[#E7DDD1]" />

<div>

<p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">

Funding

</p>

<div className="space-y-3 text-sm">

{[
"Fully Funded",
"Paid",
"Free",
].map((funding) => (

<label
key={funding}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={selectedFunding.includes(funding)}
onChange={() => {

if (selectedFunding.includes(funding)) {

setSelectedFunding(
  selectedFunding.filter(
    (item) => item !== funding
  )
)

} else {

setSelectedFunding([
  ...selectedFunding,
  funding,
])

}

}}
/>

{funding}

</label>

))}

</div>

</div>
<div className="my-7 border-t border-[#E7DDD1]" />

<div>

<p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">
Deadline
</p>

<div className="space-y-3 text-sm">

{[
"Closing Soon",
"This Week",
"This Month",
"Open",
].map((deadline) => (

<label
key={deadline}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={selectedDeadlines.includes(deadline)}
onChange={() => {

if (
selectedDeadlines.includes(deadline)
) {

setSelectedDeadlines(
  selectedDeadlines.filter(
    (item) => item !== deadline
  )
)

} else {

setSelectedDeadlines([
  ...selectedDeadlines,
  deadline,
])

}

}}
/>

{deadline}

</label>

))}

</div>

</div>

<div className="my-7 border-t border-[#E7DDD1]" />

<div>

<p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">

Career Domains

</p>

<div className="space-y-3 text-sm">

{[
"AI & Technology",
"Business & Startups",
"Research & Science",
"Leadership & Policy",
"Media & Content",
"Design & Creativity",
"Social Impact",
"Sports & Fitness",
"Finance & Consulting",
"Environment & Sustainability",
].map((ecosystem) => (

<label
key={ecosystem}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={selectedEcosystems.includes(ecosystem)}
onChange={() => {

if (
selectedEcosystems.includes(ecosystem)
) {

setSelectedEcosystems(
  selectedEcosystems.filter(
    (item) =>
      item !== ecosystem
  )
)

} else {

setSelectedEcosystems([
  ...selectedEcosystems,
  ecosystem,
])

}

}}
/>

{ecosystem}

</label>

))}

</div>


</div>
<div className="mt-10">

<button
onClick={() => {

setSelectedCategories([])
setSelectedModes([])
setSelectedRegions([])
setSelectedFunding([])
setSelectedEcosystems([])
setSelectedDeadlines([])

}}
className="w-full rounded-2xl border border-[#E7DDD1] py-3 text-sm font-medium transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
>

Reset Filters

</button>
</div>
</div>
</div>

</div>



)}

      {/* MAIN LAYOUT */}

      <section className="px-4 pb-24 sm:px-8 lg:px-10">

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">
    
          {/* SIDEBAR */}

          <div className="hidden rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-5 shadow-sm sm:p-7 xl:block lg:sticky lg:top-28 lg:h-fit lg:rounded-[32px]">

          <h2 className="text-lg font-semibold text-[#2B1D16]">
  Filters
   </h2>

            {/* CATEGORY */}

            <div className="mt-8">

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">
                Category
              </p>

              <div className="space-y-2 text-sm">

  {[
    "Internships",
    "Freelancing",
    "Meet Ups",
    "Conferences",
    "Startup Programs",
    "Hackathons",
    "Sports",
    "Mentorship",
    "Fellowships",
    "Scholarships",
    "Cultural Events",
  ].map((category) => (

    <label
      key={category}
      className="flex items-center gap-2"
    >

      <input
        type="checkbox"
        checked={selectedCategories.includes(category)}
        onChange={() => {

          if (
            selectedCategories.includes(category)
          ) {

            setSelectedCategories(
              selectedCategories.filter(
                (item) => item !== category
              )
            )

          } else {

            setSelectedCategories([
              ...selectedCategories,
              category,
            ])

          }

        }}
      />

      {category}

    </label>

  ))}

</div>

            </div>
            <div className="my-7 border-t border-[#E7DDD1]" />
            {/* LOCATION */}

            <div className="mt-8">

              <p className="mb-3 text-sm font-medium text-[#8B7355]">
                Location Type
              </p>

              <div className="space-y-3 text-sm">

                <label className="flex items-center gap-2">
                <input
  type="checkbox"
  checked={selectedModes.includes("Remote")}
  onChange={() => {

    if (selectedModes.includes("Remote")) {
      setSelectedModes(
        selectedModes.filter((item) => item !== "Remote")
      )
    } else {
      setSelectedModes([
        ...selectedModes,
        "Remote",
      ])
    }

  }}
/>
                  Remote
                </label>

                <label className="flex items-center gap-2">

<input
  type="checkbox"
  checked={selectedModes.includes("Onsite")}
  onChange={() => {

    if (selectedModes.includes("Onsite")) {

      setSelectedModes(
        selectedModes.filter(
          (item) => item !== "Onsite"
        )
      )

    } else {

      setSelectedModes([
        ...selectedModes,
        "Onsite",
      ])

    }

  }}
/>

Onsite

</label>

<label className="flex items-center gap-2">

<input
  type="checkbox"
  checked={selectedModes.includes("Hybrid")}
  onChange={() => {

    if (selectedModes.includes("Hybrid")) {

      setSelectedModes(
        selectedModes.filter(
          (item) => item !== "Hybrid"
        )
      )

    } else {

      setSelectedModes([
        ...selectedModes,
        "Hybrid",
      ])

    }

  }}
/>

Hybrid

</label>

              </div>

            </div>

          
         
  <div className="my-7 border-t border-[#E7DDD1]" />

<div>

  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">

    Region

  </p>

  <div className="space-y-3 text-sm">

    {[
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "Japan",
  "South Korea",
  "United Arab Emirates",
  ].map((region) => (

      <label
        key={region}
        className="flex items-center gap-2"
      >

        <input
          type="checkbox"
          checked={selectedRegions.includes(region)}
          onChange={() => {

            if (selectedRegions.includes(region)) {

              setSelectedRegions(
                selectedRegions.filter(
                  (item) => item !== region
                )
              )

            } else {

              setSelectedRegions([
                ...selectedRegions,
                region,
              ])

            }

          }}
        />

        {region}

      </label>

    ))}

  </div>

</div>

<div className="my-7 border-t border-[#E7DDD1]" />

<div>

  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">

    Funding

  </p>

  <div className="space-y-3 text-sm">

    {[
      "Fully Funded",
      "Paid",
      "Free",
    ].map((funding) => (

      <label
        key={funding}
        className="flex items-center gap-2"
      >

        <input
          type="checkbox"
          checked={selectedFunding.includes(funding)}
          onChange={() => {

            if (selectedFunding.includes(funding)) {

              setSelectedFunding(
                selectedFunding.filter(
                  (item) => item !== funding
                )
              )

            } else {

              setSelectedFunding([
                ...selectedFunding,
                funding,
              ])

            }

          }}
        />

        {funding}

      </label>

    ))}

  </div>

</div>
<div className="my-7 border-t border-[#E7DDD1]" />

<div>

  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">
    Deadline
  </p>

  <div className="space-y-3 text-sm">

    {[
      "Closing Soon",
      "This Week",
      "This Month",
      "Open",
    ].map((deadline) => (

      <label
        key={deadline}
        className="flex items-center gap-2"
      >

        <input
          type="checkbox"
          checked={selectedDeadlines.includes(deadline)}
          onChange={() => {

            if (
              selectedDeadlines.includes(deadline)
            ) {

              setSelectedDeadlines(
                selectedDeadlines.filter(
                  (item) => item !== deadline
                )
              )

            } else {

              setSelectedDeadlines([
                ...selectedDeadlines,
                deadline,
              ])

            }

          }}
        />

        {deadline}

      </label>

    ))}

  </div>

</div>

<div className="my-7 border-t border-[#E7DDD1]" />

<div>

  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7355]">

  Career Domains

  </p>

  <div className="space-y-3 text-sm">

    {[
  "AI & Technology",
  "Business & Startups",
  "Research & Science",
  "Leadership & Policy",
  "Media & Content",
  "Design & Creativity",
  "Social Impact",
  "Sports & Fitness",
  "Finance & Consulting",
  "Environment & Sustainability",
  ].map((ecosystem) => (

      <label
        key={ecosystem}
        className="flex items-center gap-2"
      >

        <input
          type="checkbox"
          checked={selectedEcosystems.includes(ecosystem)}
          onChange={() => {

            if (
              selectedEcosystems.includes(ecosystem)
            ) {

              setSelectedEcosystems(
                selectedEcosystems.filter(
                  (item) =>
                    item !== ecosystem
                )
              )

            } else {

              setSelectedEcosystems([
                ...selectedEcosystems,
                ecosystem,
              ])

            }

          }}
        />

        {ecosystem}

      </label>

    ))}

  </div>


  </div>
<div className="mt-10">

  <button
    onClick={() => {

      setSelectedCategories([])
      setSelectedModes([])
      setSelectedRegions([])
      setSelectedFunding([])
      setSelectedEcosystems([])
      setSelectedDeadlines([])

    }}
    className="w-full rounded-2xl border border-[#E7DDD1] py-3 text-sm font-medium transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
  >

    Reset Filters

  </button>
  </div>
</div>

          {/* CARDS */}

          <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">

          {filteredOpportunities.length === 0 ? (

<div className="col-span-full rounded-[32px] border border-dashed border-[#D6B08C] bg-[#FFFDF9] p-12 text-center">

  <h3 className="text-2xl font-semibold text-[#2B1D16]">
    No opportunities found
  </h3>

  <p className="mt-3 text-[#8B7355]">
    Try changing your filters or search.
  </p>

</div>

) : (

filteredOpportunities.map((opportunity) => (
  <OpportunityCard
  id={opportunity.id}
  key={opportunity.id}
  organization={opportunity.organization}
  title={opportunity.title}
  description={opportunity.description}
  type={opportunity.type}
  location={opportunity.location}
  mode={opportunity.mode}
  deadline={opportunity.deadline}
  posterUrl={opportunity.posterUrl}
/>
            ))
          )}

          </div>

   </div>

      </section>

    </main>
  )
}
