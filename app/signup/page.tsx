import type { Metadata } from "next"
import SignupPageContent from "./SignupPageContent"

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Create your Gonn'a Global account and discover internships, scholarships, fellowships, hackathons, conferences and global opportunities.",
}

export default function SignupPage() {
  return <SignupPageContent />
}