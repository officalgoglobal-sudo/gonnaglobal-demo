"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  MapPin, Mail, Link2, Camera, Share2, ChevronDown,
  Pencil, Download, ExternalLink, Plus, CheckCircle2,
  Circle, FileText, Bookmark, CalendarDays, Users,
  ArrowRight
} from "lucide-react"

// ── Student Profile Sub-Component
export default function StudentProfileView({ user }: { user: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Overview")
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
        getDoc(doc(db, "recentlyViewedOpportunities", uid)),
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

      if (viewedSnap.exists()) {
        const viewed = viewedSnap.data()
        rows.push({
          id: "recently-viewed-" + viewedSnap.id,
          kind: "viewed",
          title: "Viewed an opportunity",
          sub: viewed.title || "Opportunity",
          date: viewed.viewedAt?.toDate?.() || null,
          icon: ExternalLink,
          color: "#EDE9FE",
          iconColor: "#7C3AED",
        })
      }

      rows.sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0))
      setActivityItems(rows)
    } catch (error) {
      console.error("Could not load recent activity:", error)
      setActivityItems([])
    } finally {
      setActivityLoading(false)
    }
  }

  const [settingsBusy, setSettingsBusy] = useState(false)
  const [settingsError, setSettingsError] = useState("")
  const [showDeletePhotoConfirm, setShowDeletePhotoConfirm] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || user?.displayName || "")
  const [homeCountry, setHomeCountry] = useState(user?.homeCountry || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || user?.linkedin || "")
  const [instagramUrl, setInstagramUrl] = useState(user?.instagramUrl || user?.instagram || "")
  const [alternateEmail, setAlternateEmail] = useState(user?.alternateEmail || "")

  const defaultAboutMe = ""
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || defaultAboutMe)
  const [aboutMeDraft, setAboutMeDraft] = useState(user?.aboutMe || defaultAboutMe)
const [isProfileEditMode, setIsProfileEditMode] = useState(false)
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false)
  const [isSavingAboutMe, setIsSavingAboutMe] = useState(false)
  const [aboutMeError, setAboutMeError] = useState("")
  const defaultEducation = [{
    id: "initial-education", institution: "MIT Jaipur",
    degree: "B.Tech", field: "Information Technology",
    startYear: "2024", endYear: "2028",
    location: "Jaipur, India", grade: "8.5", description: "",
  }]
  const [education, setEducation] = useState<any[]>(
    Array.isArray(user?.education) ? user.education : defaultEducation
  )
  const [educationDraft, setEducationDraft] = useState<any[]>([])
  const [isEditingEducation, setIsEditingEducation] = useState(false)
  const [isSavingEducation, setIsSavingEducation] = useState(false)
  const [educationError, setEducationError] = useState("")

  function startEducationEdit() {
    setEducationDraft(education.map(item => ({ ...item })))
    setEducationError("")
    setIsEditingEducation(true)
  }

  function updateEducationField(index: number, field: string, value: string) {
    setEducationDraft(current => current.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  function addEducationEntry() {
    setEducationDraft(current => [...current, {
      id: `education-${Date.now()}`, institution: "", degree: "",
      field: "", startYear: "", endYear: "", location: "",
      grade: "", description: "",
    }])
  }

  function removeEducationEntry(index: number) {
    setEducationDraft(current => current.filter((_, i) => i !== index))
  }

  async function saveEducation() {
    if (!user?.uid) {
      setEducationError("Please log in again to save your education.")
      return
    }
    const cleaned = educationDraft.map(item => ({
      id: item.id || `education-${Date.now()}`,
      institution: String(item.institution || "").trim(),
      degree: String(item.degree || "").trim(),
      field: String(item.field || "").trim(),
      startYear: String(item.startYear || "").trim(),
      endYear: String(item.endYear || "").trim(),
      location: String(item.location || "").trim(),
      grade: String(item.grade || "").trim(),
      description: String(item.description || "").trim(),
    }))
    if (cleaned.some(item => !item.institution || !item.degree)) {
      setEducationError("Institution and degree are required.")
      return
    }
    setIsSavingEducation(true)
    setEducationError("")
    try {
      await updateDoc(doc(db, "users", user.uid), { education: cleaned })
      setEducation(cleaned)
      setIsEditingEducation(false)
    } catch (error) {
      console.error("Failed to save education:", error)
      setEducationError("Couldn't save education. Please try again.")
    } finally {
      setIsSavingEducation(false)
    }
  }

  const [interests, setInterests] = useState<string[]>(
    Array.isArray(user?.interests) ? user.interests : [
      "Artificial Intelligence",
      "Machine Learning",
      "Web Development",
      "Data Science",
      "Study Abroad",
      "Entrepreneurship",
    ]
  )
  const [interestQuery, setInterestQuery] = useState("")
  const [showInterestInput, setShowInterestInput] = useState(false)
  const [isSavingInterests, setIsSavingInterests] = useState(false)
  const [interestError, setInterestError] = useState("")
  const defaultSkills = ["Python", "Java", "Next.js", "React", "SQL", "Problem Solving", "Git", "Figma"]
  const [skills, setSkills] = useState<string[]>(
    Array.isArray(user?.skills) ? user.skills : defaultSkills
  )
  const [skillQuery, setSkillQuery] = useState("")
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [isSavingSkills, setIsSavingSkills] = useState(false)
  const [skillError, setSkillError] = useState("")
  const skillSuggestions = [
    "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "HTML", "CSS",
    "SQL", "React", "Next.js", "Node.js", "Express.js", "Angular", "Vue.js",
    "Tailwind CSS", "Frontend Development", "Backend Development", "Full Stack Development",
    "Mobile App Development", "React Native", "Flutter", "Firebase", "PostgreSQL",
    "MySQL", "MongoDB", "Prisma", "Git", "GitHub", "Docker", "Kubernetes", "AWS",
    "Cloud Computing", "DevOps", "REST APIs", "GraphQL", "Machine Learning",
    "Artificial Intelligence", "Deep Learning", "Data Science", "Data Analytics",
    "Pandas", "NumPy", "TensorFlow", "PyTorch", "Cybersecurity", "Blockchain",
    "Algorithms", "Data Structures", "Problem Solving", "Object-Oriented Programming",
    "Software Engineering", "Software Testing", "Debugging", "System Design",
    "UI/UX Design", "Figma", "Graphic Design", "Communication", "Leadership",
    "Teamwork", "Public Speaking", "Research", "Critical Thinking", "Time Management",
    "Entrepreneurship", "Digital Marketing", "Excel", "Power BI", "Statistics", "Agile", "Scrum",
  ]

  async function persistSkills(nextSkills: string[]) {
    if (!user?.uid) {
      setSkillError("Please log in again to save your skills.")
      return
    }
    setIsSavingSkills(true)
    setSkillError("")
    try {
      await updateDoc(doc(db, "users", user.uid), { skills: nextSkills })
      setSkills(nextSkills)
    } catch (error) {
      console.error("Failed to save skills:", error)
      setSkillError("Couldn't save skills. Please try again.")
    } finally {
      setIsSavingSkills(false)
    }
  }

  async function addSkill(value: string) {
    const cleaned = value.trim().replace(/\s+/g, " ")
    if (!cleaned || skills.some(item => item.toLowerCase() === cleaned.toLowerCase())) {
      setSkillQuery("")
      return
    }
    await persistSkills([...skills, cleaned])
    setSkillQuery("")
    setShowSkillInput(true)
  }

  async function removeSkill(value: string) {
    await persistSkills(skills.filter(item => item !== value))
  }


  const interestSuggestions = [
    "Artificial Intelligence", "Machine Learning", "Deep Learning",
    "Data Science", "Data Analytics", "Web Development", "Frontend Development",
    "Backend Development", "Full Stack Development", "Mobile App Development",
    "Cybersecurity", "Cloud Computing", "DevOps", "Blockchain", "Web3",
    "Internet of Things", "Robotics", "Computer Vision", "Natural Language Processing",
    "Software Engineering", "Programming", "Python", "Java", "JavaScript",
    "TypeScript", "C++", "C Programming", "React", "Next.js", "Node.js",
    "UI/UX Design", "Graphic Design", "Product Design", "Figma",
    "Product Management", "Entrepreneurship", "Startups", "Business",
    "Marketing", "Digital Marketing", "Finance", "Economics", "Consulting",
    "Research", "Academic Research", "Higher Education", "Study Abroad",
    "Scholarships", "International Education", "Internships", "Career Development",
    "Leadership", "Public Speaking", "Communication", "Volunteering",
    "Social Impact", "Sustainability", "Environmental Science", "Biotechnology",
    "Healthcare", "Psychology", "Law", "Design", "Photography", "Writing",
    "Content Creation", "Video Editing", "Gaming", "Game Development",
    "Music", "Languages", "Travel", "Sports", "Mathematics", "Physics",
    "Chemistry", "Electronics", "Mechanical Engineering", "Civil Engineering",
    "Electrical Engineering", "Information Technology", "Open Source",
    "Competitive Programming", "Algorithms", "Problem Solving",
  ]

  async function persistInterests(nextInterests: string[]) {
    if (!user?.uid) {
      setInterestError("Please log in again to save your interests.")
      return false
    }

    setIsSavingInterests(true)
    setInterestError("")
    try {
      await updateDoc(doc(db, "users", user.uid), { interests: nextInterests })
      setInterests(nextInterests)
      return true
    } catch (error) {
      console.error("Failed to save interests:", error)
      setInterestError("Couldn't save interests. Please try again.")
      return false
    } finally {
      setIsSavingInterests(false)
    }
  }

  async function addInterest(value: string) {
    const cleaned = value.trim().replace(/\\s+/g, " ")
    if (!cleaned) return
    if (interests.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
      setInterestError("That interest is already added.")
      return
    }
    if (interests.length >= 30) {
      setInterestError("You can add up to 30 interests.")
      return
    }

    const next = [...interests, cleaned]
    const saved = await persistInterests(next)
    if (saved) {
      setInterestQuery("")
      setShowInterestInput(false)
    }
  }

  async function removeInterest(value: string) {
    await persistInterests(interests.filter((item) => item !== value))
  }


  async function saveAboutMe() {
    if (!user?.uid) {
      setAboutMeError("Please log in again to save your changes.")
      return
    }

    setIsSavingAboutMe(true)
    setAboutMeError("")

    try {
      const updatedText = aboutMeDraft.trim()
      await updateDoc(doc(db, "users", user.uid), { aboutMe: updatedText })
      setAboutMe(updatedText)
      setAboutMeDraft(updatedText)
      setIsEditingAboutMe(false)
    } catch (error) {
      console.error("Failed to save About Me:", error)
      setAboutMeError("Couldn't save your changes. Please try again.")
    } finally {
      setIsSavingAboutMe(false)
    }
  }



  const defaultCareerGoals = "I aim to pursue higher studies in AI and work on real-world applications that create social impact. I'm also interested in global internships and research opportunities."
  const [careerGoals, setCareerGoals] = useState<string>(user?.careerGoals || defaultCareerGoals)
  const [careerGoalsDraft, setCareerGoalsDraft] = useState<string>(user?.careerGoals || defaultCareerGoals)
  const [isEditingCareerGoals, setIsEditingCareerGoals] = useState(false)
  const [isSavingCareerGoals, setIsSavingCareerGoals] = useState(false)
  const [careerGoalsError, setCareerGoalsError] = useState("")

  async function saveCareerGoals() {
    if (!user?.uid) {
      setCareerGoalsError("Please log in again to save your changes.")
      return
    }
    setIsSavingCareerGoals(true)
    setCareerGoalsError("")
    try {
      const updatedText = careerGoalsDraft.trim()
      await updateDoc(doc(db, "users", user.uid), { careerGoals: updatedText })
      setCareerGoals(updatedText)
      setCareerGoalsDraft(updatedText)
      setIsEditingCareerGoals(false)
    } catch (error) {
      console.error("Failed to save Career Goals:", error)
      setCareerGoalsError("Couldn't save your career goals. Please try again.")
    } finally {
      setIsSavingCareerGoals(false)
    }
  }


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
  const defaultLanguages = [
    {name:"English",flag:"🇬🇧",level:"Native"},
    {name:"Hindi",flag:"🇮🇳",level:"Native"},
    {name:"Spanish",flag:"🇪🇸",level:"Intermediate"},
    {name:"French",flag:"🇫🇷",level:"Beginner"}
  ]
  const [languages, setLanguages] = useState<any[]>(
    Array.isArray(user?.languages) ? user.languages : defaultLanguages
  )
  const [languageQuery, setLanguageQuery] = useState("")
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)
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
    const next = languages.map(language => language.name === name ? { ...language, level } : language)
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

      // Clean up the previous Supabase file after the new resume is saved.
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

    // Open a tab immediately to avoid browser popup blockers.
    const tab = window.open("about:blank", "_blank")
    if (!tab) {
      setResumeError("Please allow pop-ups to view your resume.")
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
      if (!response.ok) throw new Error(result.error || "Couldn't open the resume.")
      tab.location.href = result.url
    } catch (error) {
      tab.close()
      console.error("Resume viewing failed:", error)
      setResumeError(error instanceof Error ? error.message : "Couldn't open the resume.")
    }
  }

  async function removeResume() {
    if (!user?.uid || !resume?.path) {
      setResumeError("Resume details are missing. Please upload the PDF again.")
      return
    }


    const currentUser = auth.currentUser
    if (!currentUser || currentUser.uid !== user.uid) {
      setResumeError("Please log in again to remove your resume.")
      return
    }

    setResumeBusy(true)
    setResumeError("")

    try {
      const token = await currentUser.getIdToken()
      const response = await fetch("/api/resume/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: resume.path }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Couldn't remove the resume.")

      await updateDoc(doc(db, "users", currentUser.uid), { resume: null })
      setResume(null)
      setIsEditingResume(false)
    } catch (error) {
      console.error("Resume removal failed:", error)
      setResumeError(error instanceof Error ? error.message : "Couldn't remove the resume.")
    } finally {
      setResumeBusy(false)
    }
  }

  const completionItems = [
    { label: "Basic Information", done: Boolean(
      (user?.fullName || user?.displayName) &&
      (user?.aboutMe || aboutMeDraft || aboutMe).trim() &&
      (user?.homeCountry || "").trim() &&
      (user?.gender || "").trim() &&
      (user?.phoneNumber || "").trim()
    ) },
    { label: "Education Details", done: education.some(item => Boolean(item.institution?.trim() && item.degree?.trim())) },
    { label: `Interests (${Math.min(interests.length, 3)}/3)`, done: interests.length >= 3 },
    { label: `Languages (${Math.min(languages.length, 2)}/2)`, done: languages.length >= 2 },
    { label: "Add Skills", done: skills.length > 0 },
    { label: "Add Resume", done: Boolean(user?.resumeURL || user?.resumeUrl || user?.resume || user?.resumeURL) },
  ]
  const completedCount = completionItems.filter(item => item.done).length
  const pct = Math.round((completedCount / completionItems.length) * 100)

  return (
    <div>
      {/* Cover photo */}
      <div className="relative h-[200px] overflow-hidden rounded-none bg-gradient-to-r from-sky-200 via-blue-300 to-blue-400 lg:rounded-t-none">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent" />
        {/* Overlay text */}
        <div className="absolute left-1/2 top-8 -translate-x-1/4 text-center">
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Explore</p>
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Learn</p>
          <p className="text-[22px] font-bold text-white drop-shadow" style={{ fontFamily: "Georgia, serif" }}>Grow</p>
        </div>
        <div className="absolute right-16 top-8 text-right text-white drop-shadow">
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Global Opportunities</p>
          <p className="text-[20px] font-bold" style={{ fontFamily: "Georgia, serif" }}>Brighter Futures</p>
          <svg viewBox="0 0 80 20" className="ml-auto w-16 mt-1">
            <path d="M5 15 Q40 3 75 10" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M65 6L75 10L68 17" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>

      </div>

      {/* Profile info row */}
      <div className="relative bg-white px-6 pb-0 pt-0 border-b border-[#EBEBEB]">
        {/* Avatar */}
        <div className="absolute -top-14 left-6">
          <div className="relative h-[108px] w-[108px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            <img src={user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"} alt="Avatar" className="h-full w-full object-cover" />
            {!user?.photoURL && (
              <button type="button" className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
                <Camera className="h-3.5 w-3.5 text-[#555]" />
              </button>
            )}
          </div>
        </div>

        <div className="ml-[130px] flex flex-wrap items-start justify-between gap-4 pb-4 pt-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-bold text-[#1A1A2E]">{user?.fullName || user?.displayName || "Student"}</h1>
              <span className="text-[#2563EB]">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 15l-6.2 4.3 2.4-7.4L0 7.4h7.6z"/></svg>
              </span>
            </div>
            {education.some(item => String(item.degree || "").trim() && String(item.institution || "").trim()) && (
              <p className="text-[13.5px] text-[#687995]">
                {education
                  .filter(item => String(item.degree || "").trim() && String(item.institution || "").trim())
                  .map(item => [item.degree, item.field, item.institution].filter(value => String(value || "").trim()).join(" "))
                  .join(" | ")}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#687995]">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user?.homeCountry || "Add your country in Settings"}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user?.email || "No email provided"}</span>
              {(user?.linkedinUrl || user?.linkedin)?.trim() && (
                <a
                  href={(user.linkedinUrl || user.linkedin).trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#2563EB] hover:underline"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center justify-end gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Student
            </span>
          </div>
        </div>

        {/* Tabs */}

        <div className="flex gap-6 border-b border-[#EBEBEB]">
          {["Overview", "Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-medium transition ${activeTab === tab ? "border-b-2 border-[#2563EB] text-[#2563EB]" : "text-[#687995] hover:text-[#1A1A2E]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Settings" ? (
        <section className="mx-auto w-full max-w-2xl space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1A1A2E]">Profile Settings</h2>
            <p className="mt-1 text-sm text-[#687995]">Manage your profile picture and banner.</p>

            <div className="mt-6 space-y-5">
              <form
                className="space-y-4"
                onSubmit={async event => {
                  event.preventDefault()
                  if (!user?.uid) {
                    setSettingsError("Please log in again.")
                    return
                  }
                  if (!fullName.trim()) {
                    setSettingsError("Full Name is required.")
                    return
                  }
                  if (!homeCountry.trim() || !gender || !phoneNumber.trim()) {
                    setSettingsError("Home Country, Gender, and Phone Number are required.")
                    return
                  }
                  if (alternateEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alternateEmail.trim())) {
                    setSettingsError("Enter a valid alternate email address.")
                    return
                  }
                  const validUrl = (value: string) => {
                    if (!value.trim()) return true
                    try {
                      const url = new URL(value.trim())
                      return url.protocol === "https:" || url.protocol === "http:"
                    } catch {
                      return false
                    }
                  }
                  if (!validUrl(linkedinUrl) || !validUrl(instagramUrl)) {
                    setSettingsError("LinkedIn and Instagram must be valid URLs beginning with https:// or http://.")
                    return
                  }

                  setSettingsBusy(true)
                  setSettingsError("")
                  try {
                    await updateDoc(doc(db, "users", user.uid), {
                      fullName: fullName.trim(),
                      homeCountry: homeCountry.trim(),
                      gender,
                      phoneNumber: phoneNumber.trim(),
                      linkedinUrl: linkedinUrl.trim(),
                      instagramUrl: instagramUrl.trim(),
                      alternateEmail: alternateEmail.trim(),
                      aboutMe: aboutMe.trim(),
                    })
                    setSettingsError("Profile details saved successfully.")
                    window.location.reload()
                  } catch (error) {
                    console.error("Failed to save profile details:", error)
                    setSettingsError("Could not save profile details. Check Firebase permissions and try again.")
                  } finally {
                    setSettingsBusy(false)
                  }
                }}
              >
                <h3 className="text-sm font-bold text-[#1A1A2E]">Personal Information</h3>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Full Name <span className="text-red-600">*</span>
                  <input
                    required
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm"
                  />
                </label>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Home Country <span className="text-red-600">*</span>
                  <input required value={homeCountry} onChange={e => setHomeCountry(e.target.value)}
                    placeholder="e.g. India" disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm" />
                </label>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Gender <span className="text-red-600">*</span>
                  <select required value={gender} onChange={e => setGender(e.target.value)}
                    disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] bg-white p-3 text-sm">
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Phone Number <span className="text-red-600">*</span>
                  <input required type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210" disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm" />
                </label>

                <h3 className="border-t border-[#EBEBEB] pt-4 text-sm font-bold text-[#1A1A2E]">
                  Optional Information
                </h3>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  LinkedIn URL
                  <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile" disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm" />
                </label>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Instagram URL
                  <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/your-profile" disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm" />
                </label>

                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Alternate Email
                  <input type="email" value={alternateEmail} onChange={e => setAlternateEmail(e.target.value)}
                    placeholder="alternate@example.com" disabled={settingsBusy}
                    className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm" />
                </label>

                <button type="submit" disabled={settingsBusy}
                  className="rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50">
                  {settingsBusy ? "Saving..." : "Save Personal Information"}
                </button>
              </form>


              {user?.photoURL && (
                <div className="mb-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.open(user.photoURL, "_blank", "noopener,noreferrer")}
                    className="rounded-full border border-[#E0E0E0] px-5 py-2.5 text-sm font-semibold text-[#2563EB] hover:bg-blue-50"
                  >
                    View Photo
                  </button>
                  <button
                    type="button"
                    disabled={settingsBusy}
                    onClick={() => setShowDeletePhotoConfirm(true)}
                    className="rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete Photo
                  </button>
                </div>
              )}

              {showDeletePhotoConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div role="dialog" aria-modal="true" aria-labelledby="delete-photo-title"
                    className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                    <h3 id="delete-photo-title" className="text-lg font-bold text-[#1A1A2E]">
                      Delete profile picture?
                    </h3>
                    <p className="mt-2 text-sm text-[#687995]">
                      Your profile picture will be removed and the default avatar will be shown.
                    </p>
                    <div className="mt-5 flex justify-end gap-3">
                      <button type="button" disabled={settingsBusy}
                        onClick={() => setShowDeletePhotoConfirm(false)}
                        className="rounded-full border border-[#E0E0E0] px-4 py-2 text-sm font-semibold">
                        Cancel
                      </button>
                      <button type="button" disabled={settingsBusy}
                        onClick={async () => {
                          if (!user?.uid) {
                            setSettingsError("Please log in again.")
                            setShowDeletePhotoConfirm(false)
                            return
                          }
                          setSettingsBusy(true)
                          setSettingsError("")
                          try {
                            await updateDoc(doc(db, "users", user.uid), { photoURL: "" })
                            setShowDeletePhotoConfirm(false)
                            window.location.reload()
                          } catch (error) {
                            console.error(error)
                            setSettingsError("Could not delete profile picture. Please try again.")
                          } finally {
                            setSettingsBusy(false)
                          }
                        }}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        {settingsBusy ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <label className="block text-sm font-semibold text-[#1A1A2E]">
                Add Profile Picture
                <input type="file" accept="image/*" disabled={settingsBusy}
                  className="mt-2 block w-full rounded-xl border border-[#E0E0E0] p-3 text-sm"
                  onChange={async event => {
                    const file = event.currentTarget.files?.[0]
                    event.currentTarget.value = ""
                    if (!file) return
                    if (!user?.uid) { setSettingsError("Please log in again."); return }
                    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
                      setSettingsError("Choose an image smaller than 5 MB."); return
                    }
                    setSettingsBusy(true)
                    setSettingsError("")
                    try {
                      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

                      if (!cloudName || !uploadPreset) {
                        throw new Error("Cloudinary configuration is missing.")
                      }

                      const formData = new FormData()
                      formData.append("file", file)
                      formData.append("upload_preset", uploadPreset)
                      formData.append("folder", "goglobal/profile-images")

                      const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                        { method: "POST", body: formData }
                      )
                      const result = await response.json()

                      if (!response.ok || !result.secure_url) {
                        throw new Error(result.error?.message || "Cloudinary upload failed.")
                      }

                      const url = result.secure_url
                      await updateDoc(doc(db, "users", user.uid), { photoURL: url })
                      window.location.reload()
                    } catch (error) {
                      console.error(error)
                      setSettingsError("Profile picture upload failed. Check Firebase permissions.")
                    } finally { setSettingsBusy(false) }
                  }} />
              </label>

              

              {settingsBusy && <p className="text-sm text-[#2563EB]">Uploading image...</p>}
              {settingsError && <p role="alert" className="text-sm text-red-600">{settingsError}</p>}

              <div className="border-t border-[#EBEBEB] pt-5">
                <button type="button" disabled={settingsBusy}
                  onClick={async () => {
                    try {
                      await signOut(auth)
                      router.replace("/login")
                    } catch (error) {
                      console.error(error)
                      setSettingsError("Logout failed. Please try again.")
                    }
                  }}
                  className="rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
      <>
      {/* BODY */}

      <div className="grid grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[240px_1fr_280px]">

        {/* LEFT — Profile Completion */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Profile Completion</h3>
            {/* Circle */}
            <div className="my-5 flex justify-center">
              <div className="relative h-[110px] w-[110px]">
                <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#F0F0F0" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#2563EB" strokeWidth="10"
                    strokeDasharray={`${(pct / 100) * 301.6} 301.6`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-bold text-[#1A1A2E]">{pct}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#687995] mb-4">{completedCount}/{completionItems.length} sections completed</p>
            <div className="space-y-2.5">
              {completionItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[13px]">
                  {item.done
                    ? <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                    : <Circle className="h-4 w-4 text-[#D0D0D0] shrink-0" />}
                  <span className={item.done ? "text-[#1A1A2E]" : "text-[#ABABAB]"}>{item.label}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsProfileEditMode(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition"
            >
              Complete Your Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="space-y-5">
          {/* About Me */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">About Me</h3>
             {isProfileEditMode && (
  <button
    type="button"
    aria-label="Edit About Me"
    onClick={() => {
      setAboutMeDraft(aboutMe)
      setAboutMeError("")
      setIsEditingAboutMe(true)
    }}
  >
                <Pencil className="h-4 w-4 text-[#64748B] hover:text-[#2563EB]" />
              </button>
)}
            </div>
            {isEditingAboutMe ? (
              <div className="space-y-3">
                <textarea
                  value={aboutMeDraft}
                  onChange={(event) => setAboutMeDraft(event.target.value)}
                  maxLength={1000}
                  rows={5}
                  aria-label="About Me text"
                  className="w-full resize-y rounded-xl border border-[#D7DCE5] p-3 text-[13.5px] leading-[1.7] text-[#1A1A2E] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  placeholder="Tell people about yourself..."
                />
                <p className="text-right text-xs font-medium text-[#475569]">{aboutMeDraft.length}/1000</p>
                {aboutMeError && <p role="alert" className="text-sm text-red-600">{aboutMeError}</p>}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveAboutMe}
                    disabled={isSavingAboutMe}
                    className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isSavingAboutMe ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAboutMeDraft(aboutMe)
                      setAboutMeError("")
                      setIsEditingAboutMe(false)
                    }}
                    disabled={isSavingAboutMe}
                    className="rounded-full border border-[#E0E0E0] px-4 py-2 text-sm font-semibold text-[#555] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-[13.5px] leading-[1.7] text-[#687995]">
                {aboutMe || "Tell people about yourself."}
              </p>
            )}

          </div>

          {/* Interests */}
                      <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#1A1A2E]">My Interests</h3>
                {isProfileEditMode && (
<button
                  type="button"
                  onClick={() => setShowInterestInput(true)}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Interest
                </button>
)}
              </div>

              {isProfileEditMode && showInterestInput && (
                <div className="relative mb-4">
                  <input
                    value={interestQuery}
                    onChange={(event) => setInterestQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        addInterest(interestQuery)
                      }
                      if (event.key === "Escape") {
                        setShowInterestInput(false)
                        setInterestQuery("")
                      }
                    }}
                    autoFocus
                    placeholder="Search interests or type your own..."
                    className="w-full rounded-xl border border-[#D7DCE5] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />

                  {interestQuery.trim() && (
                    <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E0E0E0] bg-white p-1 shadow-lg">
                      {interestSuggestions
                        .filter((item) =>
                          item.toLowerCase().includes(interestQuery.trim().toLowerCase()) &&
                          !interests.some((existing) => existing.toLowerCase() === item.toLowerCase())
                        )
                        .slice(0, 8)
                        .map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => addInterest(item)}
                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#1A1A2E] hover:bg-[#EEF3FF]"
                          >
                            {item}
                          </button>
                        ))}

                      {!interests.some((existing) => existing.toLowerCase() === interestQuery.trim().toLowerCase()) && (
                        <button
                          type="button"
                          onClick={() => addInterest(interestQuery)}
                          className="block w-full rounded-lg border-t border-[#F0F0F0] px-3 py-2 text-left text-sm font-medium text-[#2563EB] hover:bg-[#EEF3FF]"
                        >
                          + Add "{interestQuery.trim()}" as a custom interest
                        </button>
                      )}
                    </div>
                  )}

                  <p className="mt-1 text-xs font-medium text-[#475569]">Choose a suggestion or press Enter to add your own.</p>
                  {interestError && <p role="alert" className="mt-2 text-sm text-red-600">{interestError}</p>}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12.5px] text-[#555]"
                  >
                    {tag}
                    {isProfileEditMode && (
<button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={() => removeInterest(tag)}
                      className="text-[#ABABAB] hover:text-red-500"
                    >
                      ×
                    </button>
)}
                  </span>
                ))}
              </div>

              {isSavingInterests && <p className="mt-3 text-xs font-medium text-[#475569]">Saving interests...</p>}
              {interestError && !showInterestInput && <p role="alert" className="mt-2 text-sm text-red-600">{interestError}</p>}
            </div>

          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Education</h3>
              {isProfileEditMode && (
<button type="button" onClick={startEducationEdit} aria-label="Edit education"
                className="text-[#64748B] hover:text-[#2563EB]">
                <Pencil className="h-4 w-4" />
              </button>
)}
            </div>
            {isEditingEducation ? (
              <div className="space-y-4">
                {educationDraft.map((item, index) => (
                  <div key={item.id || index} className="space-y-3 rounded-xl border border-[#E5E7EB] p-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold">Education {index + 1}</p>
                      <button type="button" onClick={() => removeEducationEntry(index)}
                        className="text-xs text-red-600">Remove</button>
                    </div>
                    {[
                      ["institution", "School / College / University *"],
                      ["degree", "Degree *"], ["field", "Field of study"],
                      ["startYear", "Start year"], ["endYear", "End year / expected"],
                      ["location", "Location"], ["grade", "Grade / CGPA"],
                    ].map(([field, label]) => (
                      <label key={field} className="block space-y-1">
                        <span className="text-xs font-medium text-[#475569]">{label}</span>
                        <input value={item[field] || ""}
                          onChange={event => updateEducationField(index, field, event.target.value)}
                          placeholder={label.replace(" *", "")}
                          className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#1F2937] placeholder:text-[#64748B] outline-none focus:border-[#2563EB]" />
                      </label>
                    ))}
                    <label className="block space-y-1">
                      <span className="text-xs font-medium text-[#475569]">Description</span>
                      <textarea rows={3} value={item.description || ""}
                        onChange={event => updateEducationField(index, "description", event.target.value)}
                        placeholder="Activities, achievements, coursework..."
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#1F2937] placeholder:text-[#64748B] outline-none focus:border-[#2563EB]" />
                    </label>
                  </div>
                ))}
                {isProfileEditMode && (
<button type="button" onClick={addEducationEntry}
                  className="flex items-center gap-1 text-sm font-semibold text-[#2563EB]">
                  <Plus className="h-4 w-4" /> Add education
                </button>
)}
                {educationError && <p role="alert" className="text-sm text-red-600">{educationError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={saveEducation} disabled={isSavingEducation}
                    className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    {isSavingEducation ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => {
                    setEducationDraft([])
                    setEducationError("")
                    setIsEditingEducation(false)
                  }} disabled={isSavingEducation}
                    className="rounded-full border border-[#E0E0E0] px-4 py-2 text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {education.map((item, index) => (
                  <div key={item.id || index} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1A1A2E] text-xs font-bold text-white">
                      {(item.institution || "ED").split(/\s+/).map((word: string) => word[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#1A1A2E]">{item.institution}</p>
                      <p className="text-[13px] text-[#475569]">
                        {[item.degree, item.field].filter(Boolean).join(" in ")}
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        {[item.startYear && item.endYear ? `${item.startYear} – ${item.endYear}` : item.startYear || item.endYear, item.location].filter(Boolean).join(" | ")}
                      </p>
                      {item.grade && <p className="mt-2 text-xs text-[#555]">Grade / CGPA: {item.grade}</p>}
                      {item.description && <p className="mt-2 whitespace-pre-wrap text-[13px] text-[#475569]">{item.description}</p>}
                    </div>
                  </div>
                ))}
                {education.length === 0 && <p className="text-sm text-[#687995]">No education added yet.</p>}
                {isProfileEditMode && (
<button type="button" onClick={startEducationEdit}
                  className="flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
                  <Plus className="h-3.5 w-3.5" /> Add education
                </button>
)}
              </div>
            )}
          </div>

{/* Skills */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Skills</h3>
              {isProfileEditMode && (
<button type="button" onClick={() => setShowSkillInput(v => !v)}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]">
                <Plus className="h-3.5 w-3.5" /> {showSkillInput ? "Close" : "Add Skill"}
              </button>
)}
            </div>
            {isProfileEditMode && showSkillInput && (
              <div className="relative mb-4">
                <input value={skillQuery}
                  onChange={event => setSkillQuery(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && skillQuery.trim()) {
                      event.preventDefault()
                      void addSkill(skillQuery)
                    }
                  }}
                  placeholder="Search skills or type a custom skill..."
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#64748B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
                {skillQuery.trim() && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E0E0E0] bg-white p-1 shadow-lg">
                    {skillSuggestions.filter(item =>
                      item.toLowerCase().includes(skillQuery.trim().toLowerCase()) &&
                      !skills.some(existing => existing.toLowerCase() === item.toLowerCase())
                    ).slice(0, 8).map(item => (
                      <button type="button" key={item} onClick={() => void addSkill(item)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#1A1A2E] hover:bg-[#EEF3FF]">
                        {item}
                      </button>
                    ))}
                    {!skills.some(item => item.toLowerCase() === skillQuery.trim().toLowerCase()) && (
                      <button type="button" onClick={() => void addSkill(skillQuery)}
                        className="block w-full rounded-lg border-t border-[#F0F0F0] px-3 py-2 text-left text-sm font-medium text-[#2563EB] hover:bg-[#EEF3FF]">
                        + Add "{skillQuery.trim()}" as a custom skill
                      </button>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs font-medium text-[#475569]">Choose a suggestion or press Enter to add your own.</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1 text-[12.5px] text-[#334155]">
                  {skill}
                  {isProfileEditMode && (
<button type="button" aria-label={`Remove ${skill}`} disabled={isSavingSkills}
                    onClick={() => void removeSkill(skill)}
                    className="text-[#64748B] hover:text-red-500 disabled:opacity-50">×</button>
)}
                </span>
              ))}
            </div>
            {isSavingSkills && <p className="mt-3 text-xs font-medium text-[#475569]">Saving skills...</p>}
            {skillError && <p role="alert" className="mt-2 text-sm text-red-600">{skillError}</p>}
          </div>
        {/* Career Goals */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Career Goals</h3>
              {isProfileEditMode && !isEditingCareerGoals && (
<button type="button" onClick={() => {
                  setCareerGoalsDraft(careerGoals)
                  setCareerGoalsError("")
                  setIsEditingCareerGoals(true)
                }} aria-label="Edit career goals" className="text-[#2563EB]">
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
            {isEditingCareerGoals ? (
              <div className="space-y-3">
                <textarea rows={5} maxLength={2000} value={careerGoalsDraft}
                  onChange={event => setCareerGoalsDraft(event.target.value)}
                  placeholder="Describe your career goals and aspirations..."
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm leading-6 text-[#1F2937] outline-none focus:border-[#2563EB]" />
                {careerGoalsError && <p role="alert" className="text-sm text-red-600">{careerGoalsError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={saveCareerGoals} disabled={isSavingCareerGoals}
                    className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    {isSavingCareerGoals ? "Saving..." : "Save"}
                  </button>
                  <button type="button" disabled={isSavingCareerGoals} onClick={() => {
                    setCareerGoalsDraft(careerGoals)
                    setCareerGoalsError("")
                    setIsEditingCareerGoals(false)
                  }} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-[13px] leading-[1.7] text-[#687995]">
                {careerGoals || "Add your career goals and aspirations."}
              </p>
            )}
          </div>
          </div>

        {/* RIGHT */}
        <div className="space-y-5">
         
          {/* Quick Actions */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-[15px] font-bold text-[#1A1A2E]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Pencil, label: "Edit Profile", primary: true },
                { icon: Share2, label: "Share Profile", primary: false },
                { icon: Download, label: "Download Resume", primary: false },
                { icon: ExternalLink, label: "View Public Profile", primary: false },
              ].map(({ icon: Icon, label, primary }) => (
                <button
                  key={label}
                  type="button"
                  onClick={async () => {
            if (label === "Edit Profile") {
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
                console.error("Quick Action resume download failed:", error)
                setResumeError(error instanceof Error ? error.message : "Couldn't download your resume.")
              }
              return
            }

            if (label === "View Public Profile") {
              if (user?.uid) {
                router.push(`/student/${encodeURIComponent(user.uid)}`)
              } else {
                alert("Please log in to view your public profile.")
              }
              return
            }

            if (label === "Share Profile") {
              if (!user?.uid) {
                alert("Please log in to share your public profile.")
                return
              }

              const publicUrl = `${window.location.origin}/student/${encodeURIComponent(user.uid)}`

              try {
                if (navigator.share) {
                  await navigator.share({
                    title: `${user.fullName || user.displayName || "Student"}'s public profile`,
                    url: publicUrl
                  })
                } else {
                  await navigator.clipboard.writeText(publicUrl)
                  alert("Public profile link copied! You can now share it.")
                }
              } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                  try {
                    await navigator.clipboard.writeText(publicUrl)
                    alert("Public profile link copied! You can now share it.")
                  } catch {
                    window.prompt("Copy your public profile link:", publicUrl)
                  }
                }
              }
            }
          }}
                  className={`flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition ${
                    primary
                      ? isProfileEditMode
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-100 bg-[#EEF3FF] text-[#2563EB] hover:bg-[#DBEAFE]"
                      : "border-[#E0E0E0] bg-white text-[#475569] hover:border-[#2563EB] hover:bg-[#F8FAFF]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="leading-4">
                    {label === "Edit Profile" && isProfileEditMode ? "Done Editing" : label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Languages Known</h3>
              {isProfileEditMode && (
<button type="button" onClick={() => setShowLanguagePicker(v => !v)}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]">
                <Plus className="h-3.5 w-3.5" /> Add Language
              </button>
)}
            </div>

            {isProfileEditMode && showLanguagePicker && (
              <div className="mb-4 space-y-3">
                <input value={languageQuery} onChange={e => setLanguageQuery(e.target.value)}
                  placeholder="Search languages..." autoFocus
                  className="w-full rounded-xl border border-[#CBD5E1] px-3 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563EB]" />
                {languageQuery.trim() && (
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E0E0E0]">
                    {languageOptions.filter(l =>
                      l.name.toLowerCase().includes(languageQuery.trim().toLowerCase()) &&
                      !languages.some(x => x.name === l.name)
                    ).slice(0, 12).map(l => (
                      <button key={l.name} type="button" onClick={() => {
                        setPendingLanguage(l)
                        setPendingLevel("Intermediate")
                        setLanguageQuery("")
                      }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#1F2937] hover:bg-[#DBEAFE] hover:text-[#111827] disabled:text-[#6B7280]">
                        <span>{l.flag}</span><span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {pendingLanguage && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <p className="mb-2 text-sm font-semibold text-[#1F2937]">
                      {pendingLanguage.flag} {pendingLanguage.name} — what is your proficiency?
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
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {languages.map(language => (
                <div key={language.name} className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#1A1A2E]">{language.name}</p>
                    {editingLanguage === language.name ? (
                      <select value={language.level} onChange={e => updateLanguageLevel(language.name, e.target.value)}
                        className="mt-1 rounded-lg border border-[#CBD5E1] bg-white px-2 py-1 text-xs text-[#1F2937]">
                        {languageLevels.map(level => <option key={level} value={level}>{level}</option>)}
                      </select>
                    ) : <p className="text-[12px] text-[#687995]">{language.level}</p>}
                  </div>
                  {isProfileEditMode && (
<button type="button" onClick={() => setEditingLanguage(
                    editingLanguage === language.name ? null : language.name
                  )} aria-label={`Edit ${language.name} proficiency`}
                    className="text-[#2563EB]"><Pencil className="h-4 w-4" /></button>
)}
                  {isProfileEditMode && (
<button type="button" onClick={() => removeLanguage(language.name)}
                    aria-label={`Remove ${language.name}`} className="text-red-500 hover:text-red-700">
                    <span aria-hidden="true">×</span>
                  </button>
)}
                </div>
              ))}
              {languages.length === 0 && <p className="text-sm text-[#687995]">Add the languages you know.</p>}
            </div>
            {languageError && <p role="alert" className="mt-3 text-sm text-red-600">{languageError}</p>}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Recent Activity</h3>
              <button type="button" onClick={() => router.push("/profile/activity")} className="text-[12px] font-semibold text-[#2563EB] flex items-center gap-1">View All →</button>
            </div>
            <div className="space-y-4">
              {activityLoading ? (
                <p className="text-sm text-[#687995]">Loading activity...</p>
              ) : activityItems.length === 0 ? (
                <p className="text-sm text-[#687995]">No applications or saved opportunities yet.</p>
              ) : (
                (showAllActivity ? activityItems : activityItems.slice(0, 4)).map(({ id, icon: Icon, color, iconColor, title, sub, date }) => (
                  <div key={id} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: color }}>
                      <Icon className="h-4 w-4" style={{ color: iconColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#1A1A2E] line-clamp-1">{title}</p>
                      <p className="text-[12px] text-[#687995]">{sub}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-[#ABABAB]">
                      {date ? date.toLocaleDateString() : "Date unavailable"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resume */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">My Resume</h3>
              {(
<button type="button" onClick={() => setIsEditingResume(v => !v)}
                className="text-[12px] font-semibold text-[#2563EB]">
                {isEditingResume ? "Close" : resume ? "Replace / Edit" : "Add Resume"}
              </button>
)}
            </div>

            {resume ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#E0E0E0] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE]">
                  <FileText className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1A1A2E]">{resume.name}</p>
                  <p className="text-[11px] text-[#64748B]">
                    {(resume.size / (1024 * 1024)).toFixed(2)} MB
                    {resume.updatedAt ? ` · Updated ${new Date(resume.updatedAt).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => void openResume()} disabled={resumeBusy}
                  className="text-[12px] font-semibold text-[#2563EB] disabled:opacity-50">View</button>
                <button
  type="button"
  onClick={() => setShowDeleteResumePopup(true)}
  disabled={resumeBusy}
  className="text-sm font-semibold text-red-600 disabled:opacity-50"
>
  Remove
</button>
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
                      <span>Uploading PDF...</span><span>{resumeProgress}%</span>
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-resume-title"
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <FileText className="h-6 w-6 text-red-600" />
      </div>

      <h3
        id="delete-resume-title"
        className="text-center text-lg font-bold text-[#1A1A2E]"
      >
        Remove Resume?
      </h3>

      <p className="mt-2 text-center text-sm text-[#64748B]">
        Are you sure you want to remove your resume? This action cannot be undone.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteResumePopup(false)}
          disabled={resumeBusy}
          className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#374151] hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            await removeResume()
            setShowDeleteResumePopup(false)
          }}
          disabled={resumeBusy}
          className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {resumeBusy ? "Removing..." : "Remove Resume"}
        </button>
      </div>
    </div>
  </div>
)}

          </div>

          
        </div>
      </div>
      </>
      )}
    </div>
  )
}
