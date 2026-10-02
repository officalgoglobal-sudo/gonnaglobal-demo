import type { Metadata } from "next"
import LoginPageContent from "./LoginPageContent"

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to Gonn'a Global to discover internships, scholarships, fellowships, hackathons, conferences and other global opportunities.",
}

export default function LoginPage() {
  return <LoginPageContent />
}