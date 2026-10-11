"use client"

import { useState, useRef, useEffect } from "react"
import Sidebar from "@/components/home/Sidebar"
import Topbar from "@/components/home/Topbar"
import { Sparkles, Send, User, Bot, RefreshCw, Lightbulb, Globe, GraduationCap, Briefcase, ChevronRight } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  time: string
}

function formatTime(): string {
  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${m} ${ampm}`
}

const SUGGESTED_PROMPTS = [
  { icon: GraduationCap, label: "Find scholarships for Computer Science students in Europe" },
  { icon: Globe, label: "What are the best internships for a first-year student?" },
  { icon: Briefcase, label: "How do I write a strong application for a fellowship?" },
  { icon: Lightbulb, label: "Suggest global opportunities for a student from India" },
]

const AI_RESPONSES: Record<string, string> = {
  default: `I'm your Gonn'a Global AI assistant! I can help you:

• **Find scholarships, internships & fellowships** tailored to your profile
• **Craft strong applications** with tips on essays, CVs and cover letters  
• **Explore global opportunities** by country, field or deadline
• **Understand eligibility** requirements for specific programs
• **Plan your global journey** step by step

What would you like help with today?`,

  scholarship: `Here are some top **scholarships** worth exploring:

🎓 **Chevening Scholarship** (UK)
Fully-funded masters for future leaders. Open to students from 160+ countries.
Deadline: Nov 2025

🎓 **DAAD Scholarship** (Germany)  
Research & study grants for international students. Covers tuition + living costs.
Deadline: Rolling

🎓 **Fulbright Program** (USA)
Prestigious exchange program for graduate study, research and teaching.
Deadline: Oct 2025

🎓 **Commonwealth Scholarship** (UK/Commonwealth)
For students from Commonwealth nations pursuing masters or PhD.
Deadline: Dec 2025

Would you like detailed eligibility info or application tips for any of these?`,

  internship: `Great question! Here are **top internship opportunities** to consider:

💼 **Google STEP Internship** — For first/second year CS students
💼 **UN Youth Volunteer Programme** — For global development enthusiasts  
💼 **Microsoft Explore Program** — For early-stage tech students
💼 **AIESEC Global Internships** — 400+ countries, multiple fields
💼 **World Bank Young Professionals** — For economics/policy students

**Tips for a strong application:**
1. Tailor your CV to each role
2. Write a specific cover letter (not generic)
3. Highlight projects, not just coursework
4. Apply 3–6 months before the start date

Want me to help you identify the best fit based on your field of study?`,

  fellowship: `Writing a **strong fellowship application** involves several key elements:

📝 **Personal Statement**
- Open with a compelling story, not a summary
- Connect your past experience to your future goals
- Be specific about why *this* fellowship, not fellowships in general

📝 **Research Proposal** (if required)
- Clearly state the problem you want to solve
- Show awareness of existing work in the field
- Explain your unique approach

📝 **Letters of Recommendation**
- Choose recommenders who know your work well
- Brief them with your goals and the fellowship's focus
- Give them 4–6 weeks notice

📝 **Common Mistakes to Avoid**
- Vague goals ("I want to help people")
- Generic essays not tailored to the program
- Submitting without proofreading

Which fellowship are you applying to? I can give more specific advice!`,

  india: `Exciting opportunities available for **students from India**:

🌍 **International Scholarships**
- Inlaks Shivdasani Foundation Scholarship
- JN Tata Endowment Loan Scholarship  
- Aga Khan Foundation International Scholarship
- Narotam Sekhsaria Foundation Scholarship

🌍 **Government Programs**
- ICCR Scholarships (outbound)
- National Overseas Scholarship (SC/ST students)
- INSPIRE Scholarship (science students)

🌍 **Global Fellowships**
- Obama Foundation Leaders Asia-Pacific
- Acumen Fellows Program
- Atlas Corps Fellowship

🌍 **Research Opportunities**
- DAAD-IIT Research Internships in Science and Engineering (RISE)
- Mitacs Globalink (Canada)
- JSPS Summer Program (Japan)

Would you like to filter by field of study or country preference?`
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes("scholarship") || lower.includes("fund")) return AI_RESPONSES.scholarship
  if (lower.includes("internship") || lower.includes("intern")) return AI_RESPONSES.internship
  if (lower.includes("fellowship") || lower.includes("application") || lower.includes("apply") || lower.includes("essay")) return AI_RESPONSES.fellowship
  if (lower.includes("india") || lower.includes("indian")) return AI_RESPONSES.india
  return `Thanks for your question! Here's what I can help with regarding **"${input}"**:

Gonn'a Global indexes thousands of opportunities across scholarships, internships, fellowships, conferences and research programs from 180+ countries.

To give you the most relevant results, could you share:
1. Your **field of study** (e.g. Computer Science, Economics, Medicine)
2. Your **current education level** (Undergraduate, Masters, PhD)
3. Your **country of residence**
4. Any **deadline preferences** (urgent vs. long-term)

With this, I can suggest the best-matched opportunities for you! 🌍`
}

function formatMessage(content: string) {
  // Bold: **text**
  const parts = content.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: AI_RESPONSES.default,
      time: "",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      time: formatTime(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(text),
      time: formatTime(),
    }

    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const resetChat = () => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: AI_RESPONSES.default,
      time: "",
    }])
    setInput("")
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-gray-900">
      <Sidebar />
      <div className="lg:ml-[80px] flex flex-col h-screen">
        <Topbar />

        <div className="flex flex-1 overflow-hidden">
          {/* ── LEFT PANEL — Chat ── */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-[#E7DDD1] bg-white px-5 py-3.5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">
                  <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Gonn'a Global AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <p className="text-[11px] text-gray-500">Online · Ready to help</p>
                  </div>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="flex items-center gap-1.5 rounded-lg border border-[#E7DDD1] bg-[#F8F5F0] px-3 py-1.5 text-[12px] font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100"
              >
                <RefreshCw className="h-3.5 w-3.5" /> New chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
              <div className="mx-auto max-w-3xl space-y-5">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${
                      msg.role === "assistant"
                        ? "bg-gradient-to-br from-[#2563EB] to-[#7C3AED]"
                        : "bg-[#EFE7DC]"
                    }`}>
                      {msg.role === "assistant"
                        ? <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                        : <User className="h-4 w-4 text-[#6B5B52]" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13.5px] leading-[1.75] ${
                      msg.role === "assistant"
                        ? "bg-white border border-[#E7DDD1] text-gray-700 rounded-tl-sm shadow-sm"
                        : "bg-[#2563EB] text-white rounded-tr-sm"
                    }`}>
                      {msg.role === "assistant"
                        ? msg.content.split("\n").map((line, i) => (
                            <p key={i} className={line === "" ? "h-2" : ""}>
                              {formatMessage(line)}
                            </p>
                          ))
                        : <p>{msg.content}</p>
                      }
                      <p className={`mt-1.5 text-[10px] ${msg.role === "assistant" ? "text-gray-400" : "text-white/60"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">
                      <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[#E7DDD1] bg-white px-4 py-3 shadow-sm">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Suggested prompts */}
            {messages.length === 1 && (
              <div className="border-t border-[#E7DDD1] bg-white px-4 py-3 sm:px-8">
                <div className="mx-auto max-w-3xl">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Try asking</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SUGGESTED_PROMPTS.map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        onClick={() => sendMessage(label)}
                        className="group flex items-start gap-2 rounded-xl border border-[#E7DDD1] bg-[#F8F5F0] px-3 py-2.5 text-left text-[11.5px] text-gray-600 transition hover:border-[#2563EB]/30 hover:bg-blue-50 hover:text-[#2563EB]"
                      >
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                        <span className="leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="border-t border-[#E7DDD1] bg-white px-4 py-4 sm:px-8">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-3 rounded-2xl border border-[#E0D5CC] bg-[#F8F5F0] px-4 py-3 transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about scholarships, internships, fellowships..."
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-[13.5px] text-gray-900 outline-none placeholder:text-gray-400"
                    style={{ maxHeight: "120px" }}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-center text-[10.5px] text-gray-400">
                  AI responses are for guidance only. Always verify deadlines and eligibility on official websites.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL — Quick Links (desktop) ── */}
          <div className="hidden xl:flex w-[280px] shrink-0 flex-col border-l border-[#E7DDD1] bg-white overflow-y-auto">
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Quick Explore</p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { label: "Top Scholarships 2025", tag: "New" },
                  { label: "Remote Internships", tag: "Hot" },
                  { label: "UN Fellowships", tag: "" },
                  { label: "Research Programs", tag: "" },
                  { label: "Hackathons & Competitions", tag: "" },
                  { label: "Conference Grants", tag: "" },
                ].map(({ label, tag }) => (
                  <button key={label} className="group flex items-center justify-between rounded-xl border border-[#F0EAE4] bg-[#F8F5F0] px-3 py-2.5 text-left transition hover:border-[#2563EB]/30 hover:bg-blue-50">
                    <span className="text-[12.5px] font-medium text-gray-700 group-hover:text-[#2563EB]">{label}</span>
                    <div className="flex items-center gap-1.5">
                      {tag && (
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${tag === "New" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                          {tag}
                        </span>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#2563EB]" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">AI Can Help You With</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Scholarships", "Internships", "Fellowships", "CV Tips", "Essay Writing", "Deadlines", "Eligibility", "Countries"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => sendMessage(tag)}
                      className="rounded-full border border-[#E0D5CC] bg-[#F8F5F0] px-3 py-1 text-[11.5px] font-medium text-[#6B5B52] transition hover:border-[#2563EB]/40 hover:bg-blue-50 hover:text-[#2563EB]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
