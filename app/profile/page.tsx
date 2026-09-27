"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth"

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"

import {
  auth,
  db,
} from "@/lib/firebase"
import SkillsSection from "@/components/profile/SkillsSection"
import Sidebar from "@/components/home/Sidebar"
import ProfileSidebar from "@/components/profile/ProfileSidebar"
import PersonalDetails from "@/components/profile/PersonalDetails"
import ContactDetails from "@/components/profile/ContactDetails"
import SocialProfiles from "@/components/profile/SocialProfiles"
import EducationSection from "@/components/profile/EducationSection"
import CertificatesSection from "@/components/profile/CertificatesSection"
import ExperienceSection from "@/components/profile/ExperienceSection"
import ResumeSection from "@/components/profile/ResumeSection"
import CompanyDetails from "@/components/profile/recruiter/CompanyDetails"
import RecruiterDetails from "@/components/profile/recruiter/RecruiterDetails"
import OrganizationProfile from "@/components/profile/recruiter/OrganizationProfile"
import SocialLinks from "@/components/profile/recruiter/SocialLinks"
import OpportunityPreferences from "@/components/profile/recruiter/OpportunityPreferences"
import Verification from "@/components/profile/recruiter/Verification"

export default function ProfilePage() {

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)
    const [role, setRole] =
  useState("user")
  const [roles, setRoles] =
useState<string[]>([])
const [showRoleModal, setShowRoleModal] =
  useState(false)

const [showBecomeRecruiterModal,
setShowBecomeRecruiterModal] =
  useState(false)

const [pendingRole, setPendingRole] =
  useState("")
  const [fullName, setFullName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [bio, setBio] =
    useState("")

  const [linkedin, setLinkedin] =
    useState("")

  const [portfolio, setPortfolio] =
    useState("")

  const [resume, setResume] =
    useState("")
    const [phone, setPhone] =
  useState("")

const [whatsapp, setWhatsapp] =
  useState("")

const [alternateEmail, setAlternateEmail] =
  useState("")
  const [dob, setDob] =
  useState("")

const [country, setCountry] =
  useState("")

const [gender, setGender] =
  useState("")

const [foundUsFrom, setFoundUsFrom] =
  useState("")


const [instagram, setInstagram] =
  useState("")

  const [youtube, setYoutube] =
  useState("")
  const [education, setEducation] =
  useState<any[]>([])
  const [certificates, setCertificates] =
  useState<any[]>([])
  const [experiences, setExperiences] =
  useState<any[]>([])
  const [skills, setSkills] =
  useState<string[]>([])

const [isDropper, setIsDropper] =
  useState(false)
   
    const [activeSection, setActiveSection] =
  useState("Personal Details")
  const [companyName, setCompanyName] =
  useState("")

const [companyWebsite, setCompanyWebsite] =
  useState("")

const [industry, setIndustry] =
  useState("")

const [organizationType, setOrganizationType] =
  useState("")

const [companySize, setCompanySize] =
  useState("")

const [foundedYear, setFoundedYear] =
  useState("")

const [headquartersCountry, setHeadquartersCountry] =
  useState("")
  const [recruiterName, setRecruiterName] =
  useState("")

const [designation, setDesignation] =
  useState("")

const [workEmail, setWorkEmail] =
  useState("")

const [recruiterPhone, setRecruiterPhone] =
  useState("")

const [recruiterLinkedin, setRecruiterLinkedin] =
  useState("")
  const [organizationDescription, setOrganizationDescription] =
  useState("")

const [missionStatement, setMissionStatement] =
  useState("")

const [whyJoin, setWhyJoin] =
  useState("")
  const [companyLinkedin, setCompanyLinkedin] =
  useState("")

const [companyInstagram, setCompanyInstagram] =
  useState("")

const [companyTwitter, setCompanyTwitter] =
  useState("")

const [companyYoutube, setCompanyYoutube] =
  useState("")

const [companyGithub, setCompanyGithub] =
  useState("")
  const [opportunityTypes, setOpportunityTypes] =
  useState<string[]>([])

const [eligibleRegions, setEligibleRegions] =
  useState<string[]>([])

const [educationLevels, setEducationLevels] =
  useState<string[]>([])
  const [verificationStatus] =
  useState("Not Verified")

const [businessRegistration,
setBusinessRegistration] =
  useState("")

const [organizationCertificate,
setOrganizationCertificate] =
  useState("")
  const [successMessage, setSuccessMessage] =
  useState("")
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {

            setLoading(false)
          
            router.push("/login")
          
            return
          
          }

          const userRef = doc(
            db,
            "users",
            user.uid
          )

          const userSnapshot =
            await getDoc(userRef)

          if (userSnapshot.exists()) {

            const userData =
              userSnapshot.data()
              setRole(
                userData?.activeRole ||
                userData?.role ||
                "user"
              )
              
              setRoles(
                userData?.roles ||
                [userData?.role || "user"]
              )

            setFullName(
              userData.fullName || ""
            )

            setEmail(
              userData.email || ""
            )

            setBio(
              userData.bio || ""
            )

            setLinkedin(
              userData.linkedin || ""
            )

            setPortfolio(
              userData.portfolio || ""
            )

            setResume(
              userData.resume || ""
            )
            setPhone(
              userData.phone || ""
            )
            
            setWhatsapp(
              userData.whatsapp || ""
            )
            
            setAlternateEmail(
              userData.alternateEmail || ""
            )
            setDob(
              userData.dob || ""
            )
            
            setCountry(
              userData.country || ""
            )
            
            setGender(
              userData.gender || ""
            )
            
            setFoundUsFrom(
              userData.foundUsFrom || ""
            )
            
            setInstagram(
              userData.instagram || ""
            )

            setYoutube(
              userData.youtube || ""
            )

            setEducation(
              userData.education || []
            )
            
            setIsDropper(
              userData.isDropper || false
            )
            setCertificates(
              userData.certificates || []
            )
            setExperiences(
              userData.experiences || []
            )
            setSkills(
              userData.skills || []
            )
            setCompanyName(
              userData.companyName || ""
            )
            
            setCompanyWebsite(
              userData.companyWebsite || ""
            )
            
            setIndustry(
              userData.industry || ""
            )
            
            setOrganizationType(
              userData.organizationType || ""
            )
            
            setCompanySize(
              userData.companySize || ""
            )
            
            setFoundedYear(
              userData.foundedYear || ""
            )
            
            setHeadquartersCountry(
              userData.headquartersCountry || ""
            )
            setRecruiterName(
              userData.recruiterName || ""
            )
            
            setDesignation(
              userData.designation || ""
            )
            
            setWorkEmail(
              userData.workEmail || ""
            )
            
            setRecruiterPhone(
              userData.recruiterPhone || ""
            )
            
            setRecruiterLinkedin(
              userData.recruiterLinkedin || ""
            )
            setOrganizationDescription(
              userData.organizationDescription || ""
            )
            
            setMissionStatement(
              userData.missionStatement || ""
            )
            
            setWhyJoin(
              userData.whyJoin || ""
            )
            setCompanyLinkedin(
              userData.companyLinkedin || ""
            )
            
            setCompanyInstagram(
              userData.companyInstagram || ""
            )
            
            setCompanyTwitter(
              userData.companyTwitter || ""
            )
            
            setCompanyYoutube(
              userData.companyYoutube || ""
            )
            
            setCompanyGithub(
              userData.companyGithub || ""
            )
            setOpportunityTypes(
              userData.opportunityTypes || []
            )
            
            setEligibleRegions(
              userData.eligibleRegions || []
            )
            
            setEducationLevels(
              userData.educationLevels || []
            )
            setBusinessRegistration(
              userData.businessRegistration || ""
            )
            
            setOrganizationCertificate(
              userData.organizationCertificate || ""
            )
          }
          setLoading(false)
        }
      )

    return () => unsubscribe()

  }, [router])
  const handleRoleSwitch = (
    newRole: string
  ) => {
  
    setPendingRole(newRole)
  
    setShowRoleModal(true)
  
  }
  const confirmRoleSwitch = async () => {

    if (!auth.currentUser) return
  
    try {
  
      await updateDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid
        ),
        {
          role: pendingRole,
          activeRole: pendingRole,
        }
      )
  
      setRole(pendingRole)
  
      setActiveSection(
        "Personal Details"
      )
  
      setShowRoleModal(false)
  
    } catch (error) {
  
      console.error(error)
  
    }
  
  }
  const handleBecomeRecruiter = () => {

    setShowBecomeRecruiterModal(true)
  
  }
  const confirmBecomeRecruiter = async () => {

    if (!auth.currentUser) return
  
    try {
  
      await updateDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid
        ),
        {
          role: "recruiter",
      
          roles: [
            "user",
            "recruiter",
          ],
      
          activeRole: "recruiter",
        }
      )
  
      setRoles([
        "user",
        "recruiter",
      ])
  
      setRole("recruiter")
  
      setShowBecomeRecruiterModal(false)
  
    } catch (error) {
  
      console.error(error)
  
    }
  
  }
  const handleLogout = async () => {

    try {
  
      await signOut(auth)
  
      router.push("/login")
  
    } catch (error) {
  
      console.error(error)
  
    }
  
  }
  const handleSaveProfile = async (
    sectionName?: string
  ) => {

    if (!auth.currentUser) return
    try {

      await updateDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid
        ),
        {
          fullName,
          bio,
          linkedin,
          portfolio,
          resume,
          phone,
          whatsapp,
          alternateEmail,
          dob,
          country,
          gender,
          foundUsFrom,
          instagram,
          youtube,
          education,
          isDropper,
          certificates,
          experiences,
          skills,
        
          companyName,
          companyWebsite,
          industry,
          organizationType,
          companySize,
          foundedYear,
          headquartersCountry,

          recruiterName,
          designation,
          workEmail,
          recruiterPhone,
          recruiterLinkedin,

          organizationDescription,
          missionStatement,
          whyJoin,

          companyLinkedin,
          companyInstagram,
          companyTwitter,
          companyYoutube,
          companyGithub,

          opportunityTypes,
          eligibleRegions,
          educationLevels,

          businessRegistration,
          organizationCertificate,
        }
      )

      setSuccessMessage(
        `${sectionName || "Profile"} updated successfully`
      )
      
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)

    } catch (error) {

      console.error(error)

    }

  }
  const sharedFields = [
    fullName,
    bio,
    dob,
    country,
    gender,
  ]
  
  const studentProfileFields = [
    ...sharedFields,
  
    portfolio,
    phone,
    linkedin,
    resume,
  ]
  
  const recruiterProfileFields = [
    ...sharedFields,
  
    companyName,
    companyWebsite,
    industry,
    organizationType,
    companySize,
    foundedYear,
    headquartersCountry,
  
    recruiterName,
    designation,
    workEmail,
    recruiterPhone,
    recruiterLinkedin,
  
    organizationDescription,
    missionStatement,
  
    companyLinkedin,
  ]
  
  const activeProfileFields =
    role === "recruiter"
      ? recruiterProfileFields
      : studentProfileFields
  
  const completedFields =
    activeProfileFields.filter(
      (field) =>
        typeof field === "string" &&
        field.trim() !== ""
    ).length
  
  const profileCompletion =
    Math.round(
      (completedFields /
        activeProfileFields.length) * 100
    )

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">

        <p className="text-[#8B7355]">
          Loading profile...
        </p>

      </main>
    )

  }

  return (
    <>

{showRoleModal && (

<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-5">

  <div className="w-full max-w-md rounded-[28px] bg-[#FFFDF9] p-8">

    <h2 className="text-2xl font-bold text-[#2B1D16]">

      Switch Mode

    </h2>

    <p className="mt-4 text-[#6B5B52]">

      Are you sure you want to switch to{" "}
      {pendingRole === "recruiter"
        ? "Recruiter"
        : "Student"}{" "}
      mode?

    </p>

    <div className="mt-8 flex gap-3">

      <button
        onClick={() =>
          setShowRoleModal(false)
        }
        className="flex-1 rounded-xl border border-[#E7DDD1] bg-[#F8F5F0] py-3 font-medium text-[#6B5B52] transition hover:bg-[#EFE7DC] hover:text-[#2B1D16]"
      >
        Cancel
      </button>

      <button
        onClick={confirmRoleSwitch}
        className="flex-1 rounded-xl bg-[#2563EB] py-3 text-white"
      >
        Switch
      </button>

    </div>

  </div>

</div>

)}

{showBecomeRecruiterModal && (

<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-5">

  <div className="w-full max-w-md rounded-[28px] bg-[#FFFDF9] p-8">

    <h2 className="text-2xl font-bold text-[#2B1D16]">

      Become a Recruiter

    </h2>

    <p className="mt-4 text-[#6B5B52]">

      Are you sure you want to become a recruiter?

      You will be able to post opportunities,
      manage your organization profile and
      reach ambitious students worldwide.

    </p>

    <div className="mt-8 flex gap-3">

      <button
        onClick={() =>
          setShowBecomeRecruiterModal(false)
        }
       className="flex-1 rounded-xl border border-[#E7DDD1] bg-[#F8F5F0] py-3 font-medium text-[#6B5B52] transition hover:bg-[#EFE7DC] hover:text-[#2B1D16]"
      >
        Cancel
      </button>

      <button
        onClick={confirmBecomeRecruiter}
        className="flex-1 rounded-xl bg-[#2563EB] py-3 text-white"
      >
        Become Recruiter
      </button>

    </div>

  </div>

</div>

)}

<Sidebar />

      <main className="min-h-screen bg-[#F8F5F0] pb-32 text-[#2B1D16] lg:ml-24 lg:pb-0">

      <section className="border-b border-[#E7DDD1] bg-[#FFFDF9] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

      <p className="text-sm uppercase tracking-[0.25em] text-[#8B7355]">
  {role === "recruiter"
    ? "Recruiter Profile"
    : "Student Profile"}
</p>

          <h1 className="mt-4 text-[32px] font-bold tracking-tight leading-tight text-[#2B1D16] sm:text-4xl lg:text-5xl">

          {role === "recruiter"
  ? "Build your organization profile."
  : "Build your global profile."}

          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6B5B52] sm:text-lg sm:leading-8">

          {role === "recruiter"
  ? "Showcase your organization and reach talented students worldwide."
  : "Showcase your experience, skills and ambitions to recruiters and global organizations."}

          </p>

        </section>

        <section className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto mb-8 max-w-5xl rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-5 sm:p-8 lg:rounded-[32px]">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  <div>

    <p className="text-sm text-[#8B7355]">
      Profile Strength
    </p>

    <h2 className="mt-2 text-2xl font-bold text-[#2B1D16] sm:text-3xl">

      {profileCompletion}% Complete

    </h2>

  </div>

  <div
    className={`rounded-full px-4 py-2 text-sm font-medium ${
      profileCompletion >= 80
        ? "bg-green-100 text-green-700"
        : profileCompletion >= 50
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >

    {profileCompletion >= 80
      ? "Recruiter Ready"
      : profileCompletion >= 50
      ? "Good Progress"
      : "Needs Improvement"}

  </div>

</div>

<div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EFE7DC]">
    

  <div
    className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
    style={{
      width: `${profileCompletion}%`,
    }}
  />

</div>

</div>
<div className="mt-5 flex gap-3 lg:hidden">

  {roles.includes("recruiter") ? (

    <>
      <button
        onClick={() =>
          handleRoleSwitch("user")
        }
        className={`rounded-xl px-5 py-3 text-sm font-medium ${
          role === "user"
            ? "bg-[#2563EB] text-white"
            : "border border-[#E7DDD1] bg-[#FFFDF9] text-[#6B5B52]"
        }`}
      >
        Student
      </button>

      <button
        onClick={() =>
          handleRoleSwitch("recruiter")
        }
        className={`rounded-xl px-5 py-3 text-sm font-medium ${
          role === "recruiter"
            ? "bg-[#2563EB] text-white"
            : "border border-[#E7DDD1] bg-[#FFFDF9] text-[#6B5B52]"
        }`}
      >
        Recruiter
      </button>
    </>

  ) : (

    <button
      onClick={handleBecomeRecruiter}
      className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white"
    >
      Become Recruiter
    </button>

  )}

</div>
<div className="mx-auto mt-8 flex min-w-0 max-w-7xl flex-col gap-6 lg:flex-row">

<ProfileSidebar
  activeSection={activeSection}
  setActiveSection={setActiveSection}
  handleLogout={handleLogout}
  fullName={fullName}
  role={role}
  roles={roles}
  handleRoleSwitch={
    handleRoleSwitch
  }
  handleBecomeRecruiter={
    handleBecomeRecruiter
  }
/>

<div className="min-w-0 flex-1 rounded-[28px] border border-[#E7DDD1] bg-[#FFFDF9] p-5 shadow-sm shadow-[#E7DDD1]/40 sm:p-8 lg:rounded-[32px] lg:p-10">
{successMessage && (

<div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">

  ✓ {successMessage}

</div>

)}
{activeSection ===
  "Personal Details" && (

  <PersonalDetails
    fullName={fullName}
    setFullName={setFullName}
    email={email}
    bio={bio}
    setBio={setBio}
    dob={dob}
    setDob={setDob}
    country={country}
    setCountry={setCountry}
    gender={gender}
    setGender={setGender}
    foundUsFrom={foundUsFrom}
    setFoundUsFrom={setFoundUsFrom}
    
    handleSaveProfile={handleSaveProfile}
  />

)}

{activeSection ===
  "Contact Details" && (

  <ContactDetails
    phone={phone}
    setPhone={setPhone}
    whatsapp={whatsapp}
    setWhatsapp={setWhatsapp}
    email={email}
    alternateEmail={alternateEmail}
    setAlternateEmail={setAlternateEmail}
    handleSaveProfile={handleSaveProfile}
  />

)}

{activeSection ===
  "Social Profiles" && (

  <SocialProfiles
    linkedin={linkedin}
    setLinkedin={setLinkedin}
    portfolio={portfolio}
    setPortfolio={setPortfolio}
    instagram={instagram}
    setInstagram={setInstagram}
    youtube={youtube}
    setYoutube={setYoutube}
    handleSaveProfile={handleSaveProfile}
  />

)}

{activeSection ===
  "Education" && (

<EducationSection
  education={education}
  setEducation={setEducation}
  isDropper={isDropper}
  setIsDropper={setIsDropper}
  handleSaveProfile={handleSaveProfile}
/>

)}

{activeSection ===
  "Certificates" && (

    <CertificatesSection
    certificates={certificates}
    setCertificates={setCertificates}
    handleSaveProfile={handleSaveProfile}
  />

)}

{activeSection ===
  "Skills" && (

  <SkillsSection
    skills={skills}
    setSkills={setSkills}
    handleSaveProfile={handleSaveProfile}
  />

)}

{activeSection ===
  "Experience" && (

    <ExperienceSection
    experiences={experiences}
    setExperiences={setExperiences}
    handleSaveProfile={handleSaveProfile}
  />

)}

{activeSection ===
  "Resume" && (

  <ResumeSection
    resume={resume}
    setResume={setResume}
    handleSaveProfile={handleSaveProfile}
  />

)}
{activeSection === "Company Details" && (
  <CompanyDetails
    companyName={companyName}
    setCompanyName={setCompanyName}
    companyWebsite={companyWebsite}
    setCompanyWebsite={setCompanyWebsite}
    industry={industry}
    setIndustry={setIndustry}
    organizationType={organizationType}
    setOrganizationType={setOrganizationType}
    companySize={companySize}
    setCompanySize={setCompanySize}
    foundedYear={foundedYear}
    setFoundedYear={setFoundedYear}
    headquartersCountry={headquartersCountry}
    setHeadquartersCountry={setHeadquartersCountry}
    handleSaveProfile={handleSaveProfile}
  />
)}

{activeSection === "Recruiter Details" && (
 <RecruiterDetails
 recruiterName={recruiterName}
 setRecruiterName={setRecruiterName}
 designation={designation}
 setDesignation={setDesignation}
 workEmail={workEmail}
 setWorkEmail={setWorkEmail}
 recruiterPhone={recruiterPhone}
 setRecruiterPhone={setRecruiterPhone}
 recruiterLinkedin={recruiterLinkedin}
 setRecruiterLinkedin={setRecruiterLinkedin}
 handleSaveProfile={handleSaveProfile}
/>
)}

{activeSection === "Organization Profile" && (
  <OrganizationProfile
  organizationDescription={organizationDescription}
  setOrganizationDescription={setOrganizationDescription}
  missionStatement={missionStatement}
  setMissionStatement={setMissionStatement}
  whyJoin={whyJoin}
  setWhyJoin={setWhyJoin}
  handleSaveProfile={handleSaveProfile}
/>
)}

{activeSection === "Social Links" && (
  <SocialLinks
  companyLinkedin={companyLinkedin}
  setCompanyLinkedin={setCompanyLinkedin}
  companyInstagram={companyInstagram}
  setCompanyInstagram={setCompanyInstagram}
  companyTwitter={companyTwitter}
  setCompanyTwitter={setCompanyTwitter}
  companyYoutube={companyYoutube}
  setCompanyYoutube={setCompanyYoutube}
  companyGithub={companyGithub}
  setCompanyGithub={setCompanyGithub}
  handleSaveProfile={handleSaveProfile}
/>
)}

{activeSection === "Opportunity Preferences" && (
  <OpportunityPreferences
  opportunityTypes={opportunityTypes}
  setOpportunityTypes={setOpportunityTypes}
  eligibleRegions={eligibleRegions}
  setEligibleRegions={setEligibleRegions}
  educationLevels={educationLevels}
  setEducationLevels={setEducationLevels}
  handleSaveProfile={handleSaveProfile}
/>
)}

{activeSection === "Verification" && (
  <Verification
  verificationStatus={verificationStatus}
  businessRegistration={businessRegistration}
  setBusinessRegistration={setBusinessRegistration}
  organizationCertificate={organizationCertificate}
  setOrganizationCertificate={setOrganizationCertificate}
  handleSaveProfile={handleSaveProfile}
/>
)}


</div>

</div>
        </section>

      </main>
    </>
  )

}
