"use client"

import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"

interface Certificate {
  id: string
  title: string
  description: string
  link: string
}

interface CertificatesSectionProps {
  certificates: Certificate[]

  setCertificates: (
    value: Certificate[]
  ) => void

  handleSaveProfile: (
    sectionName?: string
  ) => void
}

export default function CertificatesSection({
  certificates,
  setCertificates,
  handleSaveProfile,
}: CertificatesSectionProps) {

  const addCertificate = () => {

    setCertificates([
      ...certificates,
      {
        id: crypto.randomUUID(),

        title: "",

        description: "",

        link: "",
      },
    ])

  }

  const removeCertificate = (
    id: string
  ) => {

    setCertificates(
      certificates.filter(
        (item) => item.id !== id
      )
    )

  }

  const updateCertificate = (
    id: string,
    field: string,
    value: string
  ) => {

    setCertificates(

      certificates.map((item) =>

        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item

      )

    )

  }

  return (

    <div>

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B7355]">

            Certificates

          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2B1D16]">

            Showcase certifications.

          </h2>

        </div>

        <button
          onClick={addCertificate}
          className="rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
        >

          + Add Certificate

        </button>

      </div>

      {/* EMPTY */}

      {certificates.length === 0 && (

        <div className="mt-10 rounded-3xl border border-dashed border-[#E7DDD1] p-10 text-center">

          <p className="text-[#8B7355]">

            No certificates added yet.

          </p>

        </div>

      )}

      {/* CERTIFICATE CARDS */}

      <div className="mt-10 flex flex-col gap-8">

        {certificates.map((item) => (

          <div
            key={item.id}
            className="rounded-[32px] border border-[#E7DDD1] bg-[#FFFDF9] p-6"
          >

            {/* TOP */}

            <div className="flex items-center justify-between">

              <h3 className="text-xl font-semibold text-[#2B1D16]">

                Certificate Entry

              </h3>

              <button
                onClick={() =>
                  removeCertificate(item.id)
                }
                className="text-sm font-medium text-red-500"
              >

                Remove

              </button>

            </div>

            {/* TITLE */}

            <div className="mt-8">

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                Certificate Title

              </label>

              <Input
                value={item.title}
                onChange={(e) =>
                  updateCertificate(
                    item.id,
                    "title",
                    e.target.value
                  )
                }
              />

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                Description

              </label>

              <Textarea
                rows={5}
                value={item.description}
                onChange={(e) =>
                  updateCertificate(
                    item.id,
                    "description",
                    e.target.value
                  )
                }
              />

            </div>

            {/* LINK */}

            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium text-[#2B1D16]">

                Certificate Link

              </label>

              <Input
                placeholder="https://..."
                value={item.link}
                onChange={(e) =>
                  updateCertificate(
                    item.id,
                    "link",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        ))}

      </div>

      {/* SAVE */}

      <button
        onClick={() =>
          handleSaveProfile(
            "Certificates"
          )
        }
        className="mt-10 rounded-2xl bg-[#2563EB] px-8 py-4 font-medium text-white transition hover:bg-[#1D4ED8]"
      >

        Save Certificates

      </button>

    </div>

  )

}