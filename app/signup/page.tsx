import type { Metadata } from "next"
import SignupPageContent from "./SignupPageContent"

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Create your GoGlobal account and discover internships, scholarships, fellowships, hackathons, conferences and global opportunities.",
}

export default function SignupPage() {
  return <SignupPageContent />
}