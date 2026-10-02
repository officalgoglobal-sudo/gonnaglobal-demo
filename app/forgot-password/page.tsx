import type { Metadata } from "next"
import ForgotPasswordContent from "./ForgotPasswordContent"

export const metadata: Metadata = {
  title: "Forgot Password | Gonn'a Global",
  description: "Reset your Gonn'a Global account password.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />
}
