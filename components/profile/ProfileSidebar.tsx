"use client"

interface ProfileSidebarProps {
  activeSection: string

  setActiveSection: (
    section: string
  ) => void

  handleLogout: () => void

  fullName: string

  role: string

roles: string[]

handleRoleSwitch: (
  role: string
) => void
handleBecomeRecruiter: () => void
}

const studentSections = [
  "Personal Details",
  "Contact Details",
  "Social Profiles",
  "Education",
  "Certificates",
  "Skills",
  "Experience",
  "Resume",
]

const recruiterSections = [
  "Personal Details",      // recruiter identity
  "Company Details",       // organization info
  "Recruiter Details",     // role inside company
  "Organization Profile",  // about company
  "Social Links",          // company socials
  "Opportunity Preferences",
  "Verification",
]

export default function ProfileSidebar({
  activeSection,
  setActiveSection,
  handleLogout,
  fullName,
  role,
  roles,
  handleBecomeRecruiter,
  handleRoleSwitch,
  }: ProfileSidebarProps){
  const sections =
  role === "recruiter"
    ? recruiterSections
    : studentSections

  return (

    <>

      {/* DESKTOP SIDEBAR */}

      <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:rounded-[32px] lg:border lg:border-[#E7DDD1] lg:bg-[#FFFDF9] lg:p-6 lg:shadow-sm">

        <div>

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] text-2xl font-semibold text-white">

          {fullName?.charAt(0) || "U"}

          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#2B1D16]">

  {role === "recruiter"
    ? "Organization Profile"
    : "Your Profile"}

</h2>

<p className="mt-2 text-sm leading-6 text-[#8B7355]">

  {role === "recruiter"
    ? "Manage your organization, recruiter profile and opportunity preferences."
    : "Manage your personal details, education, experiences and professional presence."}

</p>
{roles.includes("recruiter") ? (

<div className="mt-5">

  <p className="mb-2 text-xs font-medium text-[#8B7355]">
    Current Mode
  </p>

  <div className="flex gap-2">

    <button
      onClick={() =>
        handleRoleSwitch("user")
      }
      className={`rounded-xl px-4 py-2 text-sm font-medium ${
        role === "user"
          ? "bg-[#2563EB] text-white"
          : "bg-[#F8F5F0] text-[#6B5B52]"
      }`}
    >
      Student
    </button>

    <button
      onClick={() =>
        handleRoleSwitch("recruiter")
      }
      className={`rounded-xl px-4 py-2 text-sm font-medium ${
        role === "recruiter"
          ? "bg-[#2563EB] text-white"
          : "bg-[#F8F5F0] text-[#6B5B52]"
      }`}
    >
      Recruiter
    </button>

  </div>

</div>

) : (

<div className="mt-5">

  <button
    onClick={handleBecomeRecruiter}
    className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
  >
    Become Recruiter
  </button>

</div>

)}

        </div>

        {/* NAV */}

        <div className="mt-10 flex flex-col gap-2">

          {sections.map((section) => (

            <button
              key={section}
              onClick={() =>
                setActiveSection(section)
              }
              className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                activeSection === section
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#FFFDF9] text-[#6B5B52] hover:bg-[#F8F5F0]"
              }`}
            >

              {section}

            </button>

          ))}

{/* LOGOUT */}

<button
  onClick={handleLogout}
  className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
>

  Logout

</button>
        </div>

      </aside>

      {/* MOBILE TABS */}

      <div className="sticky top-0 z-20 flex gap-3 overflow-x-auto border-b border-[#E7DDD1] bg-[#F8F5F0] pb-3 pt-1 scrollbar-hide lg:hidden">

        {sections.map((section) => (

          <button
            key={section}
            onClick={() =>
              setActiveSection(section)
            }
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${
              activeSection === section
                ? "bg-[#2563EB] text-white"
                : "bg-[#FFFDF9] text-[#6B5B52]"
            }`}
          >

            {section}

          </button>

        ))}
        
<button
  onClick={handleLogout}
  className="shrink-0 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 lg:hidden"
>

  Logout

</button>
      </div>

    </>

  )

}