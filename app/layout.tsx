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
    default: "Gonn'a Global | Discover Global Opportunities",
    template: "%s | Gonn'a Global",
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
    "Gonn'a Global",
  ],

  icons: {
    icon: "/gonna-global-logo.png",
  },

  openGraph: {
    title: "Gonn'a Global",
    description:
      "Discover opportunities beyond borders.",
    siteName: "Gonn'a Global",
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