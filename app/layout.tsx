import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { LanguageProvider } from "./contexts/LanguageContext";
import Script from 'next/script';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://enitje.com'),
  title: {
    default: "ENIT Junior Entreprise - Student-Led Innovation and Engineering Solutions",
    template: "%s | ENIT Junior Entreprise"
  },
  description:
    "ENIT Junior Entreprise is Tunisia's premier student-run engineering consultancy, connecting talented ENIT students with businesses to deliver innovative solutions in software, civil engineering, mechanical design, and more.",
  keywords: [
    "ENIT",
    "Junior Entreprise",
    "student organization",
    "Tunisia",
    "engineering",
    "innovation",
    "projects",
    "consulting",
    "software development",
    "mechanical engineering",
    "civil engineering",
    "student consultancy",
    "Tunis",
    "technical solutions"
  ],
  authors: [{ name: "ENIT Junior Entreprise", url: "https://enitje.com" }],
  creator: "ENIT Junior Entreprise",
  publisher: "ENIT Junior Entreprise",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-TN': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "ENIT Junior Entreprise - Student-Led Innovation and Engineering Solutions",
    description:
      "ENIT Junior Entreprise is Tunisia's premier student-run engineering consultancy, connecting talented ENIT students with businesses to deliver innovative solutions.",
    url: "https://enitje.com",
    siteName: "ENIT Junior Entreprise",
    locale: "fr_TN",
    type: "website",
    images: [
      {
        url: "https://enitje.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ENIT Junior Entreprise",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENIT Junior Entreprise - Student-Led Innovation",
    description:
      "ENIT Junior Entreprise is Tunisia's premier student-run engineering consultancy, connecting talented ENIT students with businesses.",
    images: ["https://enitje.com/images/twitter-image.jpg"],
    creator: "@ENITJunior",
    site: "@ENITJunior",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "engineering",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  generator: 'Next.js'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="alternate" hrefLang="fr-TN" href="https://enitje.com" />
        <link rel="alternate" hrefLang="en-US" href="https://enitje.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://enitje.com" />
      </head>
      <body className={`${montserrat.variable} font-sans`}>
        <LanguageProvider>{children}</LanguageProvider>
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        
        {/* Schema.org structured data */}
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ENIT Junior Entreprise",
              "url": "https://enitje.com",
              "logo": "https://enitje.com/images/logo.webp",
              "sameAs": [
                "https://www.facebook.com/ENITJuniorEntreprise",
                "https://www.linkedin.com/company/enit-junior-entreprise",
                "https://twitter.com/ENITJunior",
                "https://www.instagram.com/enitjuniorentreprise"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+216-XX-XXX-XXX",
                "contactType": "customer service",
                "availableLanguage": ["French", "English", "Arabic"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Campus Universitaire El Manar",
                "addressLocality": "Tunis",
                "postalCode": "2092",
                "addressCountry": "TN"
              },
              "description": "ENIT Junior Entreprise is Tunisia's premier student-run engineering consultancy, connecting talented ENIT students with businesses to deliver innovative solutions."
            }
          `}
        </Script>
      </body>
    </html>
  );
}


import './globals.css'

