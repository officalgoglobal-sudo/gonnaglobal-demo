"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useParams,
  useRouter,
} from "next/navigation"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import {
  db,
} from "@/lib/firebase"

import Sidebar from "@/components/home/Sidebar"

export default function StudentProfilePage() {

  const params = useParams()

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [student, setStudent] =
    useState<any>(null)

  useEffect(() => {

    const fetchStudent = async () => {

      try {

        const studentRef = doc(
          db,
          "users",
          String(params.id)
        )

        const studentSnapshot =
          await getDoc(studentRef)

        if (!studentSnapshot.exists()) {

          router.push("/recruit/dashboard")

          return

        }

        setStudent(studentSnapshot.data())

        setLoading(false)

      } catch (error) {

        console.error(error)

      }

    }

    fetchStudent()

  }, [params.id, router])

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">

        <p className="text-[#8B7355]">
          Loading student profile...
        </p>

      </main>
    )

  }

  return (
    <>
      <Sidebar />

      <main className="ml-24 min-h-screen bg-[#F8F5F0] text-[#2B1D16]">

        <section className="border-b border-[#E7DDD1] bg-[#FFFDF9] px-10 py-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

<div className="max-w-4xl">

  <p className="text-sm uppercase tracking-[0.25em] text-[#8B7355]">
    Candidate Profile
  </p>

  <h1 className="mt-4 text-5xl font-bold tracking-tight">
    {student.fullName}
  </h1>

  

  <div className="mt-4 flex flex-wrap gap-3">

    {student.country && (
      <span className="rounded-full bg-[#F8F5F0] px-4 py-2 text-sm font-medium">
        {student.country}
      </span>
    )}

    {student.skills?.slice(0, 3).map(
      (skill: string, index: number) => (
        <span
          key={index}
          className="rounded-full bg-[#2563EB]/10 px-4 py-2 text-sm font-medium text-[#2563EB]"
        >
          {skill}
        </span>
      )
    )}

  </div>

  <p className="mt-6 max-w-4xl text-lg leading-8 text-[#6B5B52]">
    {student.bio || "No bio added yet."}
  </p>

</div>

</div>

        </section>

        <section className="px-10 py-10">

          <div className="grid gap-6 lg:grid-cols-2">

            <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40">

              <h2 className="text-2xl font-bold text-[#2B1D16]">

                Education

              </h2>
              <div className="mt-4 inline-flex rounded-full bg-[#F8F5F0] px-4 py-2 text-sm font-medium text-[#2B1D16]">
  Dropper: {student.isDropper ? "Yes" : "No"}
</div>

              <div className="mt-6 space-y-6">
            

  {student.education?.length ? (

    student.education.map(
      (edu: any, index: number) => (

        <div
          key={index}
          className="border-b border-[#E7DDD1] pb-5 last:border-0"
        >

          <h3 className="text-lg font-semibold">
            {edu.institution}
          </h3>

          <p className="mt-2 text-[#6B5B52]">
            Degree: {edu.degree}
          </p>

          <p className="text-[#6B5B52]">
            Stream: {edu.stream}
          </p>

          <p className="text-[#8B7355]">
            {edu.startYear} - {edu.endYear}
          </p>

          {edu.collegeEmail && (
            <p className="mt-2 text-sm text-[#2563EB]">
              {edu.collegeEmail}
            </p>
          )}

        </div>

      )
    )

  ) : (

    <p className="text-[#8B7355]">
      No education added
    </p>

  )}

</div>

</div>

<div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40">

  <h2 className="text-2xl font-bold text-[#2B1D16]">
    Experience
  </h2>

  <div className="mt-6 space-y-6">

    {student.experiences?.length ? (

      student.experiences.map(
        (exp: any, index: number) => (

          <div
            key={index}
            className="border-b border-[#E7DDD1] pb-5 last:border-0"
          >

            <h3 className="text-lg font-semibold">
              {exp.role}
            </h3>

            <p className="text-[#6B5B52]">
              {exp.company}
            </p>

            <p className="text-[#8B7355]">
              {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
            </p>

            {exp.description && (
              <p className="mt-3 break-words text-[#6B5B52]">
                {exp.description}
              </p>
            )}

          </div>

        )
      )

    ) : (

      <p className="text-[#8B7355]">
        No experience added
      </p>

    )}

  </div>

</div>
<div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40">

  <h2 className="text-2xl font-bold text-[#2B1D16]">
    Certificates
  </h2>

  <div className="mt-6 space-y-6">

    {student.certificates?.length ? (

      student.certificates.map(
        (cert: any, index: number) => (

          <div
            key={index}
            className="rounded-2xl bg-[#F8F5F0] p-4"
          >

            <h3 className="font-semibold">
              {cert.title}
            </h3>

            <p className="mt-2 text-[#6B5B52]">
              {cert.description}
            </p>

            {cert.link && (

              <a
              href={
                cert.link.startsWith("http")
                  ? cert.link
                  : `https://${cert.link}`
              }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-[#2563EB] underline"
              >

                View Certificate

              </a>

            )}

          </div>

        )
      )

    ) : (

      <p className="text-[#8B7355]">
        No certificates added
      </p>

    )}

  </div>



            </div>

            

            <div className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40">

              <h2 className="text-2xl font-bold text-[#2B1D16]">

                Links

              </h2>

              <div className="mt-4 flex flex-col gap-3">

              {student.linkedin && (

<a
  href={
    student.linkedin.startsWith("http")
      ? student.linkedin
      : `https://${student.linkedin}`
  }
  target="_blank"
  rel="noopener noreferrer"
  className="block rounded-xl border border-[#E7DDD1] px-4 py-3 text-[#2563EB] hover:bg-[#F8F5F0]"
>
  LinkedIn
</a>

)}

{student.portfolio && (

<a
  href={
    student.portfolio.startsWith("http")
      ? student.portfolio
      : `https://${student.portfolio}`
  }
  target="_blank"
  rel="noopener noreferrer"
  className="block rounded-xl border border-[#E7DDD1] px-4 py-3 text-[#2563EB] hover:bg-[#F8F5F0]"
>

  Portfolio

</a>

)}

{student.resume && (

<a
  href={
    student.resume.startsWith("http")
      ? student.resume
      : `https://${student.resume}`
  }
  target="_blank"
  rel="noopener noreferrer"
  className="block rounded-xl border border-[#E7DDD1] px-4 py-3 text-[#2563EB] hover:bg-[#F8F5F0]"
>
  Resume
</a>

)}

              </div>

            </div>
            <div className="mt-8 rounded-[32px] min-h-[180px] border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40">

<h2 className="text-2xl font-bold text-[#2B1D16]">
  Skills
</h2>

<div className="mt-6 flex flex-wrap gap-3">

  {student.skills?.length ? (

    student.skills.map(
      (skill: string, index: number) => (

        <span
          key={index}
          className="rounded-full border border-[#E7DDD1] bg-[#FFFDF9] px-5 py-3 text-sm font-medium text-[#2B1D16]"
        >

          {skill}

        </span>

      )
    )

  ) : (

    <p className="text-[#8B7355]">
      No skills added
    </p>

  )}

</div>

</div>
            <div className="mt-8 rounded-[32px] h-fit border border-[#E7DDD1] bg-[#FFFDF9] p-6 shadow-sm shadow-[#E7DDD1]/40">

              <h2 className="text-2xl font-bold text-[#2B1D16]">

                Contact

              </h2>

              <div className="mt-6 grid gap-4">

              <div className="rounded-xl bg-[#F8F5F0] p-4">
    <strong>Email:</strong> {student.email || "Not added"}
    </div>

  <div className="rounded-xl bg-[#F8F5F0] p-4">
    <strong>Alternate Email:</strong> {student.alternateEmail || "Not added"}
    </div>

  <div className="rounded-xl bg-[#F8F5F0] p-4">
    <strong>Phone:</strong> {student.phone || "Not added"}
    </div>

  <div className="rounded-xl bg-[#F8F5F0] p-4">
    <strong>WhatsApp:</strong> {student.whatsapp || "Not added"}
    </div>

  <div className="rounded-xl bg-[#F8F5F0] p-4">
    <strong>Country:</strong> {student.country || "Not added"}
    </div>
 
  

</div>

            </div>

       
</div>
        </section>

      </main>
    </>
  )

}