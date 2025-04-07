"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Award,
  ChevronRight,
  Users,
  Clock,
  Building,
  Globe,
  ChevronDown,
  Linkedin,
  Calendar,
  Sparkles,
  Star,
  Lightbulb,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Zap,
  Shield,
  Mail,
  Phone,
  Target,
  Heart,
  GraduationCap,
  ChevronLeft,
  ImageIcon
} from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import Header from "../components/Header"
import Footer from "../components/Footer"
import { getThemePreference, setThemePreference } from "../utils/theme"
import { useLanguage } from "../contexts/LanguageContext"

// Import translations
import { translations } from "../translations"

// Define member type
interface TeamMember {
  name: string
  position: string
  image: string
  social: {
    linkedin: string
    Mail: string
    Phone: string
  }
}

// Add BackgroundSlider import
import BackgroundSlider from "../components/BackgroundSlider"

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(true)
  const { language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)
  const [activeMemberIndex, setActiveMemberIndex] = useState<number | null>(null)
  const [visibleTimelineItems, setVisibleTimelineItems] = useState<number[]>([])
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState("story")
  const [isMobile, setIsMobile] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [gallery, setGallery] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: storyScrollProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: timelineScrollProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: valuesScrollProgress } = useScroll({
    target: valuesRef,
    offset: ["start end", "end start"],
  })

  const storyOpacity = useTransform(storyScrollProgress, [0, 0.3], [0.4, 1])
  const storyScale = useTransform(storyScrollProgress, [0, 0.3], [0.95, 1])
  const timelineProgress = useTransform(timelineScrollProgress, [0, 1], [0, 100])

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get translations based on current language
  const t = translations[language]

  // Initialize theme on mount and check for mobile
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === "dark")
    setThemePreference(theme)

    // Check for mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      return window.innerWidth < 768
    }

    // Initial check
    checkMobile()

    // Handle resize events
    const handleResize = () => {
      if (checkMobile() && activeMemberIndex !== null) {
        setActiveMemberIndex(null)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeMemberIndex])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light"
      setThemePreference(newTheme)
      return !prev
    })
  }

  // Toggle language
  const toggleLanguage = (lang?: "fr" | "en") => {
    if (lang) {
      setLanguage(lang)
    } else {
      setLanguage(language === "fr" ? "en" : "fr")
    }
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // XS Breakpoint styles
  const xsBreakpointStyles = `
    /* XS Breakpoint for Timeline */
    @media (min-width: 480px) {
      .xs\\:w-1\\/2 {
        width: 50%;
      }
      .xs\\:pr-8 {
        padding-right: 2rem;
      }
      .xs\\:pl-8 {
        padding-left: 2rem;
      }
      .xs\\:text-right {
        text-align: right;
      }
      .xs\\:text-left {
        text-align: left;
      }
      .xs\\:flex-row {
        flex-direction: row;
      }
      .xs\\:order-1 {
        order: 1;
      }
      .xs\\:left-1\\/2 {
        left: 50%;
      }
      .xs\\:-ml-0\\.5 {
        margin-left: -0.125rem;
      }
      .xs\\:-translate-x-1\\/2 {
        transform: translateX(-50%);
      }
      .xs\\:rounded-tr-none {
        border-top-right-radius: 0;
      }
      .xs\\:rounded-tl-none {
        border-top-left-radius: 0;
      }
      .xs\\:pb-0 {
        padding-bottom: 0;
      }
      .xs\\:block {
        display: block;
      }
    }
  `

  // Handle member card click
  const handleMemberClick = (index: number) => {
    setActiveMemberIndex(activeMemberIndex === index ? null : index)
  }

  // Handle value card hover
  const handleValueHover = (index: number | null) => {
    setActiveValueIndex(index)
  }

  // Intersection observer for timeline items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number.parseInt(entry.target.getAttribute("data-index") || "0")
          if (entry.isIntersecting) {
            setVisibleTimelineItems((prev) => [...prev, id])
          } else {
            setVisibleTimelineItems((prev) => prev.filter((item) => item !== id))
          }
        })
      },
      { threshold: 0.3 },
    )

    const timelineItems = document.querySelectorAll(".timeline-item")
    timelineItems.forEach((item) => observer.observe(item))

    return () => {
      timelineItems.forEach((item) => observer.unobserve(item))
    }
  }, [])

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id) {
              setActiveSection(id)
            }
          }
        })
      },
      { threshold: 0.3, rootMargin: "-100px 0px" },
    )

    const sections = [
      heroRef.current,
      storyRef.current,
      timelineRef.current,
      valuesRef.current,
      missionRef.current,
      teamRef.current,
      galleryRef.current,
    ]

    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  // Team members data with correct field names
  const teamMembers = [
    {
      name: "Rachid Zghal",
      position: language === "fr" ? "Président" : "President",
      image: "/images/team/rachid.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Koussay Ayari",
      position: language === "fr" ? "Vice-Président" : "Vice President",
      image: "/images/team/koussay.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Houssem Hkiri",
      position: language === "fr" ? "Trésorier" : "Treasurer",
      image: "/images/team/hkiri.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Chaima Hamdi",
      position: language === "fr" ? "Secrétaire Générale" : "General Secretary",
      image: "/images/team/chaima.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Takwa Fredj",
      position: language === "fr" ? "Responsable RH et Formations" : "HR and Training Manager",
      image: "/images/team/takwa.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Youssef Belghith",
      position: language === "fr" ? "Responsable Projets" : "Projects Manager",
      image: "/images/team/youssef.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Houssem Mseddi",
      position: language === "fr" ? "Responsable Développement Commercial" : "Business Development Manager",
      image: "/images/team/mseddi.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
    {
      name: "Hamza Kammoun",
      position: language === "fr" ? "Responsable Affaires Internationales" : "International Affairs Manager",
      image: "/images/team/hamza.webp",
      social: {
        linkedin: "#",
        Mail: "contact@example.com",
        Phone: "+216 00 000 000",
      },
    },
  ]

  // Timeline data
  const timeline = [
    {
      year: "1999",
      title: language === "fr" ? "Fondation" : "Foundation",
      description:
        language === "fr"
          ? "ENIT Junior Entreprise est fondée par un groupe d'étudiants visionnaires."
          : "ENIT Junior Entreprise is founded by a group of visionary students.",
      icon: Sparkles,
      color: "from-blue-500 to-purple-500",
    },
    {
      year: "2012",
      title: language === "fr" ? "Premier Grand Projet" : "First Major Project",
      description:
        language === "fr"
          ? "Cofondation de la Confédération Tunisienne des Junior Entreprises (JET)."
          : "Co-founding of Junior Entreprise of Tunisia (JET).",
      icon: Award,
      color: "from-green-500 to-teal-500",
    },
    {
      year: "2016",
      title: language === "fr" ? "Label Projets" : "Projects Label",
      description:
        language === "fr"
          ? "Obtention du label Projets au sein de JET Awards 2016."
          : "Obtaining the Projects Label within JET Awards 2016.",
      icon: Users,
      color: "from-orange-500 to-amber-500",
    },
    {
      year: "2019",
      title: language === "fr" ? "Prix d'Excellence" : "Excellence Award",
      description:
        language === "fr"
          ? "L'ENIT Junior Entreprise élue meilleure Junior Entreprise Tunisienne avec le prix d'excellence."
          : "ENIT Junior Entreprise was elected best Tunisian Junior Entreprise with the Excellence Award.",
      icon: Star,
      color: "from-red-500 to-pink-500",
    },
    {
      year: "2024",
      title: language === "fr" ? "25ème Édition du Forum ENIT Entreprise" : "25th Edition of ENIT Enterprise Forum",
      description:
        language === "fr"
          ? "L'ENIT Junior Entreprise organise la 25ème édition du Forum ENIT Entreprise."
          : "ENIT Junior Entreprise organizes the 25th edition of ENIT Enterprise Forum.",
      icon: Calendar,
      color: "from-purple-500 to-indigo-500",
    },
  ]


  // Stats data
  const stats = [
    {
      icon: Award,
      value: "50+",
      label: language === "fr" ? "Projets Réalisés" : "Projects Completed",
      delay: 0,
    },
    {
      icon: Users,
      value: "100+",
      label: language === "fr" ? "Membres Étudiants" : "Student Members",
      delay: 0.1,
    },
    {
      icon: Clock,
      value: "12",
      label: language === "fr" ? "Années d'Expérience" : "Years of Experience",
      delay: 0.2,
    },
    {
      icon: Building,
      value: "30+",
      label: language === "fr" ? "Partenaires Commerciaux" : "Business Partners",
      delay: 0.3,
    },
  ]

  // Navigation items
  const navItems = [
    { id: "story", label: language === "fr" ? "Notre Histoire" : "Our Story" },
    { id: "timeline", label: language === "fr" ? "Parcours" : "Journey" },
    { id: "values", label: language === "fr" ? "Valeurs" : "Values" },
    { id: "mission", label: language === "fr" ? "Mission" : "Mission" },
    { id: "team", label: language === "fr" ? "Équipe" : "Team" },
    { id: "gallery", label: language === "fr" ? "Galerie" : "Gallery" },
  ]

  // Gallery event data
  const eventTitles = [
    "Annual Conference",
    "Workshop Series",
    "Team Building",
    "Innovation Day",
    "Hackathon",
    "Awards Ceremony",
  ]

  const eventTitles_fr = [
    "Conférence Annuelle",
    "Série d'Ateliers",
    "Team Building",
    "Journée d'Innovation",
    "Hackathon",
    "Cérémonie de Remise des Prix",
  ]

  const eventDates = ["March 2023", "June 2023", "August 2023", "September 2023", "October 2023", "December 2023"]

  const eventDates_fr = ["Mars 2023", "Juin 2023", "Août 2023", "Septembre 2023", "Octobre 2023", "Décembre 2023"]

  // Values data with proper translations
  const values = [
    {
      icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: language === "fr" ? "Professionnalisme" : "Professionalism",
      description:
        language === "fr"
          ? "Nous agissons avec professionnalisme dans toutes nos interactions et nous nous efforçons d'offrir des services de la plus haute qualité."
          : "We act with professionalism in all our interactions and strive to deliver services of the highest quality.",
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: language === "fr" ? "Engagement" : "Commitment",
      description:
        language === "fr"
          ? "Notre engagement envers nos clients, nos membres et notre communauté est indéfectible. Nous tenons nos promesses et respectons nos délais."
          : "Our commitment to our clients, members, and community is unwavering. We keep our promises and meet our deadlines.",
    },
    {
      icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: language === "fr" ? "Ambition" : "Ambition",
      description:
        language === "fr"
          ? "Nous visons constamment l'excellence et nous nous efforçons de repousser les limites pour atteindre des objectifs toujours plus élevés."
          : "We constantly aim for excellence and strive to push boundaries to achieve ever higher goals.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: language === "fr" ? "Expertise" : "Expertise",
      description:
        language === "fr"
          ? "Nous développons et partageons notre expertise dans divers domaines pour offrir des solutions innovantes et efficaces."
          : "We develop and share our expertise in various fields to offer innovative and effective solutions.",
    },
    {
      icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: language === "fr" ? "Collaboration" : "Collaboration",
      description:
        language === "fr"
          ? "Nous croyons en la puissance du travail d'équipe et de la collaboration pour atteindre des résultats supérieurs à ce que nous pourrions accomplir individuellement."
          : "We believe in the power of teamwork and collaboration to achieve results greater than what we could accomplish individually.",
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: language === "fr" ? "Intégrité" : "Integrity",
      description:
        language === "fr"
          ? "Nous agissons avec honnêteté, transparence et éthique dans toutes nos interactions, gagnant ainsi la confiance de nos partenaires."
          : "We act with honesty, transparency, and ethics in all our interactions, earning the trust of our partners.",
    },
  ]

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGallery(data || [])
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % gallery.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy text-navy dark:text-white overflow-x-hidden transition-colors duration-300">
      <style jsx global>{`
        /* XS Breakpoint styles */
        ${xsBreakpointStyles}
        
        /* Animation keyframes and classes - Improved for smoothness */
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(15px);
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes blobAnimation {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }
        
        /* Animation classes - Smoother transitions */
        .floating-animation-1 {
          animation: float1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .floating-animation-2 {
          animation: float2 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .floating-animation-3 {
          animation: float3 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .rotating-animation {
          animation: rotate 20s linear infinite;
        }
        .blob-animation {
          animation: blobAnimation 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-blob {
          animation: blob 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        /* Particle animations */
        .particle:nth-child(1) {
          animation: float-1 8s ease-in-out infinite;
        }
        .particle:nth-child(2) {
          animation: float-2 12s ease-in-out infinite;
        }
        .particle:nth-child(3) {
          animation: float-3 10s ease-in-out infinite;
        }
        .particle:nth-child(4) {
          animation: float-4 14s ease-in-out infinite;
        }
        .particle:nth-child(5) {
          animation: float-5 9s ease-in-out infinite;
        }

        /* Dark mode specific colors */
        :root {
          --color-secondary-rgb: 101, 163, 182;
          --color-turquoise: #65a3b6;
          --color-navy: #0f172a;
          --color-yellow: #fbbf24;
        }
        
        .dark body {
          --color-primary-bg: var(--color-navy);
          --color-secondary-bg: #182234;
          --color-accent: var(--color-turquoise);
          --color-highlight: var(--color-yellow);
          --color-text: #ffffff;
          --color-text-secondary: rgba(255, 255, 255, 0.7);
        }
        
        /* Apply dark mode colors to specific elements */
        .dark .bg-navy-light {
          background-color: #182234;
        }
        
        .dark .border-navy {
          border-color: var(--color-turquoise);
        }
        
        .dark .dark\:shadow-navy {
          --tw-shadow-color: var(--color-turquoise);
        }

        /* Responsive styles */
        @media (min-width: 480px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* Improved responsiveness for smallest screens */
        @media (max-width: 350px) {
          .text-xs {
            font-size: 0.65rem;
          }
          .px-2\\.5 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        
        /* Additional responsive improvements */
        @media (max-width: 640px) {
          .sm-text-balance {
            text-wrap: balance;
          }
          .sm-line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
        
        /* Optimize images for mobile */
        @media (max-width: 768px) {
          .optimize-image-loading {
            content-visibility: auto;
          }
        }
        
        /* Improve touch targets on mobile */
        @media (max-width: 640px) {
          .improve-touch-target {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>

      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      {/* Floating Navigation - Improved for better mobile experience */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-white/90 dark:bg-navy/90 backdrop-blur-md rounded-full shadow-lg p-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-secondary dark:bg-turquoise text-white"
                    : "hover:bg-gray-100 dark:hover:bg-navy-light/20 text-gray-700 dark:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Improved touch targets and visibility */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden w-[90%] max-w-md">
        <div className="bg-white/90 dark:bg-navy/90 backdrop-blur-md rounded-full shadow-lg p-1.5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-1.5">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`px-1.5 py-1.5 text-[10px] font-medium rounded-full transition-all duration-300 whitespace-nowrap improve-touch-target flex items-center justify-center ${
                  activeSection === item.id
                    ? "bg-secondary dark:bg-turquoise text-white"
                    : "hover:bg-gray-100 dark:hover:bg-navy-light/20 text-gray-700 dark:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section - Using BackgroundSlider from home page */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background slider */}
        <div className="absolute inset-0 z-0">
          <BackgroundSlider />
          
          {/* Overlay gradients - Fixed for light/dark mode */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 dark:from-navy/90 dark:via-navy/80 dark:to-navy/95 mix-blend-multiply"></div>
          
          {/* Additional white accent overlay for light mode */}
          <div className="absolute inset-0 bg-white/30 dark:bg-transparent"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-20 dark:opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-secondary-rgb),0.2),transparent_70%)]"></div>
          
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('/patterns/circuit-board.svg')] bg-repeat opacity-5 dark:opacity-10"></div>
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="particle bg-secondary/30 w-2 h-2 rounded-full absolute top-1/4 left-1/4"></div>
          <div className="particle bg-secondary/20 w-3 h-3 rounded-full absolute top-1/3 left-2/3"></div>
          <div className="particle bg-secondary/40 w-2 h-2 rounded-full absolute top-2/3 left-1/5"></div>
          <div className="particle bg-secondary/30 w-4 h-4 rounded-full absolute top-1/2 left-3/4"></div>
          <div className="particle bg-secondary/20 w-3 h-3 rounded-full absolute top-3/4 left-1/3"></div>
        </div>

        {/* Content container - Improved for small screens */}
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-4xl mx-auto">
            {/* Hero content with animations */}
            <div className="text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8 inline-block"
              >
                <div className="bg-white/30 dark:bg-navy/30 p-2 sm:p-3 rounded-full inline-flex items-center gap-2 border border-white/20 dark:border-turquoise/20 shadow-xl">
                  <span className="bg-turquoise text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                    {language === "fr" ? "DEPUIS 1999" : "SINCE 1999"}
                  </span>
                  <span className="text-navy dark:text-white/90 text-xs sm:text-sm px-1 sm:px-2">
                    {language === "fr" ? "Excellence & Innovation" : "Excellence & Innovation"}
                  </span>
                </div>
              </motion.div>

              {/* Main heading with text reveal animation - Improved text balance */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative mb-6"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-navy dark:text-white leading-tight sm-text-balance">
                  <span className="inline-block overflow-hidden relative">
                    <motion.span
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                      className="inline-block"
                    >
                      {language === "fr" ? "À Propos " : "About "}
                    </motion.span>
                  </span>
                  <span className="inline-block overflow-hidden relative">
                    <motion.span
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
                      className="inline-block"
                    >
                      {language === "fr" ? "d'ENIT " : "ENIT "}
                    </motion.span>
                  </span>
                  <span className="inline-block overflow-hidden relative">
                    <motion.span
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-turquoise/80"
                    >
                      {language === "fr" ? "Junior Entreprise" : "Junior Entreprise"}
                    </motion.span>
                  </span>
                </h1>
              </motion.div>

              {/* Description with glass morphism - Improved for small screens */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mb-10"
              >
                <p className="text-base sm:text-lg md:text-xl text-navy dark:text-white/90 max-w-3xl mx-auto bg-white/10 dark:bg-turquoise/5 p-3 sm:p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl sm-text-balance">
                  {language === "fr"
                    ? "Découvrez notre mission, notre vision et l'équipe talentueuse derrière notre succès"
                    : "Learn about our mission, vision, and the talented team behind our success"}
                </p>
              </motion.div>

              {/* CTA Buttons - Improved for small screens */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto max-w-[200px] sm:max-w-none mx-auto sm:mx-0"
                >
                  <Link
                    href="#story"
                    className="w-full px-4 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 bg-turquoise text-white rounded-full hover:bg-turquoise/90 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg font-medium text-sm sm:text-base improve-touch-target"
                  >
                    {language === "fr" ? "Notre Histoire" : "Our Story"}
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto max-w-[200px] sm:max-w-none mx-auto sm:mx-0"
                >
                  <Link
                    href="#team"
                    className="w-full px-4 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 bg-navy/80 dark:bg-white/10 text-white border border-white/30 rounded-full hover:bg-navy/90 dark:hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg font-medium text-sm sm:text-base improve-touch-target"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {language === "fr" ? "Notre Équipe" : "Our Team"}
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Improved positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center items-center z-30 w-full"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-navy dark:text-white/70 text-sm mb-2 font-light tracking-wider">
              {language === "fr" ? "DÉFILER" : "SCROLL"}
            </span>
            <div className="w-7 h-12 sm:w-8 sm:h-14 rounded-full border-2 border-navy/70 dark:border-white/30 flex items-center justify-center p-1">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                className="w-1.5 h-3 bg-navy/70 dark:bg-white/80 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Clean line separator instead of fading transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-px w-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </section>

      {/* Stats Banner - Improved for small screens */}
      <section className="py-6 sm:py-8 md:py-12 bg-white dark:bg-navy relative z-10 border-b border-gray-100 dark:border-navy-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
              >
                <div className="absolute inset-0 bg-secondary/5 dark:bg-secondary/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative z-10 p-3 sm:p-4 md:p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-2 sm:mb-3 md:mb-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full text-secondary group-hover:from-secondary group-hover:to-secondary/80 group-hover:text-white transition-all duration-300">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  </div>
                  <motion.h3
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-1 sm:mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: stat.delay + 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section - Fixed colors for dark mode */}
      <section
        id="story"
        ref={storyRef}
        className="py-12 sm:py-20 bg-white dark:bg-navy relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy/5 dark:bg-turquoise/5 rounded-full blur-3xl"></div>

        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          style={{ opacity: storyOpacity, scale: storyScale }}
        >
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-turquoise/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-105">
                <span className="text-turquoise font-medium tracking-widest text-xs sm:text-sm">
                  {language === "fr" ? "NOTRE HISTOIRE" : "OUR STORY"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy dark:text-turquoise sm-text-balance">
                {language === "fr" ? "Comment Tout a Commencé" : "How It All Started"}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto text-sm sm:text-base sm-text-balance">
                {language === "fr"
                  ? "Découvrez le parcours qui a façonné ENIT Junior Entreprise en l'organisation qu'elle est aujourd'hui."
                  : "Discover the journey that shaped ENIT Junior Enterprise into the organization it is today."}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Image Column */}
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-[250px] sm:h-[300px] md:h-[500px] border border-transparent dark:border-turquoise/10">
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Our Story"
                  fill
                  className="object-cover optimize-image-loading"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent dark:from-navy/90"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
                  <div className="flex space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    {[...Array(4)].map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white opacity-60 first:opacity-100 first:bg-turquoise"
                      ></span>
                    ))}
                  </div>
                  <h3 className="text-white text-base sm:text-lg md:text-2xl font-bold mb-2">
                    {language === "fr" ? "25 ans d'excellence" : "25 years of excellence"}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              className="order-1 md:order-2 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base sm-text-balance">
                  {language === "fr"
                    ? "Fondée en 1999 par un groupe d'étudiants ambitieux de l'École Nationale d'Ingénieurs de Tunis, ENIT Junior Entreprise est née d'une vision commune : créer un pont entre le monde académique et le monde professionnel."
                    : "Founded in 1999 by a group of ambitious students from the National Engineering School of Tunis, ENIT Junior Enterprise was born from a shared vision: to create a bridge between the academic and professional worlds."}
                </p>
                <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base sm-text-balance">
                  {language === "fr"
                    ? "Au fil des années, nous avons évolué d'une petite équipe d'étudiants passionnés à une organisation dynamique reconnue pour son expertise et son professionnalisme. Chaque génération d'étudiants a contribué à notre croissance, apportant de nouvelles idées, compétences et perspectives."
                    : "Over the years, we have evolved from a small team of passionate students to a dynamic organization recognized for its expertise and professionalism. Each generation of students has contributed to our growth, bringing new ideas, skills, and perspectives."}
                </p>
                <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base sm-text-balance">
                  {language === "fr"
                    ? "Aujourd'hui, nous sommes fiers de notre héritage et de l'impact que nous avons eu sur la vie de centaines d'étudiants et de dizaines d'entreprises. Notre histoire continue de s'écrire, chapitre après chapitre, avec chaque nouveau projet et chaque nouveau membre."
                    : "Today, we are proud of our heritage and the impact we have had on the lives of hundreds of students and dozens of companies. Our story continues to be written, chapter by chapter, with each new project and each new member."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:flex sm:space-x-6">
                <div className="bg-white dark:bg-navy/50 p-3 sm:p-4 rounded-xl shadow-md border border-gray-100 dark:border-turquoise/10 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-turquoise mb-1">25+</p>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {language === "fr" ? "Années" : "Years"}
                  </p>
                </div>
                <div className="bg-white dark:bg-navy/50 p-3 sm:p-4 rounded-xl shadow-md border border-gray-100 dark:border-turquoise/10 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-turquoise mb-1">500+</p>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {language === "fr" ? "Membres" : "Members"}
                  </p>
                </div>
                <div className="bg-white dark:bg-navy/50 p-3 sm:p-4 rounded-xl shadow-md border border-gray-100 dark:border-turquoise/10 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-turquoise mb-1">100+</p>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {language === "fr" ? "Projets" : "Projects"}
                  </p>
                </div>
                <div className="bg-white dark:bg-navy/50 p-3 sm:p-4 rounded-xl shadow-md border border-gray-100 dark:border-turquoise/10 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-turquoise mb-1">20+</p>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {language === "fr" ? "Prix" : "Awards"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Timeline Section - Fixed colors for dark mode */}
      <section
        id="timeline"
        ref={timelineRef}
        className="py-12 sm:py-20 bg-gray-50 dark:bg-navy relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy/5 dark:bg-turquoise/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-turquoise/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-105">
                <span className="text-turquoise font-medium tracking-widest text-xs sm:text-sm">
                  {language === "fr" ? "NOTRE PARCOURS" : "OUR JOURNEY"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy dark:text-white sm-text-balance">
                {language === "fr" ? "Les Moments Clés de Notre Histoire" : "Key Moments in Our History"}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto text-sm sm:text-base sm-text-balance">
                {language === "fr"
                  ? "Explorez les étapes importantes qui ont marqué notre évolution depuis notre création."
                  : "Explore the important milestones that have marked our evolution since our founding."}
              </p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-turquoise/30 dark:bg-turquoise/20"></div>

            <div className="space-y-6 sm:space-y-8 relative">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`flex flex-col sm:flex-row ${index % 2 === 0 ? "" : "sm:flex-row-reverse"}`}>
                    <div className={`flex ${index % 2 === 0 ? "justify-end sm:pr-8" : "sm:pl-8"} sm:w-1/2`}>
                      <div
                        className={`bg-white dark:bg-navy/50 p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-turquoise/10 ${
                          index % 2 === 0 ? "sm:rounded-tr-none" : "sm:rounded-tl-none"
                        } max-w-md sm:max-w-sm w-full`}
                      >
                        <time className="text-xs sm:text-sm font-bold text-turquoise mb-1 block">{item.year}</time>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-navy dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm md:text-base sm-line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-turquoise ring-4 ring-white dark:ring-navy shrink-0 flex items-center justify-center z-10 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="text-white w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section - Fixed colors for dark mode - Changing yellow to turquoise */}
      <section
        id="values"
        ref={valuesRef}
        className="py-12 sm:py-20 bg-white dark:bg-navy relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-turquoise/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-105">
                <span className="text-turquoise font-medium tracking-widest text-xs sm:text-sm">
                  {language === "fr" ? "NOS VALEURS" : "OUR VALUES"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy dark:text-turquoise sm-text-balance">
                {language === "fr" ? "Les Principes Qui Nous Guident" : "The Principles That Guide Us"}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto text-sm sm:text-base sm-text-balance">
                {language === "fr"
                  ? "Nos valeurs fondamentales définissent notre culture et guident nos actions quotidiennes."
                  : "Our core values define our culture and guide our daily actions."}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-navy/60 rounded-2xl p-4 sm:p-6 md:p-8 shadow-md border border-gray-100 dark:border-turquoise/10 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 50,
                }}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/30 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-turquoise/5 rounded-full blur-2xl transform transition-transform duration-700 group-hover:scale-150"></div>

                <div className="mb-4 sm:mb-6 relative">
                  <div className="inline-flex w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full bg-turquoise/10 text-turquoise dark:text-turquoise">
                    {value.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-navy dark:text-white group-hover:text-turquoise dark:group-hover:text-turquoise transition-colors duration-300">
                  {value.title}
                </h3>

                <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base line-clamp-4 mb-3 sm:mb-4 sm-line-clamp-3">
                  {value.description}
                </p>

                <motion.button
                  className="text-turquoise dark:text-turquoise inline-flex items-center text-xs sm:text-sm font-medium hover:underline improve-touch-target"
                  whileHover={{ x: 5 }}
                >
                  {language === "fr" ? "En savoir plus" : "Learn more"}
                  <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Fixed colors for dark mode */}
      <section
        id="mission"
        ref={missionRef}
        className="py-12 sm:py-20 bg-gray-50 dark:bg-navy relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-navy/5 dark:bg-turquoise/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-turquoise/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-105">
                <span className="text-turquoise font-medium tracking-widest text-xs sm:text-sm">
                  {language === "fr" ? "NOTRE MISSION" : "OUR MISSION"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy dark:text-white sm-text-balance">
                {language === "fr" ? "Pourquoi Nous Existons" : "Why We Exist"}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto text-sm sm:text-base sm-text-balance">
                {language === "fr"
                  ? "Notre mission est de créer un pont entre l'éducation théorique et l'expérience pratique."
                  : "Our mission is to create a bridge between theoretical education and practical experience."}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Image column */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-xl h-[300px] sm:h-[350px] md:h-[500px]"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Our Mission"
                fill
                className="object-cover optimize-image-loading"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
                <span className="text-white text-xs uppercase tracking-wider bg-turquoise/70 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-4 inline-block">
                  {language === "fr" ? "Fondée en 1999" : "Est. 1999"}
                </span>
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold max-w-xs mb-2 sm-text-balance">
                  {language === "fr" ? "Propulser les talents de l'ENIT" : "Empowering ENIT talent"}
                </h3>
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div
              className="space-y-4 sm:space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white dark:bg-navy/60 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-turquoise/10">
                <div className="flex items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
                  <div className="bg-turquoise/10 p-2 sm:p-3 rounded-full">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-turquoise" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-navy dark:text-white">
                      {language === "fr" ? "Développer des Compétences" : "Develop Skills"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base sm-text-balance">
                      {language === "fr"
                        ? "Nous offrons aux étudiants la possibilité d'acquérir des compétences pratiques en travaillant sur des projets réels avec des clients."
                        : "We offer students the opportunity to gain practical skills by working on real projects with clients."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-navy/60 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-turquoise/10">
                <div className="flex items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
                  <div className="bg-turquoise/10 p-2 sm:p-3 rounded-full">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-turquoise" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-navy dark:text-white">
                      {language === "fr" ? "Créer un Réseau" : "Build Networks"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base sm-text-balance">
                      {language === "fr"
                        ? "Nous facilitons les connexions entre les étudiants, les professionnels et les entreprises pour créer des opportunités."
                        : "We facilitate connections between students, professionals, and businesses to create opportunities."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-navy/60 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-turquoise/10">
                <div className="flex items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
                  <div className="bg-turquoise/10 p-2 sm:p-3 rounded-full">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-turquoise" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-navy dark:text-white">
                      {language === "fr" ? "Promouvoir l'Innovation" : "Drive Innovation"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base sm-text-balance">
                      {language === "fr"
                        ? "Nous encourageons l'esprit d'entreprise et l'innovation en fournissant un environnement où les idées peuvent prospérer."
                        : "We foster entrepreneurship and innovation by providing an environment where ideas can thrive."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <motion.button
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-turquoise text-white rounded-full shadow-md inline-flex items-center hover:bg-turquoise/90 transition-all duration-300 improve-touch-target"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-sm sm:text-base">{language === "fr" ? "En savoir plus" : "Learn more"}</span>
                  <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section - Optimized for better responsiveness */}
      <section
        id="team"
        ref={teamRef}
        className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-navy relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-navy/5 dark:bg-turquoise/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-turquoise/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-105">
                <span className="text-turquoise font-medium tracking-widest text-xs sm:text-sm">
                  {language === "fr" ? "NOTRE ÉQUIPE" : "OUR TEAM"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-navy dark:text-white sm-text-balance">
                {language === "fr" ? "Rencontrez Notre Direction" : "Meet Our Leadership"}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base sm-text-balance">
                {language === "fr"
                  ? "Notre équipe dévouée de leaders étudiants travaille sans relâche pour gérer les projets, développer des partenariats et créer des opportunités pour nos membres."
                  : "Our dedicated team of student leaders works tirelessly to manage projects, develop partnerships, and create opportunities for our members."}
              </p>
            </motion.div>
          </div>

          {/* Improved responsive grid - using grid-cols-1 for smallest screens, xs:grid-cols-2, sm:grid-cols-2, md:grid-cols-3, lg:grid-cols-4 */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-navy/50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-turquoise/10 relative group h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 50,
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 optimize-image-loading"
                      sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-3 sm:p-4 md:p-6 w-full">
                      <p className="text-white text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 sm-line-clamp-3">
                        {member.position}
                      </p>
                      <div className="flex justify-center space-x-2 sm:space-x-3 md:space-x-4">
                        <a
                          href={member.social.linkedin}
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-turquoise/20 flex items-center justify-center text-white hover:bg-turquoise hover:text-white transition-colors duration-300 improve-touch-target"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        </a>
                        <a
                          href={`mailto:${member.social.Mail}`}
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-turquoise/20 flex items-center justify-center text-white hover:bg-turquoise hover:text-white transition-colors duration-300 improve-touch-target"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        </a>
                        <a
                          href={`tel:${member.social.Phone}`}
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-turquoise/20 flex items-center justify-center text-white hover:bg-turquoise hover:text-white transition-colors duration-300 improve-touch-target"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 text-navy dark:text-white group-hover:text-turquoise transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-turquoise text-xs sm:text-sm md:text-base">
                    {member.position}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#team"
                className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-turquoise text-white rounded-full hover:bg-turquoise/90 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-xl improve-touch-target"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="text-sm sm:text-base">
                  {language === "fr" ? "Voir toute l'équipe" : "View full team"}
                </span>
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50 dark:bg-navy relative overflow-hidden" id="gallery" ref={galleryRef}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquoise/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy/5 dark:bg-turquoise/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-turquoise/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-105">
                <span className="text-turquoise font-medium tracking-widest text-xs sm:text-sm">
                  {language === "fr" ? "NOTRE GALERIE" : "OUR GALLERY"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-navy dark:text-white sm-text-balance">
                {language === "fr" ? "Moments Capturés" : "Captured Moments"}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto text-sm sm:text-base sm-text-balance">
                {language === "fr"
                  ? "Découvrez les moments exceptionnels de nos événements et activités à travers notre galerie d'images."
                  : "Discover exceptional moments from our events and activities through our image gallery."}
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise"></div>
            </div>
          ) : gallery.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative max-w-5xl mx-auto"
            >
              {/* Main Slider */}
              <div className="relative h-[500px] sm:h-[600px] overflow-hidden rounded-xl shadow-2xl border border-white/30 dark:border-turquoise/20">
                <img
                  src={gallery[currentSlide]?.image_url}
                  alt={gallery[currentSlide]?.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 flex items-end">
                  <div className="w-full p-6 sm:p-8 md:p-10 text-white">
                    <div className="max-w-4xl mx-auto">
                      <motion.div
                        key={currentSlide} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="inline-block bg-turquoise/80 text-white text-xs px-2 py-1 rounded-full mb-3">
                          {gallery[currentSlide]?.category}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{gallery[currentSlide]?.title}</h3>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-3xl">{gallery[currentSlide]?.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-navy dark:text-navy" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-navy dark:text-navy" />
              </motion.button>

              {/* Thumbnails */}
              <div className="mt-4 overflow-hidden">
                <div className="flex gap-2 justify-center mt-4 pb-2 overflow-x-auto no-scrollbar">
                  {gallery.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentSlide(index)}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden transition-all duration-300 ${
                        index === currentSlide ? 'ring-2 ring-turquoise ring-offset-2 dark:ring-offset-navy' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={item.image_url} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Indicator Dots - Only on small screens */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:hidden">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-turquoise w-4' : 'bg-gray-400/50 dark:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-16">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No images in the gallery yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Fixed blurriness on small screens */}
      <section
        id="cta"
        className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-navy transition-colors duration-300 relative overflow-hidden"
      >
        {/* Background pattern with improved visibility */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/patterns/circuit-board.svg')] bg-repeat opacity-20 dark:opacity-30"></div>
        </div>

        {/* Animated gradient blobs - Enhanced for visibility */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-turquoise/20 dark:bg-turquoise/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-turquoise/15 dark:bg-turquoise/25 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-5xl mx-auto bg-white dark:bg-navy/90 rounded-2xl shadow-xl dark:shadow-turquoise/20 border border-gray-100 dark:border-turquoise/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Column with fixed quality for small screens */}
              <div className="relative h-64 sm:h-72 md:h-auto">
                <div className="absolute inset-0">
                  <Image
                    src="/images/enitje-cta.jpg"
                    alt="Start a project with ENIT Junior Entreprise"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/50 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <span className="bg-turquoise/80 text-white text-xs uppercase tracking-wider px-2 py-1 rounded-full inline-block mb-3 backdrop-blur-sm">
                    {language === "fr" ? "Opportunité" : "Opportunity"}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                    {language === "fr" ? "Commencez un projet" : "Start a project"}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-md">
                    {language === "fr"
                      ? "Nous sommes prêts à transformer vos idées en réalité avec notre expertise et notre passion"
                      : "We're ready to turn your ideas into reality with our expertise and passion"}
                  </p>
                </div>
              </div>

              {/* Content Column - Enhanced for dark mode */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-turquoise/5 dark:to-turquoise/10 opacity-0 dark:opacity-100"></div>
                <div className="relative">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-navy dark:text-turquoise mb-4 sm:mb-5 transition-colors duration-300 sm-text-balance">
                    {language === "fr" ? "Prêt à collaborer ?" : "Ready to collaborate?"}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg transition-colors duration-300 sm-text-balance leading-relaxed">
                    {language === "fr"
                      ? "Que vous soyez une entreprise à la recherche de solutions innovantes ou un étudiant souhaitant rejoindre notre équipe, nous serions ravis d'échanger avec vous et d'explorer ensemble les opportunités de collaboration."
                      : "Whether you're a business looking for innovative solutions or a student wanting to join our team, we'd be delighted to connect with you and explore collaboration opportunities together."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="w-full sm:w-auto"
                    >
                      <Link
                        href="/contact"
                        className="w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-turquoise text-white rounded-full hover:bg-turquoise/90 transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg font-medium text-sm sm:text-base md:text-lg improve-touch-target"
                      >
                        {language === "fr" ? "Contactez-nous" : "Contact Us"}
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="w-full sm:w-auto"
                    >
                      <Link
                        href="/services"
                        className="w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white dark:bg-navy text-navy dark:text-white border border-turquoise/30 dark:border-turquoise/30 rounded-full hover:bg-gray-50 dark:hover:bg-navy/80 transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg font-medium text-sm sm:text-base md:text-lg improve-touch-target"
                      >
                        {language === "fr" ? "Nos Services" : "Our Services"}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

