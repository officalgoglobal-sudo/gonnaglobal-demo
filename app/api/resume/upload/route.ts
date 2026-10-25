import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebaseAdmin"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization")
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Please log in again." }, { status: 401 })
    }

    const decoded = await adminAuth.verifyIdToken(authorization.slice(7))
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No PDF provided." }, { status: 400 })
    }
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "PDF files only." }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Maximum file size is 5 MB." }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `${decoded.uid}/${Date.now()}-${safeName}`
    const { error } = await supabaseAdmin.storage
      .from("student-resumes")
      .upload(path, new Uint8Array(await file.arrayBuffer()), {
        contentType: "application/pdf",
        upsert: false,
      })

    if (error) throw error

    return NextResponse.json({ path })
  } catch (error) {
    console.error("Resume upload API failed:", error)
    return NextResponse.json({ error: "Resume upload failed." }, { status: 500 })
  }
}
