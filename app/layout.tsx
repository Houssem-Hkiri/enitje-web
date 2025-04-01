import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
// Add the import for LanguageProvider
import { LanguageProvider } from "./contexts/LanguageContext"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

// Update the metadata with the new domain
export const metadata: Metadata = {
  title: "ENIT Junior Entreprise - Student-Led Innovation",
  description:
    "ENIT Junior Entreprise is a student-run organization fostering entrepreneurship and innovation at ENIT.",
  keywords: [
    "ENIT",
    "Junior Entreprise",
    "student organization",
    "Tunisia",
    "engineering",
    "innovation",
    "projects",
    "consulting",
  ],
  authors: [{ name: "ENIT Junior Entreprise" }],
  creator: "ENIT Junior Entreprise",
  publisher: "ENIT Junior Entreprise",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ENIT Junior Entreprise - Student-Led Innovation",
    description:
      "ENIT Junior Entreprise is a student-run organization fostering entrepreneurship and innovation at ENIT.",
    url: "https://enitje.com",
    siteName: "ENIT Junior Entreprise",
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENIT Junior Entreprise - Student-Led Innovation",
    description:
      "ENIT Junior Entreprise is a student-run organization fostering entrepreneurship and innovation at ENIT.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

// Update the RootLayout function to wrap the children with LanguageProvider
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'