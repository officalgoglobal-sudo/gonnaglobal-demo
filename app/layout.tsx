import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.officalgoglobal.in"
  ),

  title: {
    default: "GoGlobal | Discover Global Opportunities",
    template: "%s | GoGlobal",
  },

  description:
    "Discover internships, fellowships, scholarships, conferences, hackathons, competitions, research programs and global opportunities from around the world.",

  keywords: [
    "global opportunities",
    "internships",
    "scholarships",
    "fellowships",
    "hackathons",
    "conferences",
    "research programs",
    "student opportunities",
    "international opportunities",
    "GoGlobal",
  ],

  icons: {
    icon: "/goglobal-icon.png",
  },

  openGraph: {
    title: "GoGlobal",
    description:
      "Discover opportunities beyond borders.",
    siteName: "GoGlobal",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}