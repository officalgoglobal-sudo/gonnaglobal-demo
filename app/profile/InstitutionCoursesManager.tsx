"use client"

import { useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react"

type Course = {
  id: string
  institutionId: string
  name: string
  description: string
  category: string
  duration: string
  eligibility: string
  fee: string
  admissionFee: string
  status: "Draft" | "Published"
}

const emptyCourse = {
  name: "",
  description: "",
  category: "",
  duration: "",
  eligibility: "",
  fee: "",
  admissionFee: "",
  status: "Draft" as "Draft" | "Published",
}

export default function InstitutionCoursesManager({ user }: { user: any }) {
  const uid = user?.uid || auth.currentUser?.uid
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Course | null>(null)
  const [draft, setDraft] = useState(emptyCourse)

  async function loadCourses() {
    if (!uid) {
      setLoading(false)
      setMessage("Please sign in again to manage courses.")
      return
    }

    setLoading(true)
    try {
      const q = query(
        collection(db, "institutionCourses"),
        where("institutionId", "==", uid),
      )
      const snapshot = await getDocs(q)
      setCourses(snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Course, "id">),
      })))
    } catch (error) {
      console.error("Unable to load courses:", error)
      setMessage("Could not load courses. Check your Firestore permissions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [uid])

  function startEdit(course: Course) {
    setEditingId(course.id)
    setDraft({
      name: course.name || "",
      description: course.description || "",
      category: course.category || "",
      duration: course.duration || "",
      eligibility: course.eligibility || "",
      fee: course.fee || "",
      admissionFee: course.admissionFee || "",
      status: course.status || "Draft",
    })
    setFormOpen(true)
    setViewing(null)
  }

  async function saveCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!uid) return

    setSaving(true)
    setMessage("")
    try {
      const payload = {
        ...draft,
        fee: draft.fee.trim(),
        admissionFee: draft.admissionFee.trim(),
        institutionId: uid,
        institutionName:
          user?.institutionName || user?.organizationName || user?.displayName || "",
        updatedAt: serverTimestamp(),
      }

      if (editingId) {
        await updateDoc(doc(db, "institutionCourses", editingId), payload)
      } else {
        await addDoc(collection(db, "institutionCourses"), {
          ...payload,
          createdAt: serverTimestamp(),
        })
      }

      setFormOpen(false)
      setEditingId(null)
      setDraft(emptyCourse)
      setMessage(editingId ? "Course updated." : "Course added.")
      await loadCourses()
    } catch (error) {
      console.error("Unable to save course:", error)
      setMessage("Could not save course. Check your Firestore permissions.")
    } finally {
      setSaving(false)
    }
  }

  async function removeCourse(course: Course) {
    if (!uid || !window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return

    try {
      await deleteDoc(doc(db, "institutionCourses", course.id))
      setCourses((current) => current.filter((item) => item.id !== course.id))
      setMessage("Course deleted.")
    } catch (error) {
      console.error("Unable to delete course:", error)
      setMessage("Could not delete course. Check your Firestore permissions.")
    }
  }

  async function toggleStatus(course: Course) {
    if (!uid) return
    const status = course.status === "Published" ? "Draft" : "Published"

    try {
      await updateDoc(doc(db, "institutionCourses", course.id), {
        status,
        updatedAt: serverTimestamp(),
      })
      setCourses((current) =>
        current.map((item) => item.id === course.id ? { ...item, status } : item),
      )
    } catch (error) {
      console.error("Unable to update course status:", error)
      setMessage("Could not update course status.")
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Courses</h2>
          <p className="mt-1 text-sm text-[#687995]">
            Create courses, manage fees, and control publishing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null)
            setDraft(emptyCourse)
            setFormOpen(true)
            setViewing(null)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={17} /> Add Course
        </button>
      </header>

      {message && (
        <p role="status" className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
          {message}
        </p>
      )}

      {formOpen && (
        <form onSubmit={saveCourse} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{editingId ? "Edit Course" : "Add Course"}</h3>
            <button type="button" onClick={() => setFormOpen(false)} aria-label="Close form">
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {([
              ["name", "Course name", true],
              ["category", "Category", true],
              ["duration", "Duration", false],
              ["eligibility", "Eligibility", false],
              ["fee", "Total course fee (INR)", true],
              ["admissionFee", "Admission fee (INR)", false],
            ] as const).map(([key, label, required]) => (
              <label key={key} className="space-y-1 text-sm font-medium text-slate-700">
                {label}
                <input
                  required={required}
                  type={key === "fee" || key === "admissionFee" ? "number" : "text"}
                  min={key === "fee" || key === "admissionFee" ? 0 : undefined}
                  value={draft[key]}
                  onChange={(e) => setDraft((current) => ({ ...current, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </label>
            ))}

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Publishing status
              <select
                value={draft.status}
                onChange={(e) => setDraft((current) => ({ ...current, status: e.target.value as "Draft" | "Published" }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((current) => ({ ...current, description: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Course"}
          </button>
        </form>
      )}

      {viewing && (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{viewing.name}</h3>
            <button type="button" onClick={() => setViewing(null)} aria-label="Close details">
              <X size={20} />
            </button>
          </div>
          <p className="whitespace-pre-wrap text-sm text-slate-600">{viewing.description || "No description added."}</p>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <p><strong>Category:</strong> {viewing.category || "Not provided"}</p>
            <p><strong>Duration:</strong> {viewing.duration || "Not provided"}</p>
            <p><strong>Eligibility:</strong> {viewing.eligibility || "Not provided"}</p>
            <p><strong>Total fee:</strong> ₹{viewing.fee || "0"}</p>
            <p><strong>Admission fee:</strong> ₹{viewing.admissionFee || "0"}</p>
            <p><strong>Status:</strong> {viewing.status || "Draft"}</p>
          </div>
        </section>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="font-semibold text-slate-800">No courses yet</h3>
          <p className="mt-1 text-sm text-slate-500">Add your first course to get started.</p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <article key={course.id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{course.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{course.category || "Uncategorized"}{course.duration ? ` · ${course.duration}` : ""}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.status === "Published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                  {course.status || "Draft"}
                </span>
              </div>
              <p className="line-clamp-3 text-sm text-slate-600">{course.description || "No description added."}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-500">Course fee</p>
                  <p className="text-lg font-bold text-slate-900">₹{course.fee || "0"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setViewing(course)} title="View course" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"><Eye size={17} /></button>
                  <button type="button" onClick={() => startEdit(course)} title="Edit course" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"><Pencil size={17} /></button>
                  <button type="button" onClick={() => void toggleStatus(course)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                    {course.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" onClick={() => void removeCourse(course)} title="Delete course" className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
