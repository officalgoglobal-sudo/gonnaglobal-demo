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
    const body = await request.json()
    const path = body?.path

    if (typeof path !== "string" || !path.startsWith(`${decoded.uid}/`) || path.includes("..")) {
      return NextResponse.json({ error: "Invalid resume path." }, { status: 403 })
    }

    const { error } = await supabaseAdmin.storage
      .from("student-resumes")
      .remove([path])

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resume delete API failed:", error)
    return NextResponse.json({ error: "Couldn't remove the resume." }, { status: 500 })
  }
}
