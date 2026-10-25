"use client"

import { useCallback, useEffect, useState } from "react"
import {
  addDoc, collection, deleteDoc, doc, getDocs, query,
  serverTimestamp, updateDoc, where
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

type Opportunity = {
  id: string
  title?: string
  organization?: string
  description?: string
  eligibility?: string
  responsibilities?: string
  location?: string
  type?: string
  mode?: string
  deadline?: string
  funding?: string
  careerDomain?: string
  deadlineType?: string
  benefits?: string
  applicationLink?: string
  locationRegion?: string
  experienceLevel?: string
  status?: string
  createdBy?: string
  [key: string]: any
}

const blankForm = {
  title: "",
  description: "",
  eligibility: "",
  responsibilities: "",
  location: "",
  type: "",
  mode: "",
  deadline: "",
  funding: "",
  careerDomain: "",
  deadlineType: "Fixed Deadline",
  benefits: "",
  applicationLink: "",
  locationRegion: "Anywhere",
  experienceLevel: "All Levels",
}

function isExpired(deadline?: string) {
  if (!deadline) return false
  const parsed = new Date(`${deadline.slice(0, 10)}T23:59:59`)
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < Date.now()
}

export default function InstitutionOpportunitiesManager({
  user,
  institutionName,
  profileCompletion,
}: {
  user: any
  institutionName?: string
  profileCompletion?: number
}) {
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [view, setView] = useState<"active" | "archived">("active")
  const [showForm, setShowForm] = useState(false)
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blankForm)
  const [poster, setPoster] = useState<File | null>(null)
  const [posterUrl, setPosterUrl] = useState("")

  const [selectedModes, setSelectedModes] = useState<string[]>(["Any mode"])
  const [selectedEligibility, setSelectedEligibility] = useState<string[]>(["Open to All"])
  const [selectedFunding, setSelectedFunding] = useState<string[]>([])


  const uid = user?.uid || auth.currentUser?.uid

  const loadItems = useCallback(async () => {
    if (!uid) {
      setError("Please sign in again to manage opportunities.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    try {
      const snapshot = await getDocs(
        query(collection(db, "opportunities"), where("createdBy", "==", uid))
      )

      const fetched = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Opportunity[]

      fetched.sort((a, b) => {
        const da = String(a.deadline || "")
        const dbb = String(b.deadline || "")
        return da.localeCompare(dbb)
      })

      setItems(fetched)

      // Keep stored archive status in sync with the deadline.
      await Promise.all(fetched.map(async item => {
        const expired = isExpired(item.deadline)
        const nextStatus = expired ? "archived" : "active"
        if (item.status !== nextStatus) {
          await updateDoc(doc(db, "opportunities", item.id), {
            status: nextStatus,
            archivedAt: expired ? new Date() : null,
          })
        }
      }))

      setItems(fetched.map(item => ({
        ...item,
        status: isExpired(item.deadline) ? "archived" : "active",
      })))
    } catch (e) {
      console.error("Could not load institution opportunities:", e)
      setError("Could not load opportunities. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  function startNew() {
    if ((profileCompletion ?? 0) < 75) {
      setShowCompletionPopup(true)
      return
    }
    setEditingId(null)
    setForm(blankForm)
    setPoster(null)
    setPosterUrl("")
    setSelectedModes(["Any mode"])
    setSelectedEligibility(["Open to All"])
    setSelectedFunding([])
    setError("")
    setMessage("")
    setShowForm(true)
  }

  function startEdit(item: Opportunity) {
    setEditingId(item.id)
    setPoster(null)
    setPosterUrl(item.posterUrl || "")
    setSelectedModes(String(item.mode || "Any mode").split(", ").filter(Boolean))
    setSelectedEligibility(String(item.eligibility || "Open to All").split(", ").filter(Boolean))
    setSelectedFunding(String(item.funding || "").split(", ").filter(Boolean))
    setForm({
      title: item.title || "",
      description: item.description || "",
      eligibility: item.eligibility || "",
      responsibilities: item.responsibilities || "",
      location: item.location || "",
      type: item.type || "",
      mode: item.mode || "",
      deadline: item.deadline || "",
      funding: item.funding || "",
      careerDomain: item.careerDomain || "",
      deadlineType: item.deadlineType || "Fixed Deadline",
      benefits: item.benefits || "",
      applicationLink: item.applicationLink || "",
      locationRegion: item.locationRegion || "Anywhere",
      experienceLevel: item.experienceLevel || "All Levels",
    })
    setError("")
    setMessage("")
    setShowForm(true)
  }

  async function submitOpportunity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!uid) {
      setError("Please sign in again before saving.")
      return
    }

    // Existing opportunities can still be edited; new posts require 75%.
    if (!editingId && (profileCompletion ?? 0) < 75) {
      setError(`Complete at least 75% of your institution profile before posting an opportunity. Current completion: ${profileCompletion ?? 0}%.`)
      return
    }
    if (!form.title.trim() || !form.description.trim() ||
        !form.type.trim() || !form.deadline.trim()) {
      setError("Please complete the title, description, type, and deadline.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      let finalPosterUrl = posterUrl

      if (poster) {
        const formData = new FormData()
        formData.append("file", poster)
        formData.append("upload_preset", "goglobal-opportunities")

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dch6dxstp/image/upload",
          { method: "POST", body: formData }
        )

        if (!response.ok) {
          throw new Error("Poster upload failed. Please try another image.")
        }

        const data = await response.json()
        if (!data.secure_url) {
          throw new Error("Cloudinary did not return a poster URL.")
        }
        finalPosterUrl = data.secure_url
      }

      const expired = isExpired(form.deadline)
      const organization = institutionName || user?.institutionName ||
        user?.name || user?.displayName || "Institution"

      if (editingId) {
        // Only update an opportunity that belongs to this account.
        const existing = items.find(item => item.id === editingId)
        if (!existing || existing.createdBy !== uid) {
          throw new Error("You can only edit your own opportunities.")
        }

        await updateDoc(doc(db, "opportunities", editingId), {
          ...form,
          mode: selectedModes.includes("Any mode") ? "Any mode" : selectedModes.join(", "),
          eligibility: selectedEligibility.includes("Open to All") ? "Open to All" : selectedEligibility.join(", "),
          funding: selectedFunding.join(", "),
          title: form.title.trim(),
          organization,
          posterUrl: finalPosterUrl,
          status: expired ? "archived" : "active",
          archivedAt: expired ? new Date() : null,
        })
        setMessage("Opportunity updated.")
      } else {
        await addDoc(collection(db, "opportunities"), {
          ...form,
          mode: selectedModes.includes("Any mode") ? "Any mode" : selectedModes.join(", "),
          eligibility: selectedEligibility.includes("Open to All") ? "Open to All" : selectedEligibility.join(", "),
          funding: selectedFunding.join(", "),
          title: form.title.trim(),
          organization,
                    posterUrl: finalPosterUrl,
createdBy: uid,
          status: expired ? "archived" : "active",
          archivedAt: expired ? new Date() : null,
          createdAt: serverTimestamp(),
        })
        setMessage("Opportunity posted successfully.")
      }

      setShowForm(false)
      setEditingId(null)
      setForm(blankForm)
      await loadItems()
    } catch (e) {
      console.error("Could not save opportunity:", e)
      setError(e instanceof Error ? e.message : "Could not save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function removeOpportunity(item: Opportunity) {
    if (!uid || item.createdBy !== uid) {
      setError("You can only delete your own opportunities.")
      return
    }
    if (!window.confirm(`Delete "${item.title || "this opportunity"}"? This cannot be undone.`)) return

    setError("")
    try {
      await deleteDoc(doc(db, "opportunities", item.id))
      setItems(current => current.filter(row => row.id !== item.id))
      setMessage("Opportunity deleted.")
    } catch (e) {
      console.error("Could not delete opportunity:", e)
      setError("Could not delete this opportunity. Please try again.")
    }
  }

  const activeItems = items.filter(item => !isExpired(item.deadline))
  const archivedItems = items.filter(item => isExpired(item.deadline))
  const displayed = view === "active" ? activeItems : archivedItems

  const fields: { key: keyof typeof blankForm; label: string; required?: boolean; multiline?: boolean; type?: string }[] = [
    { key: "title", label: "Opportunity title", required: true },
    { key: "type", label: "Opportunity type", required: true },
    { key: "description", label: "Description", required: true, multiline: true },
    { key: "eligibility", label: "Eligibility", multiline: true },
    { key: "responsibilities", label: "Responsibilities", multiline: true },
    { key: "location", label: "Location" },
        { key: "deadline", label: "Application deadline", required: true, type: "date" },
            { key: "careerDomain", label: "Career domain" },
    { key: "benefits", label: "Benefits", multiline: true },
    { key: "applicationLink", label: "Application URL (add only if external form)", type: "url" },
          ]

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E5EAF2] bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Manage Opportunities</h2>
          <p className="mt-1 text-sm text-[#687995]">Publish and manage opportunities posted by your institution.</p>
        </div>
        <button type="button" onClick={startNew}
          className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white ${ (profileCompletion ?? 0) < 75 ? "cursor-not-allowed bg-gray-400 hover:bg-gray-500" : "bg-[#2563EB] hover:bg-[#1D4ED8]" }`}>
          + Post an Opportunity
        </button>
      </section>

      {message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {showForm && (
        <section className="rounded-2xl border border-[#E5EAF2] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-[#1A1A2E]">{editingId ? "Edit Opportunity" : "Post an Opportunity"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-[#687995] hover:text-[#1A1A2E]">Cancel</button>
          </div>
          <form onSubmit={submitOpportunity} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map(field => (
              <label key={field.key} className={`block text-sm font-medium text-[#344054] ${field.multiline ? "md:col-span-2" : ""}`}>
                {field.label}{field.required ? " *" : ""}
                {field.multiline ? (
                  <textarea required={field.required} value={form[field.key]} rows={4}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                ) : (
                  <input required={field.required} type={field.type || "text"} value={form[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                )}
              </label>
            ))}


            <div className="rounded-xl border border-[#E5EAF2] p-4 md:col-span-2">
              <label className="block text-sm font-medium text-[#344054]">
                Opportunity poster
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setPoster(e.target.files?.[0] || null)}
                  className="mt-2 block w-full text-sm text-[#475467] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EEF3FF] file:px-4 file:py-2 file:font-semibold file:text-[#2563EB]"
                />
              </label>
              {poster && (
                <p className="mt-2 text-xs text-[#687995]">Selected: {poster.name}</p>
              )}
              {!poster && posterUrl && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-[#687995]">Current poster</p>
                  <img src={posterUrl} alt="Current opportunity poster" className="max-h-48 rounded-lg border border-[#E5EAF2] object-contain" />
                  <button type="button" onClick={() => setPosterUrl("")} className="mt-2 text-xs font-semibold text-red-600">Remove current poster</button>
                </div>
              )}
              <p className="mt-2 text-xs text-[#687995]">Upload an image poster. It will be stored with the opportunity and its URL saved as posterUrl.</p>
            </div>

            {/* FILTER OPTIONS */}
            <div className="space-y-5 rounded-xl border border-[#E5EAF2] p-4 md:col-span-2">
              <h4 className="font-semibold text-[#1A1A2E]">Explore filters</h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#344054]">
                  Mode *
                  <select required value={form.mode}
                    onChange={e => setForm(prev => ({ ...prev, mode: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5">
                    <option value="">Select mode</option>
                    {["Online", "On-site", "Hybrid"].map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#344054]">
                  Deadline type *
                  <select required value={form.deadlineType}
                    onChange={e => setForm(prev => ({ ...prev, deadlineType: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5">
                    <option value="">Select deadline type</option>
                    {["Fixed Deadline", "Rolling", "No Deadline"].map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#344054]">
                  Location region *
                  <select required value={form.locationRegion}
                    onChange={e => setForm(prev => ({ ...prev, locationRegion: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5">
                    {["Anywhere", "Asia", "Europe", "Africa", "South America", "North America", "Australia", "Others"].map(x =>
                      <option key={x} value={x}>{x}</option>
                    )}
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#344054]">
                  Experience level *
                  <select required value={form.experienceLevel}
                    onChange={e => setForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map(x =>
                      <option key={x} value={x}>{x}</option>
                    )}
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#344054] sm:col-span-2">
                  Funding / Stipend *
                  <select required value={form.funding}
                    onChange={e => setForm(prev => ({ ...prev, funding: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5">
                    <option value="">Select funding/payment</option>
                    {["Fully Funded", "Partially Funded", "Paid", "Unpaid", "Free to Participate", "Paid Registration"].map(x =>
                      <option key={x} value={x}>{x}</option>
                    )}
                  </select>
                </label>
              </div>


              <label className="block text-sm font-medium text-[#344054]">
                Location region
                <select value={form.locationRegion}
                  onChange={e => setForm(prev => ({ ...prev, locationRegion: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5">
                  {["Anywhere", "Asia", "Europe", "Africa", "South America", "North America", "Australia", "Others"].map(x =>
                    <option key={x}>{x}</option>
                  )}
                </select>
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-[#344054]">Eligibility</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["Students", "Professionals", "Graduates", "Open to All"].map(x => (
                    <label key={x} className="flex items-center gap-2 text-sm text-[#475467]">
                      <input type="checkbox" checked={selectedEligibility.includes(x)}
                        onChange={e => setSelectedEligibility(prev => {
                          if (x === "Open to All") return e.target.checked ? ["Open to All"] : []
                          const next = e.target.checked
                            ? [...prev.filter(v => v !== "Open to All"), x]
                            : prev.filter(v => v !== x)
                          return next.length ? next : []
                        })} />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-[#344054]">Experience Level</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["Beginner", "Intermediate", "Advanced", "All Levels"].map(x => (
                    <label key={x} className="flex items-center gap-2 text-sm text-[#475467]">
                      <input type="radio" name="experienceLevel" checked={form.experienceLevel === x}
                        onChange={() => setForm(prev => ({ ...prev, experienceLevel: x }))} />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" disabled={saving}
                className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Opportunity"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-xl border border-[#D1D5DB] px-5 py-3 text-sm font-semibold text-[#475467]">
                Cancel
              </button>
            </div>
          </form>
          <p className="mt-3 text-xs text-[#687995]">Fields marked * are required. Expired deadlines are displayed in Archived.</p>
        </section>
      )}

      <section className="rounded-2xl border border-[#E5EAF2] bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setView("active")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${view === "active" ? "bg-[#2563EB] text-white" : "bg-[#F2F5FA] text-[#475467]"}`}>
              Active ({activeItems.length})
            </button>
            <button type="button" onClick={() => setView("archived")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${view === "archived" ? "bg-[#2563EB] text-white" : "bg-[#F2F5FA] text-[#475467]"}`}>
              Archived ({archivedItems.length})
            </button>
          </div>
          <button type="button" onClick={() => void loadItems()} className="text-sm font-semibold text-[#2563EB]">Refresh</button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-[#687995]">Loading your opportunities...</p>
        ) : displayed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D9E1EF] px-5 py-12 text-center">
            <h3 className="font-semibold text-[#1A1A2E]">{view === "active" ? "No active opportunities yet" : "No archived opportunities"}</h3>
            <p className="mt-2 text-sm text-[#687995]">{view === "active" ? "Post your first opportunity to reach students." : "Opportunities will appear here after their deadlines pass."}</p>
            {view === "active" && <button type="button" onClick={startNew} className="mt-4 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white">Post an Opportunity</button>}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(item => (
              <article key={item.id} className="rounded-xl border border-[#E5EAF2] p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-bold text-[#1A1A2E]">{item.title || "Untitled opportunity"}</h3>
                    <p className="mt-1 text-sm text-[#687995]">{item.organization || institutionName || "Institution"}{item.type ? ` · ${item.type}` : ""}</p>
                    <p className="mt-2 text-sm text-[#475467]">Deadline: {item.deadline || "Not specified"}</p>
                    {item.location && <p className="mt-1 text-sm text-[#687995]">Location: {item.location}</p>}
                    {item.description && <p className="mt-3 whitespace-pre-wrap text-sm text-[#475467]">{item.description}</p>}
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${isExpired(item.deadline) ? "bg-gray-100 text-gray-700" : "bg-blue-50 text-blue-700"}`}>
                    {isExpired(item.deadline) ? "Archived" : "Active"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => window.open(`/opportunity/${item.id}`, "_blank", "noopener,noreferrer")}
                    className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-medium text-[#344054]">View</button>
                  <button type="button" onClick={() => startEdit(item)}
                    className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-medium text-[#344054]">Edit</button>
                  <button type="button" onClick={() => void removeOpportunity(item)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {showCompletionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="completion-popup-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="completion-popup-title" className="text-xl font-bold text-[#1A1A2E]">Complete Your Institution Profile</h3>
            <p className="mt-3 text-sm leading-6 text-[#687995]">
              Your profile must be at least 75% complete before you can post an opportunity.
              Current completion: {profileCompletion ?? 0}%.
            </p>
            <div className="mt-5 flex justify-end">
              <button type="button" onClick={() => setShowCompletionPopup(false)} className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
