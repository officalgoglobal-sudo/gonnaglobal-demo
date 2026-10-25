"use client"

import { useState, useEffect, useRef } from "react"
import { doc, updateDoc, collection, query, where, getDocs, getDoc, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import {
  MapPin, Mail, Link2, Camera, Share2, ChevronDown,
  Pencil, Download, ExternalLink, Plus, CheckCircle2,
  Circle, FileText, Bookmark, CalendarDays, Users,
  ArrowRight
} from "lucide-react"

// ── Mentor Profile Sub-Component
function EditableMentorDetails({
  user,
  onSave,
}: {
  user: any
  onSave: (values: Record<string, string>) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const keys = [
    ["Full Name", "fullName", user?.fullName || user?.displayName],
    ["Email Address", "email", user?.email],
    ["Phone Number", "phone", user?.phone || user?.phoneNumber],
    ["Home Country", "homeCountry", user?.homeCountry],
    ["Country", "country", user?.country],
    ["City", "city", user?.city],
    ["Professional Title", "professionalTitle", user?.professionalTitle],
    ["Headline", "headline", user?.headline],
    ["Current Role", "currentRole", user?.currentRole],
    ["Company", "company", user?.company],
    ["LinkedIn", "linkedinUrl", user?.linkedinUrl || user?.linkedin],
    ["Website / Portfolio", "website", user?.website || user?.portfolio],
  ] as const
  const [values, setValues] = useState<Record<string, string>>({})
  const beginEdit = () => {
    const next: Record<string, string> = {}
    keys.forEach(([, key, value]) => { next[key] = typeof value === "string" ? value : "" })
    setValues(next)
    setError("")
    setEditing(true)
  }
  const save = async () => {
    setSaving(true)
    setError("")
    try {
      const payload = { ...values }
      if (payload.fullName !== undefined) payload.displayName = payload.fullName
      await onSave(payload)
      setEditing(false)
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save details.")
    } finally {
      setSaving(false)
    }
  }
  return (
    <section className="mb-5 rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#1A1A2E]">Personal & Professional Details</h3>
        {!editing ? (
          <button type="button" onClick={beginEdit} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">Edit Details</button>
        ) : (
          <div className="flex gap-3">
            <button type="button" onClick={() => setEditing(false)} disabled={saving} className="text-sm text-gray-500">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        )}
      </div>
      {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map(([label, key, original]) => (
          <label key={key} className={""}>
            <span className="mb-1 block text-xs font-medium text-[#687995]">{label}</span>
            {editing ? (
                <input type={key === "email" ? "email" : "text"} value={values[key] ?? ""} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className="w-full rounded-lg border border-gray-300 p-3 text-sm text-[#1A1A2E]" />
            ) : (
              <div className="min-h-11 rounded-xl bg-[#F8FAFC] p-3 text-sm font-semibold text-[#1A1A2E] break-words">
                {typeof original === "string" && original.trim() ? original : "Not provided"}
              </div>
            )}
          </label>
        ))}
      </div>
    </section>
  )
}

function MentorToast({
  message,
  type,
  onClose,
}: {
  message: string
  type: "success" | "error"
  onClose: () => void
}) {
  if (!message) return null

  return (
    <div className="fixed right-5 top-20 z-[100] animate-[toastIn_0.25s_ease-out]">
      <div className={`flex max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
        type === "success" ? "border-blue-100" : "border-red-100"
      }`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
          type === "success" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
        }`}>
          {type === "success" ? "✓" : "!"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#1A1A2E]">
            {type === "success" ? "All good!" : "Oops!"}
          </p>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Dismiss notification"
          className="rounded-lg px-2 text-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  )
}

export default function MentorProfileView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Overview")

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [mentorActive, setMentorActive] = useState(user?.isMentorActive !== false)
  const [mentorPhotoURL, setMentorPhotoURL] = useState(user?.photoURL || "")
  const [mentorPhotoBusy, setMentorPhotoBusy] = useState(false)
  const mentorPhotoInputRef = useRef<HTMLInputElement>(null)
  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type })


  async function uploadMentorPhoto(file?: File) {
    if (!file) return
    if (!user?.uid) { showToast("Please log in again.", "error"); return }
    if (!file.type.startsWith("image/")) { showToast("Please select an image file.", "error"); return }
    if (file.size > 5 * 1024 * 1024) { showToast("Image must be 5 MB or smaller.", "error"); return }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      showToast("Cloudinary configuration is missing.", "error")
      return
    }

    setMentorPhotoBusy(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)
      formData.append("folder", "goglobal/profile-images")
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST", body: formData
      })
      const result = await response.json()
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Upload failed")
      await updateDoc(doc(db, "users", user.uid), { photoURL: result.secure_url })
      setMentorPhotoURL(result.secure_url)
      showToast("Profile picture updated.", "success")
    } catch (error) {
      console.error("Mentor photo upload failed:", error)
      showToast("Photo upload failed. Please try again.", "error")
    } finally {
      setMentorPhotoBusy(false)
    }
  }

  const [isProfileEditMode, setIsProfileEditMode] = useState(false)

  const router = useRouter()
  const [activityItems, setActivityItems] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)

  useEffect(() => {
    if (user?.uid) void loadActivity(user.uid)
  }, [user?.uid])

  async function loadActivity(uid: string) {
    setActivityLoading(true)
    try {
      const [applicationsSnap, savedSnap, viewedSnap] = await Promise.all([
        getDocs(query(collection(db, "applications"), where("userId", "==", uid))),
        getDocs(query(collection(db, "savedOpportunities"), where("userId", "==", uid))),
        getDocs(query(
          collection(db, "recentlyViewedOpportunities"),
          where("userId", "==", uid),
          orderBy("viewedAt", "desc"),
          limit(10)
        )),
      ])

      const rows = await Promise.all([
        ...applicationsSnap.docs.map(async item => {
          const data = item.data()
          let opportunity: any = {}
          if (data.opportunityId) {
            const snap = await getDoc(doc(db, "opportunities", data.opportunityId))
            if (snap.exists()) opportunity = snap.data()
          }
          return {
            id: "application-" + item.id,
            kind: "application",
            title: "Applied for " + (opportunity.title || opportunity.name || "an opportunity"),
            sub: opportunity.organization || opportunity.company || opportunity.university || "Opportunity",
            date: data.createdAt?.toDate?.() || data.appliedAt?.toDate?.() || data.updatedAt?.toDate?.() || null,
            icon: FileText, color: "#DBEAFE", iconColor: "#2563EB",
          }
        }),
        ...savedSnap.docs.map(async item => {
          const data = item.data()
          const opportunityId = data.opportunityId || (item.id.startsWith(uid + "_") ? item.id.slice(uid.length + 1) : "")
          let opportunity: any = {}
          if (opportunityId) {
            const snap = await getDoc(doc(db, "opportunities", opportunityId))
            if (snap.exists()) opportunity = snap.data()
          }
          return {
            id: "saved-" + item.id,
            kind: "saved",
            title: "Saved an opportunity",
            sub: opportunity.title || opportunity.name || "Opportunity",
            date: data.createdAt?.toDate?.() || data.savedAt?.toDate?.() || null,
            icon: Bookmark, color: "#D1FAE5", iconColor: "#059669",
          }
        }),
      ])

      viewedSnap.docs.forEach(item => {
        const viewed = item.data()
        rows.push({
          id: "viewed-" + item.id,
          kind: "viewed",
          title: "Viewed an opportunity",
          sub: viewed.title || "Opportunity",
          date: viewed.viewedAt?.toDate?.() || null,
          icon: ExternalLink,
          color: "#EDE9FE",
          iconColor: "#7C3AED",
        })
      })

      rows.sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0))
      setActivityItems(rows)
    } catch (error) {
      console.error("Could not load recent activity:", error)
      setActivityItems([])
    } finally {
      setActivityLoading(false)
    }
  }

  const [aboutMe, setAboutMe] = useState(user?.aboutMe || "")
  const [aboutMeDraft, setAboutMeDraft] = useState(user?.aboutMe || "")
  const [aboutMeEditing, setAboutMeEditing] = useState(false)
  const [aboutMeSaving, setAboutMeSaving] = useState(false)

  const languageLevels = ["Beginner", "Elementary", "Intermediate", "Upper Intermediate", "Advanced", "Fluent", "Native"]
  const languageOptions = [
    {name:"Afrikaans",flag:"🇿🇦"},{name:"Albanian",flag:"🇦🇱"},{name:"Amharic",flag:"🇪🇹"},
    {name:"Arabic",flag:"🇸🇦"},{name:"Armenian",flag:"🇦🇲"},{name:"Assamese",flag:"🇮🇳"},
    {name:"Azerbaijani",flag:"🇦🇿"},{name:"Basque",flag:"🇪🇸"},{name:"Belarusian",flag:"🇧🇾"},
    {name:"Bengali",flag:"🇧🇩"},{name:"Bosnian",flag:"🇧🇦"},{name:"Bulgarian",flag:"🇧🇬"},
    {name:"Burmese",flag:"🇲🇲"},{name:"Catalan",flag:"🇪🇸"},{name:"Chinese",flag:"🇨🇳"},
    {name:"Croatian",flag:"🇭🇷"},{name:"Czech",flag:"🇨🇿"},{name:"Danish",flag:"🇩🇰"},
    {name:"Dutch",flag:"🇳🇱"},{name:"English",flag:"🇬🇧"},{name:"Estonian",flag:"🇪🇪"},
    {name:"Filipino",flag:"🇵🇭"},{name:"Finnish",flag:"🇫🇮"},{name:"French",flag:"🇫🇷"},
    {name:"Georgian",flag:"🇬🇪"},{name:"German",flag:"🇩🇪"},{name:"Greek",flag:"🇬🇷"},
    {name:"Gujarati",flag:"🇮🇳"},{name:"Hausa",flag:"🇳🇬"},{name:"Hebrew",flag:"🇮🇱"},
    {name:"Hindi",flag:"🇮🇳"},{name:"Hungarian",flag:"🇭🇺"},{name:"Icelandic",flag:"🇮🇸"},
    {name:"Indonesian",flag:"🇮🇩"},{name:"Irish",flag:"🇮🇪"},{name:"Italian",flag:"🇮🇹"},
    {name:"Japanese",flag:"🇯🇵"},{name:"Javanese",flag:"🇮🇩"},{name:"Kannada",flag:"🇮🇳"},
    {name:"Kazakh",flag:"🇰🇿"},{name:"Khmer",flag:"🇰🇭"},{name:"Korean",flag:"🇰🇷"},
    {name:"Kurdish",flag:"🇮🇶"},{name:"Lao",flag:"🇱🇦"},{name:"Latvian",flag:"🇱🇻"},
    {name:"Lithuanian",flag:"🇱🇹"},{name:"Malay",flag:"🇲🇾"},{name:"Malayalam",flag:"🇮🇳"},
    {name:"Maltese",flag:"🇲🇹"},{name:"Marathi",flag:"🇮🇳"},{name:"Mongolian",flag:"🇲🇳"},
    {name:"Nepali",flag:"🇳🇵"},{name:"Norwegian",flag:"🇳🇴"},{name:"Odia",flag:"🇮🇳"},
    {name:"Pashto",flag:"🇦🇫"},{name:"Persian",flag:"🇮🇷"},{name:"Polish",flag:"🇵🇱"},
    {name:"Portuguese",flag:"🇵🇹"},{name:"Punjabi",flag:"🇮🇳"},{name:"Romanian",flag:"🇷🇴"},
    {name:"Russian",flag:"🇷🇺"},{name:"Serbian",flag:"🇷🇸"},{name:"Sinhala",flag:"🇱🇰"},
    {name:"Slovak",flag:"🇸🇰"},{name:"Slovenian",flag:"🇸🇮"},{name:"Somali",flag:"🇸🇴"},
    {name:"Spanish",flag:"🇪🇸"},{name:"Swahili",flag:"🇹🇿"},{name:"Swedish",flag:"🇸🇪"},
    {name:"Tamil",flag:"🇮🇳"},{name:"Telugu",flag:"🇮🇳"},{name:"Thai",flag:"🇹🇭"},
    {name:"Turkish",flag:"🇹🇷"},{name:"Ukrainian",flag:"🇺🇦"},{name:"Urdu",flag:"🇵🇰"},
    {name:"Uzbek",flag:"🇺🇿"},{name:"Vietnamese",flag:"🇻🇳"},{name:"Welsh",flag:"🏴"},
    {name:"Yoruba",flag:"🇳🇬"},{name:"Zulu",flag:"🇿🇦"}
  ]

  const initialLanguages = Array.isArray(user?.languages) ? user.languages : []
  const [languages, setLanguages] = useState<any[]>(initialLanguages)
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)
  const [languageQuery, setLanguageQuery] = useState("")
  const [pendingLanguage, setPendingLanguage] = useState<any>(null)
  const [pendingLevel, setPendingLevel] = useState("Intermediate")
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null)
  const [isSavingLanguages, setIsSavingLanguages] = useState(false)
  const [languageError, setLanguageError] = useState("")

  async function persistLanguages(next: any[]) {
    if (!user?.uid) {
      setLanguageError("Please log in again to save languages.")
      return false
    }
    setIsSavingLanguages(true)
    setLanguageError("")
    try {
      await updateDoc(doc(db, "users", user.uid), { languages: next })
      setLanguages(next)
      return true
    } catch (error) {
      console.error("Failed to save languages:", error)
      setLanguageError("Couldn't save languages. Please try again.")
      return false
    } finally {
      setIsSavingLanguages(false)
    }
  }

  async function addLanguage(language: any, level: string) {
    if (languages.some(item => item.name.toLowerCase() === language.name.toLowerCase())) {
      setLanguageError("This language is already added.")
      return
    }
    const next = [...languages, { ...language, level }]
    if (await persistLanguages(next)) {
      setPendingLanguage(null)
      setShowLanguagePicker(false)
      setLanguageQuery("")
    }
  }

  async function removeLanguage(name: string) {
    await persistLanguages(languages.filter(language => language.name !== name))
  }

  async function updateLanguageLevel(name: string, level: string) {
    const next = languages.map(language =>
      language.name === name ? { ...language, level } : language
    )
    if (await persistLanguages(next)) setEditingLanguage(null)
  }

  const [resume, setResume] = useState<any>(user?.resume || null)
  const [resumeProgress, setResumeProgress] = useState(0)
  const [resumeBusy, setResumeBusy] = useState(false)
  const [resumeError, setResumeError] = useState("")
  const [isEditingResume, setIsEditingResume] = useState(false)
  const [showDeleteResumePopup, setShowDeleteResumePopup] = useState(false)
  const MAX_RESUME_BYTES = 5 * 1024 * 1024

  async function uploadResume(file: File | undefined) {
    if (!file) return
    setResumeError("")

    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setResumeError("Please select a valid PDF file.")
      return
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("Your PDF must be 5 MB or smaller.")
      return
    }

    const currentUser = auth.currentUser
    if (!currentUser || currentUser.uid !== user?.uid) {
      setResumeError("Please log in again to upload your resume.")
      return
    }

    setResumeBusy(true)
    setResumeProgress(0)

    try {
      const token = await currentUser.getIdToken()
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Resume upload failed.")

      setResumeProgress(100)
      const nextResume = {
        name: file.name,
        size: file.size,
        path: result.path,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, "users", currentUser.uid), { resume: nextResume })
      setResume(nextResume)
      setIsEditingResume(false)

      if (resume?.path && resume.path !== result.path &&
          resume.path.startsWith(`${currentUser.uid}/`)) {
        try {
          await fetch("/api/resume/delete", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: resume.path }),
          })
        } catch (cleanupError) {
          console.error("Previous resume cleanup failed:", cleanupError)
        }
      }
    } catch (error) {
      console.error("Resume upload failed:", error)
      setResumeError(error instanceof Error ? error.message : "Resume upload failed.")
    } finally {
      setResumeBusy(false)
    }
  }

  async function openResume() {
    if (!resume?.path) {
      setResumeError("Resume file details are missing. Please upload the PDF again.")
      return
    }

    const currentUser = auth.currentUser
    if (!currentUser || currentUser.uid !== user?.uid) {
      setResumeError("Please log in again to open your resume.")
      return
    }

    const tab = window.open("about:blank", "_blank")
    if (!tab) {
      setResumeError("Please allow pop-ups to view your resume.")
      return
    }

    setResumeBusy(true)
    setResumeError("")
    try {
      const token = await currentUser.getIdToken()
      const response = await fetch("/api/resume/download", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: resume.path }),
      })

      const contentType = response.headers.get("content-type") || ""
      if (!response.ok) {
        const message = contentType.includes("application/json")
          ? (await response.json()).error
          : await response.text()
        throw new Error(message || "Could not open resume.")
      }

      if (contentType.includes("application/json")) {
        const result = await response.json()
        if (!result.url) throw new Error(result.error || "Resume URL was not returned.")
        tab.location.href = result.url
      } else {
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        tab.location.href = objectUrl
      }
    } catch (error) {
      tab.close()
      setResumeError(error instanceof Error ? error.message : "Could not open resume.")
    } finally {
      setResumeBusy(false)
    }
  }

  async function removeResume() {
    const currentUser = auth.currentUser
    if (!currentUser || currentUser.uid !== user?.uid) {
      setResumeError("Please log in again to remove your resume.")
      return
    }

    setResumeBusy(true)
    setResumeError("")
    try {
      const token = await currentUser.getIdToken()
      if (resume?.path) {
        const response = await fetch("/api/resume/delete", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: resume.path }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Resume removal failed.")
      }

      await updateDoc(doc(db, "users", currentUser.uid), { resume: null })
      setResume(null)
      setIsEditingResume(false)
    } catch (error) {
      console.error("Resume removal failed:", error)
      setResumeError(error instanceof Error ? error.message : "Resume removal failed.")
    } finally {
      setResumeBusy(false)
    }
  }

  const mentorshipSuggestions = [
    "Career Guidance", "Resume Review", "Interview Preparation",
    "Product Management", "Software Development", "Web Development",
    "Data Science", "Artificial Intelligence", "Machine Learning",
    "Cybersecurity", "UI/UX Design", "Entrepreneurship",
    "Startup Guidance", "Leadership", "Communication Skills",
    "Higher Education", "Study Abroad Guidance", "Scholarship Guidance",
    "Research Guidance", "Internship Guidance", "Job Search",
    "Networking", "Personal Branding", "Portfolio Review",
    "Industry Insights", "Project Guidance", "Public Speaking"
  ]
  const initialMentorshipAreas = Array.isArray(user?.mentorshipAreas)
    ? user.mentorshipAreas
    : []
  const [mentorshipAreas, setMentorshipAreas] = useState<string[]>(initialMentorshipAreas)
  const [mentorshipDraft, setMentorshipDraft] = useState<string[]>(initialMentorshipAreas)
  const [mentorshipEditing, setMentorshipEditing] = useState(false)
  const [mentorshipQuery, setMentorshipQuery] = useState("")
  const [mentorshipSaving, setMentorshipSaving] = useState(false)

  const addMentorshipArea = (value: string) => {
    const tag = value.trim()
    if (!tag || mentorshipDraft.some((item) => item.toLowerCase() === tag.toLowerCase())) return
    setMentorshipDraft((current) => [...current, tag])
    setMentorshipQuery("")
  }

  const initialExperience = Array.isArray(user?.experience) ? user.experience : []
  const [experiences, setExperiences] = useState<any[]>(initialExperience)

  const completionSections = [
    Boolean(String(user?.fullName || user?.displayName || "").trim() &&
            String(user?.email || "").trim()),
    Boolean(
      [user?.professionalTitle, user?.headline, user?.currentRole, user?.company]
        .some(value => typeof value === "string" && value.trim())
    ),
    mentorshipAreas.length >= 4,
    languages.length >= 2,
    experiences.length >= 1,
    Boolean(
      (typeof user?.website === "string" && user.website.trim()) ||
      (typeof user?.portfolio === "string" && user.portfolio.trim())
    ),
  ]
  const completedSections = completionSections.filter(Boolean).length
  const mentorProfileCompletion = Math.round(
    (completedSections / completionSections.length) * 100
  )
  const canActivateMentorship = mentorProfileCompletion >= 75

  const [experienceDraft, setExperienceDraft] = useState<any[]>(initialExperience)
  const [experienceEditing, setExperienceEditing] = useState(false)
  const [experienceSaving, setExperienceSaving] = useState(false)
  const [experienceForm, setExperienceForm] = useState({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  const initialEducation = Array.isArray(user?.education) ? user.education : []
  const [education, setEducation] = useState<any[]>(initialEducation)
  const [educationDraft, setEducationDraft] = useState<any[]>(initialEducation)
  const [educationEditing, setEducationEditing] = useState(false)
  const [educationSaving, setEducationSaving] = useState(false)
  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  const saveEducation = async () => {
    if (!user?.uid) {
      alert("Unable to save: user account was not found.")
      return
    }

    setEducationSaving(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        education: educationDraft,
      })
      setEducation(educationDraft)
      setEducationEditing(false)
      setEducationForm({
        institution: "", degree: "", field: "",
        startDate: "", endDate: "", location: "",
      })
    } catch (error) {
      console.error("Failed to save education:", error)
      alert("Could not save education. Please try again.")
    } finally {
      setEducationSaving(false)
    }
  }

  const saveExperiences = async () => {
    if (!user?.uid) {
      alert("Unable to save: user account was not found.")
      return
    }

    setExperienceSaving(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        experience: experienceDraft,
      })
      setExperiences(experienceDraft)
      setExperienceEditing(false)
      setExperienceForm({ role: "", company: "", startDate: "", endDate: "", location: "" })
    } catch (error) {
      console.error("Failed to save professional experience:", error)
      alert("Could not save experience. Please try again.")
    } finally {
      setExperienceSaving(false)
    }
  }

  const saveMentorshipAreas = async () => {
    if (!user?.uid) {
      alert("Unable to identify your account. Please log in again.")
      return
    }
    setMentorshipSaving(true)
    try {
      await updateDoc(doc(db, "users", user.uid), { mentorshipAreas: mentorshipDraft })
      setMentorshipAreas(mentorshipDraft)
      setMentorshipEditing(false)
      setMentorshipQuery("")
    } catch (error) {
      console.error("Failed to save mentorship areas:", error)
      alert("Could not save mentorship areas. Please try again.")
    } finally {
      setMentorshipSaving(false)
    }
  }


  const saveAboutMe = async () => {
    if (!user?.uid) {
      alert("Unable to identify your account. Please log in again.")
      return
    }
    setAboutMeSaving(true)
    try {
      const value = aboutMeDraft.trim()
      await updateDoc(doc(db, "users", user.uid), { aboutMe: value })
      setAboutMe(value)
      setAboutMeEditing(false)
    } catch (error) {
      console.error("Failed to save About Me:", error)
      alert("Could not save About Me. Please try again.")
    } finally {
      setAboutMeSaving(false)
    }
  }

  return (
    <div>
      {/* Cover */}
      <div className="relative h-[200px] overflow-hidden bg-gradient-to-r from-slate-300 to-blue-300">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80" alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/20" />
        <div className="absolute left-1/2 top-8 -translate-x-1/4 text-center">
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Empowering</p>
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Global Talent</p>
        </div>
        <div className="absolute right-16 top-8 text-right text-white drop-shadow">
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Mentor</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Guide</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Support</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Grow</p>
        </div>
        
      </div>

      {/* Info row */}
      <div className="relative bg-white px-6 pb-0 border-b border-[#EBEBEB]">
        <div className="absolute -top-14 left-6">
          <div className="relative h-[108px] w-[108px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            <img src={user?.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.fullName || user?.displayName || "Mentor") + "&background=E5E7EB&color=374151"} alt="Profile picture" className="h-full w-full object-cover" />
            <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
              <Camera className="h-3.5 w-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        <div className="ml-[130px] flex flex-wrap items-start justify-between gap-4 pb-4 pt-3">
          <div className="min-w-0 flex-1">
            <div className="flex w-full items-center gap-2">
              <h1 className="text-[24px] font-bold text-[#1A1A2E]">{user?.fullName || user?.displayName || "Mentor"}</h1>

              
            </div>
            {[user?.headline, user?.currentRole, user?.company, user?.professionalTitle].filter(value => typeof value === "string" && value.trim()).filter((value, index, all) => all.indexOf(value) === index).length > 0 && (
              <p className="text-[13.5px] text-[#687995]">
                {[user?.headline, user?.currentRole, user?.company, user?.professionalTitle].filter(value => typeof value === "string" && value.trim()).filter((value, index, all) => all.indexOf(value) === index).join(" | ")}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#687995]">
              {[user?.city, user?.country, user?.location].filter(value => typeof value === "string" && value.trim()).filter((value, index, all) => all.indexOf(value) === index).length > 0 && (
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {[user?.city, user?.country, user?.location].filter(value => typeof value === "string" && value.trim()).filter((value, index, all) => all.indexOf(value) === index).join(", ")}</span>
              )}
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user?.email || "No email provided"}</span>
              {(user?.linkedinUrl || user?.linkedin)?.trim() && (
                <a href={user.linkedinUrl || user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2563EB]">
                  <Link2 className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[#2563EB]/20 bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
            Mentor
          </span>
        </div>

        <div className="flex gap-6">
          {["Overview", "Details", "Reviews", "Student Bookings", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-[14px] font-medium transition ${activeTab === tab ? "border-b-2 border-[#2563EB] text-[#2563EB]" : "text-[#687995] hover:text-[#1A1A2E]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <MentorToast
        message={toast?.message || ""}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />

      {activeTab === "Settings" && (
        <main className="mx-auto w-full max-w-3xl space-y-5 px-6 py-6">
          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1A1A2E]">Mentor Settings</h2>
            <p className="mt-1 text-sm text-[#687995]">Manage your sessions, visibility and account.</p>
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">Session price (₹)</label>
                <input
                  id="mentor-price"
                  type="number"
                  style={{ color: "#1A1A2E", colorScheme: "light" }}
                  min="0"
                  defaultValue={user?.mentorPrice ?? user?.price ?? 0}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                  placeholder="Enter price (0 for free)"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">Session type</label>
                <select
                  id="mentor-session-type"
                  style={{ color: "#1A1A2E", colorScheme: "light" }}
                  defaultValue={user?.mentorSessionType || "30-min"}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:border-blue-500"
                >
                  <option value="30-min">30-minute conversation</option>
                  <option value="1-hour">1-hour conversation</option>
                  <option value="unlimited">One session — no time limit</option>
                </select>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const priceInput = document.getElementById("mentor-price") as HTMLInputElement | null
                    const typeInput = document.getElementById("mentor-session-type") as HTMLSelectElement | null
                    const price = Number(priceInput?.value)
                    if (!Number.isFinite(price) || price < 0) {
                      showToast("Enter a valid price (0 or higher).", "error")
                      return
                    }
                    if (!user?.uid) throw new Error("Please log in again.")
                    await updateDoc(doc(db, "users", user.uid), {
                      mentorPrice: price,
                      mentorSessionType: typeInput?.value || "30-min",
                    })
                    showToast("Pricing saved.", "success")
                  } catch (error) {
                    console.error(error)
                    showToast("Could not save pricing. Please try again.", "error")
                  }
                }}
                className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Pricing
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#1A1A2E]">Profile Picture</h3>
            <p className="mt-1 text-sm text-[#687995]">Upload a new photo for your mentor profile.</p>
            <input
              id="mentor-profile-photo"
              type="file"
              accept="image/*"
              className="mt-4 block w-full text-sm text-gray-600"
            />
            <button
              type="button"
              onClick={async () => {
                const input = document.getElementById("mentor-profile-photo") as HTMLInputElement | null
                const file = input?.files?.[0]
                if (!file) {
                  showToast("Please choose an image first.", "error")
                  return
                }
                await uploadMentorPhoto(file)
                if (input) input.value = ""
              }}
              disabled={mentorPhotoBusy}
              className="mt-4 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Upload Photo
            </button>
          </section>

          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#1A1A2E]">Mentorship Availability</h3>
            <p className="mt-1 text-sm text-[#687995]">When inactive, your profile should not appear in the mentorship listing.</p>
            {!canActivateMentorship && (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                🔒 Mentorship activation is locked. Complete at least 75% of your profile first.
                Current completion: <strong>{mentorProfileCompletion}%</strong>.
              </p>
            )}
            <div className="mt-5 flex items-center justify-between gap-5 rounded-xl bg-[#F8FAFF] p-4">
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  {mentorActive ? "Active — available for mentorship" : "You are currently inactive"}
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                  {mentorActive
                    ? "Students can discover your profile in mentorship listings."
                    : "Students will not see your profile in mentorship listings."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle mentorship availability"
                aria-checked={mentorActive}
                onClick={async () => {
                  if (!user?.uid) {
                    showToast("Please log in again.", "error")
                    return
                  }
                  const previousValue = mentorActive
                  const nextValue = !previousValue

                  if (nextValue && !canActivateMentorship) {
                    showToast(
                      `Complete at least 75% of your profile first. Current completion: ${mentorProfileCompletion}%.`,
                      "error"
                    )
                    setActiveTab("Overview")
                    return
                  }

                  setMentorActive(nextValue)
                  try {
                    await updateDoc(doc(db, "users", user.uid), { isMentorActive: nextValue })
                    showToast(
                      nextValue ? "You are now visible to students! ✨" : "Your profile is now hidden from mentorship listings.",
                      "success"
                    )
                  } catch (error) {
                    console.error(error)
                    setMentorActive(previousValue)
                    showToast("Could not update availability. Please try again.", "error")
                  }
                }}
                disabled={!canActivateMentorship && !mentorActive}
                title={!canActivateMentorship && !mentorActive ? "Complete at least 75% of your profile to activate mentorship." : "Toggle mentorship availability"}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                  mentorActive ? "bg-[#2563EB]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    mentorActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-red-600">Account</h3>
            <p className="mt-1 text-sm text-[#687995]">Sign out of your account on this device.</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await signOut(auth)
                  window.location.href = "/login"
                } catch (error) {
                  console.error(error)
                  showToast("Logout failed. Please try again.", "error")
                }
              }}
              className="mt-4 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Log Out
            </button>
          </section>
        </main>
      )}

      {activeTab === "Reviews" && (
        <main className="mx-auto w-full max-w-3xl space-y-5 px-6 py-6">
          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1A1A2E]">Mentor Reviews</h2>
            <p className="mt-1 text-sm text-[#687995]">Ratings and feedback from people who have reviewed your mentorship.</p>
            <div className="mt-6 rounded-xl border border-dashed border-[#D9E1EF] px-5 py-10 text-center">
              <h3 className="text-base font-semibold text-[#1A1A2E]">Your reviews will appear here</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#687995]">Reviews will appear here once students can submit feedback.</p>
            </div>
          </section>
        </main>
      )}

      {activeTab === "Student Bookings" && (
        <main className="mx-auto w-full max-w-3xl space-y-5 px-6 py-6">
          <section className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1A1A2E]">Student Bookings</h2>
            <p className="mt-1 text-sm text-[#687995]">
              View students who book mentorship sessions with you.
            </p>
            <div className="mt-6 rounded-xl border border-dashed border-[#D9E1EF] px-5 py-10 text-center">
              <h3 className="text-base font-semibold text-[#1A1A2E]">No student bookings yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#687995]">
                When students book a session with you, their details and public profile links will appear here.
              </p>
            </div>
          </section>
        </main>
      )}

      {activeTab === "Details" && (
        <main className="px-6 py-6">
          <h2 className="mb-1 text-2xl font-bold text-[#1A1A2E]">Mentor Details</h2>
          <p className="mb-6 text-sm text-[#687995]">Your personal and professional information</p>

          {(() => {
            const [unused] = [null]
            return null
          })()}
          <EditableMentorDetails
            user={user}
            onSave={async (values: Record<string, string>) => {
              if (!user?.uid) throw new Error("Please log in again.")
              await updateDoc(doc(db, "users", user.uid), values)
            }}
          />

          {[
            { title: `Areas of Mentorship (${Math.min(mentorshipAreas.length, 4)}/4)`, items: mentorshipAreas, render: (item: any) => item },
            { title: "Professional Experience", items: experiences, render: (item: any) => [item.role || item.title, item.company, item.period || [item.startDate, item.endDate].filter(Boolean).join(" – "), item.location].filter(Boolean).join(" · ") },
            { title: "Education", items: education, render: (item: any) => [item.institution || item.school, item.degree, item.field || item.major, item.period || [item.startDate, item.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ") },
            { title: "Languages Known", items: languages, render: (item: any) => [item.name, item.level].filter(Boolean).join(" · ") },
          ].map(section => (
            <section key={section.title} className="mb-5 rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-[#1A1A2E]">{section.title}</h3>
              {Array.isArray(section.items) && section.items.length ? (
                <div className="space-y-3">
                  {section.items.map((item: any, index: number) => (
                    <div key={item.id || item.name || `${section.title}-${index}`} className="rounded-xl bg-[#F8FAFC] p-4 text-sm text-[#1A1A2E]">
                      {section.render(item) || "Not provided"}
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-[#687995]">Not provided</p>}
            </section>
          ))}
        </main>
      )}

      {/* Body */}
      <div className={`grid grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[240px_1fr_280px] ${activeTab === "Details" || activeTab === "Reviews" || activeTab === "Student Bookings" || activeTab === "Settings" ? "hidden" : ""}`}>
        {/* Left */}
        <div>
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Profile Completion</h3>
            <div className="my-5 flex justify-center">
              <div className="relative h-[110px] w-[110px]">
                <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#F0F0F0" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#2563EB" strokeWidth="10" strokeDasharray={`${(mentorProfileCompletion / 100) * 301.6} 301.6`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[22px] font-bold text-[#1A1A2E]">{mentorProfileCompletion}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#687995] mb-4">{completedSections}/6 sections completed</p>
            <div className="space-y-2.5">
              {[
                "Basic Information",
                "Professional Details",
                "Areas of Mentorship",
                "Languages",
                "Add Experience",
                "Add Website / Portfolio",
              ].map((item, i) => (
                <div key={item} className="flex items-center gap-2 text-[13px]">
                  {completionSections[i] ? (
                    <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-[#D0D0D0] shrink-0" />
                  )}
                  <span className={completionSections[i] ? "text-[#1A1A2E]" : "text-[#ABABAB]"}>{item}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setActiveTab("Details")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition">
              Complete Your Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Middle */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">About Me</h3>
              {isProfileEditMode && !aboutMeEditing ? (
                <button type="button" aria-label="Edit About Me" onClick={() => { setAboutMeDraft(aboutMe); setAboutMeEditing(true); }} className="rounded p-1 hover:bg-gray-100">
                  <Pencil className="h-4 w-4 text-[#ABABAB]" />
                </button>
              ) : isProfileEditMode ? (
                <div className="flex gap-3 text-xs font-semibold">
                  <button type="button" onClick={() => { setAboutMeDraft(aboutMe); setAboutMeEditing(false); }} className="text-gray-500">Cancel</button>
                  <button type="button" disabled={aboutMeSaving} onClick={saveAboutMe} className="text-[#2563EB] disabled:opacity-50">{aboutMeSaving ? "Saving..." : "Save"}</button>
                </div>
              ) : null}
            </div>
            {aboutMeEditing ? (
              <textarea value={aboutMeDraft} onChange={(e) => setAboutMeDraft(e.target.value)} rows={5} maxLength={2000} placeholder="Write about yourself and your mentoring experience..." className="w-full rounded-lg border border-gray-200 p-3 text-[13.5px] leading-[1.7] text-[#687995] outline-none focus:border-blue-400" />
            ) : (
              <p className="whitespace-pre-wrap text-[13.5px] leading-[1.7] text-[#687995]">
                {aboutMe || "Tell students about yourself, your experience, and how you can help them."}
              </p>
            )}

          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Areas of Mentorship</h3>
              <div className="flex items-center gap-3">
                {isProfileEditMode && (mentorshipEditing ? (
                  <>
                    <button type="button" onClick={() => { setMentorshipDraft(mentorshipAreas); setMentorshipEditing(false); setMentorshipQuery(""); }} className="text-xs font-semibold text-gray-500">Cancel</button>
                    <button type="button" disabled={mentorshipSaving} onClick={saveMentorshipAreas} className="text-xs font-semibold text-[#2563EB] disabled:opacity-50">{mentorshipSaving ? "Saving..." : "Save"}</button>
                  </>
                ) : (
                  <button type="button" onClick={() => { setMentorshipDraft(mentorshipAreas); setMentorshipEditing(true); }} className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                ))}
              </div>
            </div>
            {mentorshipEditing && (
              <div className="relative mb-4">
                <input
                  value={mentorshipQuery}
                  onChange={(event) => setMentorshipQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addMentorshipArea(mentorshipQuery)
                    }
                    if (event.key === "Escape") setMentorshipQuery("")
                  }}
                  placeholder="Search areas or type your own..."
                  className="w-full rounded-xl border border-[#D7DCE5] px-3 py-2.5 text-sm text-[#1A1A2E] placeholder:text-[#4B5563] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
                {mentorshipQuery.trim() && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E0E0E0] bg-white p-1 shadow-lg">
                    {mentorshipSuggestions.filter((item) =>
                      item.toLowerCase().includes(mentorshipQuery.trim().toLowerCase()) &&
                      !mentorshipDraft.some((existing) => existing.toLowerCase() === item.toLowerCase())
                    ).slice(0, 8).map((item) => (
                      <button key={item} type="button" onClick={() => addMentorshipArea(item)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#1A1A2E] hover:bg-[#EEF3FF]">{item}</button>
                    ))}
                    {!mentorshipDraft.some((existing) => existing.toLowerCase() === mentorshipQuery.trim().toLowerCase()) && (
                      <button type="button" onClick={() => addMentorshipArea(mentorshipQuery)} className="block w-full rounded-lg border-t border-[#F0F0F0] px-3 py-2 text-left text-sm font-medium text-[#2563EB] hover:bg-[#EEF3FF]">+ Add "{mentorshipQuery.trim()}" as a custom area</button>
                    )}
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">Type to search suggestions or add a custom area. Press Enter to add.</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(mentorshipEditing ? mentorshipDraft : mentorshipAreas).map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12.5px] text-[#555]">
                  {tag}
                  {mentorshipEditing && <button type="button" aria-label={"Remove " + tag} onClick={() => setMentorshipDraft((current) => current.filter((item) => item !== tag))} className="ml-1 text-[#ABABAB] hover:text-red-500">×</button>}
                </span>
              ))}
              {(mentorshipEditing ? mentorshipDraft : mentorshipAreas).length === 0 && <p className="text-sm text-gray-500">No mentorship areas added yet.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Professional Experience</h3>
              {isProfileEditMode && !experienceEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setExperienceDraft(experiences.map((item) => ({ ...item })))
                    setExperienceEditing(true)
                  }}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
              ) : isProfileEditMode ? (
                <div className="flex gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setExperienceDraft(experiences.map((item) => ({ ...item })))
                      setExperienceForm({ role: "", company: "", startDate: "", endDate: "", location: "" })
                      setExperienceEditing(false)
                    }}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={experienceSaving}
                    onClick={saveExperiences}
                    className="text-[#2563EB] disabled:opacity-50"
                  >
                    {experienceSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : null}
            </div>


            {experienceEditing && (
              <form
                className="mb-5 space-y-3 rounded-xl border border-gray-200 p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!experienceForm.role.trim() || !experienceForm.company.trim()) {
                    alert("Please enter both job title and company.")
                    return
                  }
                  setExperienceDraft((current) => [
                    ...current,
                    {
                      id: `${Date.now()}`,
                      role: experienceForm.role.trim(),
                      company: experienceForm.company.trim(),
                      startDate: experienceForm.startDate,
                      endDate: experienceForm.endDate,
                      period: [experienceForm.startDate, experienceForm.endDate].filter(Boolean).join(" – "),
                      location: experienceForm.location.trim(),
                    },
                  ])
                  setExperienceForm({ role: "", company: "", startDate: "", endDate: "", location: "" })
                }}
              >
                <p className="text-sm font-semibold text-[#1A1A2E]">Add experience</p>
                <input
                  required
                  value={experienceForm.role}
                  onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                  placeholder="Job title (e.g. Software Engineer)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <input
                  required
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  placeholder="Company / organization"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                    placeholder="Start date (e.g. Jan 2023)"
                    className="min-w-0 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                  />
                  <input
                    value={experienceForm.endDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                    placeholder="End date or Present"
                    className="min-w-0 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                  />
                </div>
                <input
                  value={experienceForm.location}
                  onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                  placeholder="Location (optional)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <button type="submit" className="flex items-center gap-1 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">
                  <Plus className="h-4 w-4" /> Add Experience
                </button>
              </form>
            )}

            {(experienceEditing ? experienceDraft : experiences).length > 0 ? (
              (experienceEditing ? experienceDraft : experiences).map((item: any, index: number) => (
                <div key={item.id || `${item.company || "experience"}-${index}`} className="mb-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E0E0E0] text-xl">💼</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#1A1A2E]">{item.role || item.title || "Role not added"}</p>
                    <p className="text-[13px] text-[#687995]">{item.company || item.organization || "Organization not added"}</p>
                    {([item.period, item.startDate, item.endDate, item.location].some((value: unknown) => typeof value === "string" && value.trim())) && (
                      <p className="text-[12px] text-[#687995]">
                        {[item.period, item.startDate, item.endDate, item.location].filter((value: unknown) => typeof value === "string" && value.trim()).join(" · ")}
                      </p>
                    )}
                  </div>
                  {experienceEditing && (
                    <button
                      type="button"
                      aria-label={`Remove ${item.role || item.title || "experience"}`}
                      onClick={() => setExperienceDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      className="text-lg text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-[#687995]">
                No professional experience added yet. Add your experience to help students understand your background.
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Education</h3>
              {isProfileEditMode && !educationEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEducationDraft(education.map((item) => ({ ...item })))
                    setEducationEditing(true)
                  }}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
              ) : isProfileEditMode ? (
                <div className="flex gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setEducationDraft(education.map((item) => ({ ...item })))
                      setEducationForm({ institution: "", degree: "", field: "", startDate: "", endDate: "", location: "" })
                      setEducationEditing(false)
                    }}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={educationSaving}
                    onClick={saveEducation}
                    className="text-[#2563EB] disabled:opacity-50"
                  >
                    {educationSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : null}
            </div>

            {educationEditing && (
              <form
                className="mb-5 space-y-3 rounded-xl border border-gray-200 p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!educationForm.institution.trim() || !educationForm.degree.trim()) {
                    alert("Please enter both institution and degree.")
                    return
                  }
                  setEducationDraft((current) => [
                    ...current,
                    {
                      id: `${Date.now()}`,
                      institution: educationForm.institution.trim(),
                      degree: educationForm.degree.trim(),
                      field: educationForm.field.trim(),
                      startDate: educationForm.startDate.trim(),
                      endDate: educationForm.endDate.trim(),
                      location: educationForm.location.trim(),
                    },
                  ])
                  setEducationForm({ institution: "", degree: "", field: "", startDate: "", endDate: "", location: "" })
                }}
              >
                <p className="text-sm font-semibold text-[#1A1A2E]">Add education</p>
                <input
                  required
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  placeholder="Institution (e.g. IIT Bombay)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <input
                  required
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  placeholder="Degree (e.g. B.Tech)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <input
                  value={educationForm.field}
                  onChange={(e) => setEducationForm({ ...educationForm, field: e.target.value })}
                  placeholder="Field of study (e.g. Computer Science)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={educationForm.startDate}
                    onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })}
                    placeholder="Start year (e.g. 2019)"
                    className="min-w-0 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                  />
                  <input
                    value={educationForm.endDate}
                    onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })}
                    placeholder="End year (e.g. 2023)"
                    className="min-w-0 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                  />
                </div>
                <input
                  value={educationForm.location}
                  onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })}
                  placeholder="Location (optional)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-500 outline-none focus:border-blue-500"
                />
                <button type="submit" className="flex items-center gap-1 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">
                  <Plus className="h-4 w-4" /> Add Education
                </button>
              </form>
            )}

            {(educationEditing ? educationDraft : education).length > 0 ? (
              (educationEditing ? educationDraft : education).map((item: any, index: number) => (
                <div key={item.id || `${item.institution || item.school || "education"}-${index}`} className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1A1A2E] text-[11px] font-bold text-white">
                    {(item.institution || item.school || "ED").slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#1A1A2E]">{item.institution || item.school || "Institution not added"}</p>
                    <p className="text-[13px] text-[#687995]">{[item.degree, item.field || item.major].filter(Boolean).join(" in ") || item.qualification || ""}</p>
                    <p className="text-[12px] text-[#687995]">
                      {[
                        item.period || [item.startDate, item.endDate].filter(Boolean).join(" – "),
                        item.location,
                      ].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                  {educationEditing && (
                    <button
                      type="button"
                      aria-label={`Remove education at ${item.institution || item.school || "institution"}`}
                      onClick={() => setEducationDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      className="text-lg text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-[#687995]">
                No education added yet. Add your education to show students your academic background.
              </p>
            )}
          </div>

        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Pencil, label: isProfileEditMode ? "Done Editing" : "Edit Profile", primary: true },
                { icon: Share2, label: "Share Profile" },
                { icon: ExternalLink, label: "View Public Profile" },
                { icon: Download, label: "Download Resume" },
              ].map(({ icon: Icon, label, primary }) => (
                <button
                  key={label}
                  type="button"
                  onClick={async () => {
                    if (label === "Edit Profile" || label === "Done Editing") {
                      setIsProfileEditMode(v => !v)
                      return
                    }

                    if (label === "Download Resume") {
                      if (!resume?.path) {
                        setResumeError("Please upload a resume first.")
                        return
                      }

                      const currentUser = auth.currentUser
                      if (!currentUser || currentUser.uid !== user?.uid) {
                        setResumeError("Please log in again to download your resume.")
                        return
                      }

                      setResumeError("")
                      try {
                        const token = await currentUser.getIdToken()
                        const response = await fetch("/api/resume/download", {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ path: resume.path }),
                        })

                        const result = await response.json()
                        if (!response.ok) {
                          throw new Error(result.error || "Download failed.")
                        }

                        const link = document.createElement("a")
                        link.href = result.url
                        link.download = resume.name || "resume.pdf"
                        document.body.appendChild(link)
                        link.click()
                        link.remove()
                      } catch (error) {
                        console.error("Mentor resume download failed:", error)
                        setResumeError(error instanceof Error ? error.message : "Couldn't download your resume.")
                      }
                      return
                    }

                    if (label === "Share Profile") {
                      if (!user?.uid) {
                        alert("Please log in to share your public profile.")
                        return
                      }

                      const publicProfileUrl = `${window.location.origin}/mentor/${encodeURIComponent(user.uid)}`

                      if (typeof navigator !== "undefined" && navigator.share) {
                        try {
                          await navigator.share({
                            title: `${user?.fullName || user?.displayName || "Mentor"} - Public Profile`,
                            url: publicProfileUrl,
                          })
                        } catch (error) {
                          if (!(error instanceof Error && error.name === "AbortError")) {
                            console.error("Share profile failed:", error)
                            alert("Couldn't share your public profile.")
                          }
                        }
                      } else {
                        try {
                          await navigator.clipboard.writeText(publicProfileUrl)
                          alert("Public profile link copied.")
                        } catch (error) {
                          console.error("Copy public profile link failed:", error)
                          alert("Couldn't copy the public profile link.")
                        }
                      }
                      return
                    }

                    if (label === "View Public Profile") {
                      if (user?.uid) {
                        router.push(`/mentor/${encodeURIComponent(user.uid)}`)
                      } else {
                        alert("Please log in to view your public profile.")
                      }
                    }
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${primary ? "bg-[#EEF3FF] text-[#2563EB]" : "border border-[#E0E0E0] text-[#555] hover:border-[#2563EB] hover:text-[#2563EB]"}`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Languages Known</h3>
              {isProfileEditMode && (
                <button type="button" onClick={() => { setShowLanguagePicker(v => !v); setLanguageError("") }}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]">
                  <Plus className="h-3.5 w-3.5" /> Add Language
                </button>
              )}
            </div>

            {showLanguagePicker && (
              <div className="mb-4 space-y-3">
                <input value={languageQuery} onChange={e => setLanguageQuery(e.target.value)}
                  placeholder="Search languages..." autoFocus
                  className="w-full rounded-xl border border-[#CBD5E1] px-3 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563EB]" />
                {languageQuery.trim() && (
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E0E0E0]">
                    {languageOptions.filter(l =>
                      l.name.toLowerCase().includes(languageQuery.trim().toLowerCase()) &&
                      !languages.some(x => x.name.toLowerCase() === l.name.toLowerCase())
                    ).slice(0, 12).map(l => (
                      <button key={l.name} type="button" onClick={() => {
                        setPendingLanguage(l)
                        setPendingLevel("Intermediate")
                        setLanguageQuery("")
                        setLanguageError("")
                      }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#1F2937] hover:bg-[#DBEAFE]">
                        <span>{l.flag}</span><span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {languageQuery.trim() && !languageOptions.some(l =>
                  l.name.toLowerCase() === languageQuery.trim().toLowerCase()
                ) && !languages.some(l => l.name.toLowerCase() === languageQuery.trim().toLowerCase()) && (
                  <button type="button" onClick={() => {
                    setPendingLanguage({ name: languageQuery.trim(), flag: "🌐" })
                    setPendingLevel("Intermediate")
                    setLanguageQuery("")
                    setLanguageError("")
                  }} className="text-sm font-medium text-[#2563EB]">
                    Add custom language: “{languageQuery.trim()}”
                  </button>
                )}
                {pendingLanguage && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <p className="mb-2 text-sm font-semibold text-[#1F2937]">
                      {pendingLanguage.flag} {pendingLanguage.name} — proficiency
                    </p>
                    <select value={pendingLevel} onChange={e => setPendingLevel(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#1F2937]">
                      {languageLevels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => addLanguage(pendingLanguage, pendingLevel)}
                        disabled={isSavingLanguages}
                        className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {isSavingLanguages ? "Saving..." : "Add"}
                      </button>
                      <button type="button" onClick={() => setPendingLanguage(null)}
                        className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#374151]">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {languageError && <p className="text-sm text-red-600">{languageError}</p>}
              </div>
            )}

            {languages.length === 0 ? (
              <p className="text-sm text-[#687995]">No languages added yet. Select Add Language to get started.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {languages.map(language => (
                  <div key={language.name} className="flex min-w-0 items-center gap-2">
                    <span className="text-[20px]">{language.flag || "🌐"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#1A1A2E]">{language.name}</p>
                      {isProfileEditMode && editingLanguage === language.name ? (
                        <select value={language.level || "Intermediate"}
                          onChange={e => updateLanguageLevel(language.name, e.target.value)}
                          disabled={isSavingLanguages}
                          className="mt-1 rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-[11px] text-[#374151]">
                          {languageLevels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                      ) : (
                        <p className="text-[11px] text-[#ABABAB]">{language.level || "Not specified"}</p>
                      )}
                    </div>
                    {isProfileEditMode && <button type="button" onClick={() => setEditingLanguage(editingLanguage === language.name ? null : language.name)}
                      className="text-[11px] font-medium text-[#2563EB]">
                      {editingLanguage === language.name ? "Done" : "Edit"}
                    </button>}
                    {isProfileEditMode && <button type="button" onClick={() => removeLanguage(language.name)}
                      disabled={isSavingLanguages}
                      aria-label={`Remove ${language.name}`}
                      className="text-sm text-red-500 disabled:opacity-50">×</button>}
                  </div>
                ))}
              </div>
            )}
            {languageError && !showLanguagePicker && <p className="mt-3 text-sm text-red-600">{languageError}</p>}
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Recent Activity</h3>
              <button type="button" onClick={() => router.push("/profile/activity")}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {activityLoading ? (
                <p className="text-sm text-[#687995]">Loading activity...</p>
              ) : activityItems.length === 0 ? (
                <p className="text-sm text-[#687995]">No recent activity yet.</p>
              ) : (
                (showAllActivity ? activityItems : activityItems.slice(0, 4)).map(
                  ({ id, icon: Icon, color, iconColor, title, sub, date }) => (
                    <div key={id} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: color }}>
                        <Icon className="h-4 w-4" style={{ color: iconColor }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[13px] font-semibold text-[#1A1A2E]">{title}</p>
                        <p className="text-[12px] text-[#687995]">{sub}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-[#ABABAB]">
                        {date ? date.toLocaleDateString() : "Date unavailable"}
                      </span>
                    </div>
                  )
                )
              )}
            </div>

            {!activityLoading && activityItems.length > 4 && (
              <button type="button" onClick={() => setShowAllActivity(v => !v)}
                className="mt-4 text-[12px] font-semibold text-[#2563EB]">
                {showAllActivity ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">My Resume</h3>
              <button type="button" onClick={() => { setIsEditingResume(v => !v); setResumeError("") }}
                className="text-[12px] font-semibold text-[#2563EB]">
                {isEditingResume ? "Close" : resume ? "Replace / Edit" : "Add Resume"}
              </button>
            </div>

            {resume ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#E0E0E0] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE]">
                  <FileText className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1A1A2E]">{resume.name}</p>
                  <p className="text-[11px] text-[#64748B]">
                    {typeof resume.size === "number" ? `${(resume.size / (1024 * 1024)).toFixed(2)} MB` : "PDF"}
                    {resume.updatedAt ? ` · Updated ${new Date(resume.updatedAt).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => void openResume()} disabled={resumeBusy}
                  className="text-[12px] font-semibold text-[#2563EB] disabled:opacity-50">View</button>
                <button type="button" onClick={() => setShowDeleteResumePopup(true)} disabled={resumeBusy}
                  className="text-[12px] font-semibold text-red-600 disabled:opacity-50">Remove</button>
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">No resume uploaded yet.</p>
            )}

            {isEditingResume && (
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-[#1F2937]">
                  Choose resume (PDF, maximum 5 MB)
                  <input type="file" accept=".pdf,application/pdf" disabled={resumeBusy}
                    onChange={event => {
                      const input = event.currentTarget
                      const file = input.files?.[0]
                      void uploadResume(file)
                      input.value = ""
                    }}
                    className="mt-2 block w-full rounded-xl border border-[#CBD5E1] bg-white p-2 text-sm text-[#1F2937] file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700" />
                </label>
                {resumeBusy && (
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-[#475569]">
                      <span>Processing resume...</span><span>{resumeProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                      <div className="h-full rounded-full bg-[#2563EB] transition-all"
                        style={{ width: `${resumeProgress}%` }} />
                    </div>
                  </div>
                )}
                <p className="text-xs text-[#64748B]">PDF only. Maximum size: 5 MB.</p>
              </div>
            )}

            {resumeError && <p role="alert" className="mt-3 text-sm text-red-600">{resumeError}</p>}

            {showDeleteResumePopup && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                <div role="dialog" aria-modal="true" aria-labelledby="mentor-delete-resume-title"
                  className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                  <h3 id="mentor-delete-resume-title" className="text-center text-lg font-bold text-[#1A1A2E]">
                    Remove Resume?
                  </h3>
                  <p className="mt-2 text-center text-sm text-[#64748B]">
                    Are you sure you want to remove your resume?
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => setShowDeleteResumePopup(false)}
                      disabled={resumeBusy}
                      className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#374151] disabled:opacity-50">
                      Cancel
                    </button>
                    <button type="button" onClick={async () => {
                      await removeResume()
                      if (!resumeError) setShowDeleteResumePopup(false)
                    }} disabled={resumeBusy}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                      {resumeBusy ? "Removing..." : "Remove Resume"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
