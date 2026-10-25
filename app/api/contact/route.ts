import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { fullName, email, subject, message } = await request.json()

    if (
      typeof fullName !== "string" || !fullName.trim() ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof subject !== "string" || !subject.trim() ||
      typeof message !== "string" || !message.trim()
    ) {
      return NextResponse.json({ error: "Please complete all fields with a valid email address." }, { status: 400 })
    }

    if (fullName.length > 150 || email.length > 254 || subject.length > 200 || message.length > 1000) {
      return NextResponse.json({ error: "One or more fields exceed the allowed length." }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL

    if (!apiKey || !from) {
      return NextResponse.json({ error: "Email service is not configured yet. Please try again later." }, { status: 503 })
    }

    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: ["official@gonnaglobal.com"],
        reply_to: email.trim(),
        subject: `[Gonn'a Global Contact] ${subject.trim()}`,
        text: [
          "New message from the Gonn'a Global Contact page",
          "",
          `Name: ${fullName.trim()}`,
          `Email: ${email.trim()}`,
          `Subject: ${subject.trim()}`,
          "",
          "Message:",
          message.trim(),
        ].join("\\n"),
      }),
    })

    if (!result.ok) {
      console.error("Contact email provider returned status:", result.status)
      return NextResponse.json({ error: "Email could not be sent. Please try again later." }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 })
  }
}
