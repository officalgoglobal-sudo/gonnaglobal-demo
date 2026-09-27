export interface Education {
    id: string
    institution: string
    degree: string
    stream: string
    startYear: string
    endYear: string
    collegeEmail: string
  }
  
  export interface Experience {
    id: string
    company: string
    role: string
    startDate: string
    endDate: string
    currentlyWorking: boolean
  }
  
  export interface Certificate {
    id: string
    title: string
    description: string
    link: string
  }
  
  export interface UserProfile {
    fullName: string
    email: string
  
    dob: string
  
    gender: string
  
    country: string
  
    foundUsFrom: string
  
    instagram: string
  
    linkedin: string
  
    telegram: string
  
    phone: string
  
    whatsapp: string
  
    alternateEmail: string
  
    isDropper: boolean
  
    education: Education[]
  
    certificates: Certificate[]
  
    experiences: Experience[]

    skills: string[]
  
    resumeLink: string
  
    profileImage: string
  }