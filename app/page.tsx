"use client"

import React, { useEffect, useState, useRef, Suspense, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown,
  ArrowRight,
  Code2,
  LineChart,
  Cog,
  Zap,
  X,
  Users,
  Rocket,
  Target,
  Award,
  Sun,
  Moon,
  GraduationCap,
  FolderKanban,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { motion, useScroll, useTransform, LazyMotion, domAnimation } from "framer-motion"
import { useLanguage } from "./contexts/LanguageContext"
import dynamic from "next/dynamic"
import Head from "next/head"
import { createContext } from "react"
import { getThemePreference, setThemePreference } from './utils/theme'

type TranslationType = {
  hero: {
    welcome: string
    title: string
    subtitle: string
    getStarted: string
    learnMore: string
    scrollDown: string
  }
  about: {
    sectionTitle: string
    title: string
    description: string
    features: string[]
    teamTitle: string
    teamSubtitle: string
    learnMoreButton: string
  }
  projects: {
    sectionTitle: string
    title: string
    description: string
    categories: string[]
    items: Array<{
      title: string
      description: string
      category: string
    }>
    viewProject: string
    learnMore: string
    viewAllButton: string
  }
  news: {
    sectionTitle: string
    title: string
    description: string
    readMore: string
    items: Array<{
      title: string
      excerpt: string
      category: string
      date: string
    }>
    viewAllButton: string
  }
  cta: {
    title: string
    description: string
    button: string
  }
  newsletter: {
    title: string
    description: string
    placeholder: string
    button: string
  }
  clients: {
    title: string
    subtitle: string
  }
}

type Language = "fr" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  translations: TranslationType
  toggleLanguage: () => void
}

const defaultTranslations: Record<string, TranslationType> = {
  fr: {
    hero: {
      welcome: "BIENVENUE À ENIT JUNIOR ENTREPRISE",
      title: "Qui sommes-nous ?",
      subtitle:
        "Nous comblons le fossé entre l'excellence académique et la réussite professionnelle grâce à une expérience pratique dans des projets réels.",
      getStarted: "Commencer",
      learnMore: "En Savoir Plus",
      scrollDown: "Défiler vers le bas",
    },
    about: {
      sectionTitle: "À PROPOS",
      title: "Qui sommes-nous ?",
      description:
        "ENIT Junior Entreprise est une association à but non lucratif gérée par des étudiants de l'École Nationale d'Ingénieurs de Tunis. Notre mission est de fournir des services de conseil de haute qualité aux entreprises tout en offrant aux étudiants une expérience pratique précieuse.",
      features: ["Expertise technique", "Innovation", "Professionnalisme", "Engagement"],
      teamTitle: "Notre équipe",
      teamSubtitle: "Découvrez nos équipes",
      learnMoreButton: "En savoir plus",
    },
    projects: {
      sectionTitle: "NOS PROJETS",
      title: "Découvrez nos réalisations",
      description:
        "Explorez notre portfolio de projets réussis qui démontrent notre expertise et notre engagement envers l'excellence.",
      categories: ["Tous", "Web", "Mobile", "Design", "Marketing"],
      items: [
        {
          title: "Projet 1",
          description: "Description du projet 1",
          category: "Web",
        },
        {
          title: "Projet 2",
          description: "Description du projet 2",
          category: "Mobile",
        },
        {
          title: "Projet 3",
          description: "Description du projet 3",
          category: "Design",
        },
      ],
      viewProject: "Voir le projet",
      learnMore: "En savoir plus",
      viewAllButton: "Voir tous les projets",
    },
    news: {
      sectionTitle: "ACTUALITÉS",
      title: "Restez informé",
      description: "Découvrez les dernières actualités et événements de ENIT Junior Entreprise.",
      readMore: "Lire la suite",
      items: [
        {
          title: "Actualité 1",
          excerpt: "Résumé de l'actualité 1",
          category: "Événement",
          date: "01/01/2023",
        },
        {
          title: "Actualité 2",
          excerpt: "Résumé de l'actualité 2",
          category: "Annonce",
          date: "15/02/2023",
        },
        {
          title: "Actualité 3",
          excerpt: "Résumé de l'actualité 3",
          category: "Projet",
          date: "10/03/2023",
        },
      ],
      viewAllButton: "Toutes les actualités",
    },
    cta: {
      title: "Prêt à collaborer ?",
      description: "Contactez-nous dès aujourd'hui pour discuter de votre projet.",
      button: "Contactez-nous",
    },
    newsletter: {
      title: "Restez informé",
      description: "Abonnez-vous à notre newsletter pour recevoir nos dernières actualités et mises à jour.",
      placeholder: "Votre adresse email",
      button: "S'abonner",
    },
    clients: {
      title: "Ceux qui nous font confiance",
      subtitle: "Découvrez nos partenaires et clients satisfaits",
    },
  },
  en: {
    hero: {
      welcome: "WELCOME TO ENIT JUNIOR ENTREPRISE",
      title: "Who we are",
      subtitle:
        "We bridge the gap between academic excellence and professional success through practical experience in real projects.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      scrollDown: "Scroll down",
    },
    about: {
      sectionTitle: "ABOUT",
      title: "Who we are",
      description:
        "ENIT Junior Entreprise is a non-profit organization managed by students from the National Engineering School of Tunis. Our mission is to provide high-quality consulting services to businesses while offering valuable hands-on experience to students.",
      features: ["Technical Expertise", "Innovation", "Professionalism", "Commitment"],
      teamTitle: "Our Team",
      teamSubtitle: "Discover our teams",
      learnMoreButton: "Learn more",
    },
    projects: {
      sectionTitle: "OUR PROJECTS",
      title: "Discover our achievements",
      description:
        "Explore our portfolio of successful projects that demonstrate our expertise and commitment to excellence.",
      categories: ["All", "Web", "Mobile", "Design", "Marketing"],
      items: [
        {
          title: "Project 1",
          description: "Description of project 1",
          category: "Web",
        },
        {
          title: "Project 2",
          description: "Description of project 2",
          category: "Mobile",
        },
        {
          title: "Project 3",
          description: "Description of project 3",
          category: "Design",
        },
      ],
      viewProject: "View project",
      learnMore: "Learn more",
      viewAllButton: "View all projects",
    },
    news: {
      sectionTitle: "NEWS",
      title: "Stay informed",
      description: "Discover the latest news and events from ENIT Junior Entreprise.",
      readMore: "Read more",
      items: [
        {
          title: "News 1",
          excerpt: "Summary of news 1",
          category: "Event",
          date: "01/01/2023",
        },
        {
          title: "News 2",
          excerpt: "Summary of news 2",
          category: "Announcement",
          date: "15/02/2023",
        },
        {
          title: "News 3",
          excerpt: "Summary of news 3",
          category: "Project",
          date: "10/03/2023",
        },
      ],
      viewAllButton: "All news",
    },
    cta: {
      title: "Ready to collaborate?",
      description: "Contact us today to discuss your project.",
      button: "Contact us",
    },
    newsletter: {
      title: "Stay Informed",
      description: "Subscribe to our newsletter to receive our latest news and updates.",
      placeholder: "Your email address",
      button: "Subscribe",
    },
    clients: {
      title: "Our Trusted Partners",
      subtitle: "Discover our satisfied partners and clients",
    },
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  translations: defaultTranslations.fr,
  toggleLanguage: () => {},
})

// Responsive hook
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize, { passive: true })
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    windowSize,
  }
}

// Animated Number Component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      const interval = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  return <span ref={ref}>{count}</span>
}

// Lazy load components with preload
const ServiceCard = dynamic(() => import("./components/ServiceCard"), {
  loading: () => <LoadingFallback />,
  ssr: false,
})
const Header = dynamic(() => import("./components/Header"), {
  loading: () => <LoadingFallback />,
  ssr: false,
})
const Footer = dynamic(() => import("./components/Footer"), {
  loading: () => <LoadingFallback />,
  ssr: false,
})
const BackgroundSlider = dynamic(() => import("./components/BackgroundSlider"), {
  loading: () => <LoadingFallback />,
  ssr: false,
})

// Loading fallback component with optimized animation
const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin transform-gpu"></div>
  </div>
)

// Optimize scroll reveal with smoother animations
const ScrollRevealSection = React.memo(({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const observer = useIntersectionObserver((isIntersecting) => {
    if (isIntersecting) {
      setIsVisible(true)
      observer?.disconnect()
    }
  })

  useEffect(() => {
    if (ref.current && observer) {
      observer.observe(ref.current)
    }
  }, [observer])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className="transform-gpu will-change-transform"
    >
      {children}
    </motion.div>
  )
})

ScrollRevealSection.displayName = "ScrollRevealSection"

// Optimize scroll handler with better performance
const useThrottledScroll = (callback: () => void, delay: number) => {
  const lastRun = useRef<number>(Date.now())
  const rafId = useRef<number | null>(null)
  const ticking = useRef<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }
        rafId.current = requestAnimationFrame(() => {
          const now = Date.now()
          if (now - lastRun.current >= delay) {
            callback()
            lastRun.current = now
          }
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [callback, delay])
}

// Optimize intersection observer with better performance
const useIntersectionObserver = (callback: (isIntersecting: boolean) => void) => {
  const observer = useRef<IntersectionObserver | null>(null)
  const rafId = useRef<number | null>(null)
  const ticking = useRef<boolean>(false)

  useEffect(() => {
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (!ticking.current) {
          if (rafId.current) {
            cancelAnimationFrame(rafId.current)
          }
          rafId.current = requestAnimationFrame(() => {
            callback(entry.isIntersecting)
            ticking.current = false
          })
          ticking.current = true
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    )

    return () => {
      observer.current?.disconnect()
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [callback])

  return observer.current
}

// Optimize animations with better performance and smoother transitions
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const observer = useIntersectionObserver((isIntersecting) => {
    if (isIntersecting) {
      setIsVisible(true)
      observer?.disconnect()
    }
  })

  useEffect(() => {
    if (ref.current && observer) {
      observer.observe(ref.current)
    }
  }, [observer])

  return (
    <motion.div
      ref={ref}
      className={`transform-gpu will-change-transform ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smoother animation
        opacity: { duration: 0.4 },
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

// Optimize hover animations with better performance
const HoverCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <motion.div
      className={`transform-gpu will-change-transform ${className}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
    >
      {children}
    </motion.div>
  )
}

// Optimize image loading with better performance
const OptimizedImage = ({
  src,
  alt,
  priority = false,
  ...props
}: { src: string; alt: string; priority?: boolean; [key: string]: any }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt}
    loading={priority ? "eager" : "lazy"}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAElYAABYWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADc/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjU1PVBVXWRkXWyEhIf/2wBDARUXFx4aHjshITtBNTtBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    {...props}
    className={`${props.className || ""} transform-gpu`}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    quality={75}
    priority={priority}
  />
)

// Add image preloading for critical images
const preloadImages = [
  "/images/fo2.webp",
  "/images/fee23.webp",
  "/images/ENITJE Team.webp",
  "/images/jobs24.webp",
  "/images/jobs25.webp",
  "/images/rgo2.webp",
  "/images/xpo.webp",
]

// Add preload links in head
const PreloadImages = () => {
  return (
    <>
      {preloadImages.map((src, index) => (
        <link key={index} rel="preload" as="image" href={src} type="image/jpeg" />
      ))}
    </>
  )
}

// Optimize animations with reduced motion support
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

// Add this near the top of the file, after other imports
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  toggleDarkMode: () => void
  language: "fr" | "en"
  toggleLanguage: (lang: "fr" | "en") => void
}

const MobileMenu = ({ isOpen, onClose, darkMode, toggleDarkMode, language, toggleLanguage }: MobileMenuProps) => {
  return (
    <motion.div
      className={`fixed inset-0 z-[9999] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: {
          visibility: "visible",
        },
        closed: {
          visibility: "hidden",
          transition: { delay: 0.3 },
        },
      }}
    >
      {/* Backdrop with smooth fade */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Menu Content with smooth slide */}
      <motion.div
        className={`absolute right-0 top-0 bottom-0 w-full max-w-[300px] ${
          darkMode ? "bg-[#1a2744]" : "bg-white"
        } shadow-2xl flex flex-col`}
        variants={{
          open: {
            x: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            },
          },
          closed: {
            x: "100%",
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 40,
            },
          },
        }}
      >
        {/* Close button with smooth hover */}
        <motion.button
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full ${
            darkMode ? "text-white hover:bg-white/10" : "text-navy hover:bg-navy/10"
          } transition-colors duration-200`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Navigation Links with staggered animation */}
        <nav className="flex-1 px-8 py-16">
          {[
            { path: "/", labelFr: "Accueil", labelEn: "Home" },
            { path: "/about", labelFr: "À Propos", labelEn: "About" },
            { path: "/services", labelFr: "Services", labelEn: "Services" },
            { path: "/projects", labelFr: "Projets", labelEn: "Projects" },
            { path: "/news", labelFr: "Actualités", labelEn: "News" },
            { path: "/contact", labelFr: "Contact", labelEn: "Contact" },
          ].map((item, index) => (
            <motion.div
              key={item.path}
              variants={{
                open: {
                  x: 0,
                  opacity: 1,
                  transition: { delay: 0.1 + index * 0.05 },
                },
                closed: { x: 20, opacity: 0 },
              }}
            >
              <Link
                href={item.path}
                className={`block py-4 text-lg ${
                  darkMode ? "text-white hover:text-secondary" : "text-navy hover:text-secondary"
                } transition-colors duration-200`}
                onClick={() => {
                  onClose()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                {language === "fr" ? item.labelFr : item.labelEn}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Bottom controls with smooth transitions */}
        <motion.div
          className="p-8 flex justify-between items-center border-t border-gray-200 dark:border-white/10"
          variants={{
            open: {
              y: 0,
              opacity: 1,
              transition: { delay: 0.3 },
            },
            closed: { y: 20, opacity: 0 },
          }}
        >
          <motion.button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode ? "text-white hover:bg-white/10" : "text-navy hover:bg-navy/10"
            } transition-colors duration-200`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          <motion.button
            onClick={() => toggleLanguage(language === "fr" ? "en" : "fr")}
            className={`p-2 rounded-full ${
              darkMode ? "text-white hover:bg-white/10" : "text-navy hover:bg-navy/10"
            } transition-colors duration-200`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span className="text-lg font-medium">{language === "fr" ? "EN" : "FR"}</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Debounce hook
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Fixed ClientsSection component
const ClientsSection = () => {
  const { language, translations } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const logos = [
    "/images/companies/logo1.webp",
    "/images/companies/logo2.webp",
    "/images/companies/logo3.webp",
    "/images/companies/logo4.webp",
    "/images/companies/logo5.webp",
    "/images/companies/logo6.webp",
    "/images/companies/logo7.webp",
    "/images/companies/logo8.webp",
    "/images/companies/logo9.webp",
    "/images/companies/logo10.webp",
    "/images/companies/logo11.webp",
    "/images/companies/logo12.webp",
    "/images/companies/logo13.webp",
    "/images/companies/logo14.webp",
    "/images/companies/logo15.webp",
    "/images/companies/logo16.webp",
    "/images/companies/logo17.webp",
    "/images/companies/logo18.webp",
    "/images/companies/logo19.webp",
    "/images/companies/logo20.webp",
    "/images/companies/logo21.webp",
    "/images/companies/logo22.webp",
    "/images/companies/logo23.webp",
  ]

  // Create a duplicated array for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos]

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
    sliderRef.current.classList.add("pause")
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2 // Adjust scrolling speed
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (sliderRef.current) {
      sliderRef.current.classList.remove("pause")
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
    sliderRef.current.classList.add("pause")
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{translations.clients.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{translations.clients.subtitle}</p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Gradient masks for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

          <div
            ref={sliderRef}
            className="flex animate-scroll hover-pause:pause space-x-12 overflow-x-auto scrollbar-hide will-change-transform cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[180px] h-[90px] flex items-center justify-center"
                style={{ userSelect: "none" }}
              >
                <Image
                  src={logo || "/placeholder.svg"}
                  alt={`Client logo ${index + 1}`}
                  width={160}
                  height={80}
                  className="max-h-[80px] w-auto object-contain filter drop-shadow-md transition-all duration-300 hover:scale-110"
                  draggable={false}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr")
  const [currentTranslations, setCurrentTranslations] = useState<TranslationType>(defaultTranslations.fr)
  const [activeSection, setActiveSection] = useState("hero")
  const [darkMode, setDarkMode] = useState(true)
  const { language, toggleLanguage } = useLanguage() as LanguageContextType
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const debouncedScrollY = useDebounce(scrollY, 100)
  const [t, setT] = useState(defaultTranslations.fr)

  // Optimized scroll-based animations with transform-gpu
  const opacity = useTransform(debouncedScrollY, [0, 200], [1, 0])
  const scale = useTransform(debouncedScrollY, [0, 200], [1, 0.95])
  const y = useTransform(debouncedScrollY, [0, 200], [0, 20])

  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === "dark")
    setThemePreference(theme)
  }, [])

  // Memoized toggle function
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light"
      setThemePreference(newTheme)
      return !prev
    })
  }, [])

  // Update the handleScrollToSection function
  const handleScrollToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = element.offsetTop - 80 // Reduced offset to ensure full visibility
        window.scrollTo({
          top: offset,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        })
      }
    },
    [prefersReducedMotion],
  )

  // Optimize scroll handling with better performance
  useThrottledScroll(() => {
    const scrollPosition = window.scrollY + 200
    const sections = [
      { ref: section3Ref, id: "section3" },
      { ref: section2Ref, id: "section2" },
      { ref: section1Ref, id: "section1" },
    ]

    for (const section of sections) {
      if (section.ref.current && scrollPosition >= section.ref.current.offsetTop) {
        setActiveSection(section.id)
        break
      }
    }
  }, 100)

  // Optimize intersection observer
  const observer = useIntersectionObserver((isIntersecting) => {
    setIsIntersecting(isIntersecting)
  })

  // Preload components on mount and load translations
  useEffect(() => {
    setIsLoaded(true)

    // Set default translations based on language
    setT(defaultTranslations[language])

    // Try to load translations
    try {
      import("./translations")
        .then((module) => {
          if (module.translations && module.translations[language]) {
            // Merge with default translations to ensure all properties exist
            setT({
              ...defaultTranslations[language],
              ...module.translations[language],
            })
          }
        })
        .catch((err) => {
          console.error("Failed to load translations:", err)
        })
    } catch (error) {
      console.error("Error loading translations:", error)
    }
  }, [language])

  // Memoize statistics data
  const statistics = useMemo(
    () => [
      {
        icon: Users,
        label: "100+ Clients",
        description: language === "fr" ? "Clients Satisfaits" : "Happy Clients",
        animate: { scale: [1, 1.2, 1] },
      },
      {
        icon: Rocket,
        label: "50+ Projects",
        description: language === "fr" ? "Projets Réussis" : "Successful Projects",
        animate: { rotate: [0, 10, 0] },
      },
      {
        icon: Target,
        label: "95% Success",
        description: language === "fr" ? "Taux de Réussite" : "Success Rate",
        animate: { scale: [1, 0.9, 1] },
      },
      {
        icon: Award,
        label: "15+ Awards",
        description: language === "fr" ? "Récompenses" : "Awards Won",
        animate: { y: [0, -10, 0] },
      },
    ],
    [language],
  )

  // Add testimonials data
  const testimonials = useMemo(
    () => [
      {
        quote:
          language === "fr"
            ? "Une équipe exceptionnelle qui a su transformer notre vision en réalité. Leur expertise et leur professionnalisme sont remarquables."
            : "An exceptional team that turned our vision into reality. Their expertise and professionalism are remarkable.",
        author: "Marie Laurent",
        role: language === "fr" ? "Directrice Marketing" : "Marketing Director",
        company: "TechCorp",
        rating: 5,
      },
      {
        quote:
          language === "fr"
            ? "Leur approche innovante et leur attention aux détails ont dépassé nos attentes. Un véritable partenaire de confiance."
            : "Their innovative approach and attention to detail exceeded our expectations. A true trusted partner.",
        author: "Pierre Dubois",
        role: language === "fr" ? "CEO" : "CEO",
        company: "InnovateX",
        rating: 5,
      },
      {
        quote:
          language === "fr"
            ? "Une collaboration exceptionnelle qui a permis de livrer notre projet dans les délais et avec une qualité remarquable."
            : "An exceptional collaboration that delivered our project on time and with remarkable quality.",
        author: "Sophie Martin",
        role: language === "fr" ? "Directrice Produit" : "Product Director",
        company: "FutureTech",
        rating: 5,
      },
    ],
    [language],
  )

  // Complete the services data
  const services = useMemo(
    () => [
      {
        icon: Code2,
        color: "from-blue-500/20 to-purple-500/20",
        hoverColor: "from-blue-600/30 to-purple-600/30",
        projectTypes: [
          { title: "Web Development", description: "Modern web applications with cutting-edge technologies" },
          { title: "Mobile Apps", description: "Cross-platform mobile applications" },
          { title: "Custom Software", description: "Tailored software solutions for your business" },
        ],
      },
      {
        icon: LineChart,
        color: "from-green-500/20 to-teal-500/20",
        hoverColor: "from-green-600/30 to-teal-600/30",
        projectTypes: [
          { title: "Data Analytics", description: "Advanced data analysis and visualization" },
          { title: "Business Intelligence", description: "Comprehensive business insights and reporting" },
          { title: "Performance Optimization", description: "Enhance your system performance" },
        ],
      },
      {
        icon: Cog,
        color: "from-yellow-500/20 to-orange-500/20",
        hoverColor: "from-yellow-600/30 to-orange-600/30",
        projectTypes: [
          { title: "System Integration", description: "Seamless integration of various systems" },
          { title: "Cloud Solutions", description: "Scalable cloud infrastructure and services" },
          { title: "Automation", description: "Streamline your business processes" },
        ],
      },
      {
        icon: Zap,
        color: "from-pink-500/20 to-rose-500/20",
        hoverColor: "from-pink-600/30 to-rose-600/30",
        projectTypes: [
          { title: "AI Solutions", description: "Intelligent automation and machine learning" },
          { title: "IoT Development", description: "Connected device solutions" },
          { title: "Digital Transformation", description: "Modernize your business" },
        ],
      },
    ],
    [],
  )

  const handleLanguageToggle = useCallback(() => {
    const newLang = currentLanguage === "fr" ? "en" : "fr"
    setCurrentLanguage(newLang)
    setCurrentTranslations(defaultTranslations[newLang])
  }, [currentLanguage])

  const languageContextValue = useMemo(
    () => ({
      language: currentLanguage,
      setLanguage: setCurrentLanguage,
      translations: currentTranslations,
      toggleLanguage: handleLanguageToggle,
    }),
    [currentLanguage, currentTranslations, handleLanguageToggle],
  )

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300 touch-manipulation">
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            <PreloadImages />
          </Head>
          <Suspense fallback={<LoadingFallback />}>
            <Header
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              language={language}
              toggleLanguage={toggleLanguage}
            />
            <MobileMenu
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              language={language}
              toggleLanguage={toggleLanguage}
            />
          </Suspense>

          {/* Hero Section */}
          <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0 z-0">
              <Suspense fallback={<LoadingFallback />}>
                <BackgroundSlider />
              </Suspense>
              <motion.div
                className={`absolute inset-0 ${darkMode ? "bg-navy/70" : "bg-white/50"}`}
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <motion.div
              className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center py-12 sm:py-16 md:py-20"
              style={{ scale, y }}
              initial={false}
            >
              {/* Hero content with optimized animations */}
              <div className="text-center w-full max-w-6xl mx-auto">
                <motion.div
                  className={`inline-block ${darkMode ? "bg-secondary/20" : "bg-secondary/10"} px-4 sm:px-6 py-2 rounded-full mb-6 sm:mb-8`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span
                    className={`font-medium tracking-widest text-xs sm:text-sm uppercase ${darkMode ? "text-white" : "text-navy"}`}
                  >
                    {t.hero.welcome}
                  </span>
                </motion.div>

                <motion.div
                  className="mb-6 sm:mb-8 mt-4 sm:mt-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                >
                  <Image
                    src={darkMode ? "/images/slogand.webp" : "/images/sloganl.webp"}
                    alt="ENIT Junior Entreprise Slogan"
                    width={500}
                    height={167}
                    className="mx-auto w-auto h-auto max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] transform-gpu will-change-transform"
                    priority
                  />
                </motion.div>

                <motion.p
                  className={`text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto px-4 ${darkMode ? "text-white" : "text-navy"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2,
                  }}
                >
                  {t.hero.subtitle}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3,
                  }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Link
                      href="/contact"
                      className={`w-full sm:w-auto px-6 sm:px-8 py-3 inline-block ${
                        darkMode ? "bg-white text-navy hover:bg-gray-100" : "bg-navy text-white hover:bg-navy/90"
                      } rounded-full transition-all duration-300 shadow-lg text-center transform-gpu text-sm sm:text-base`}
                    >
                      {t.hero.getStarted}
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Link
                      href="/about"
                      className={`w-full sm:w-auto px-6 sm:px-8 py-3 inline-block border-2 ${
                        darkMode
                          ? "border-white text-white hover:bg-white/10"
                          : "border-navy text-navy hover:bg-navy/10"
                      } rounded-full transition-all duration-300 shadow-lg text-center transform-gpu text-sm sm:text-base`}
                    >
                      {t.hero.learnMore}
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Animated Scroll Button */}
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <motion.button
                className="cursor-pointer"
                onClick={() => handleScrollToSection("features")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`${darkMode ? "text-white" : "text-navy"} hover:text-secondary transition-colors duration-300`}
                >
                  <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8" />
                </motion.div>
              </motion.button>
            </motion.div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-12 sm:py-16 md:py-20 relative bg-white dark:bg-navy/90">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Features content - Full width on mobile, half width on desktop */}
                <div className="relative w-full md:w-1/2">
                  <motion.div
                    className="inline-block bg-secondary/10 px-3 sm:px-4 py-1 rounded-full mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-secondary font-medium tracking-widest text-xs sm:text-sm">
                      {language === "fr" ? "NOTRE EXPERTISE" : "OUR EXPERTISE"}
                    </span>
                  </motion.div>

                  <motion.h2
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 gradient-text"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    {language === "fr"
                      ? "Services sur mesure pour maximiser votre potentiel digital"
                      : "Tailored services to maximize your digital potential"}
                  </motion.h2>

                  {/* Features grid - 2x2 on desktop */}
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {[
                      {
                        icon: Code2,
                        title: language === "fr" ? "TIC" : "ICT",
                        description:
                          language === "fr"
                            ? "Solutions informatiques et développement logiciel"
                            : "IT solutions and software development",
                        link: "/services/it",
                      },
                      {
                        icon: Users,
                        title: language === "fr" ? "Consulting" : "Consulting",
                        description:
                          language === "fr"
                            ? "Expertise stratégique et conseils personnalisés"
                            : "Strategic expertise and personalized consulting",
                        link: "/services/consulting",
                      },
                      {
                        icon: Cog,
                        title: language === "fr" ? "Conception Mécanique" : "Mechanical Design",
                        description:
                          language === "fr" ? "Solutions mécaniques innovantes" : "Innovative mechanical solutions",
                        link: "/services/mechanical",
                      },
                      {
                        icon: Zap,
                        title: language === "fr" ? "Conception Électrique" : "Electrical Design",
                        description:
                          language === "fr" ? "Solutions électriques avancées" : "Advanced electrical solutions",
                        link: "/services/electrical",
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="group relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Link href={feature.link} className="block h-full">
                          <div className="relative bg-white dark:bg-navy/50 rounded-lg p-6 border border-gray-100 dark:border-white/10 hover:border-secondary/20 transition-all duration-300 shadow-md h-full">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                                <feature.icon className="w-6 h-6 text-secondary" />
                              </div>
                              <h3 className="ml-4 text-xl font-bold text-navy dark:text-white">{feature.title}</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                            <div className="mt-4 flex items-center text-secondary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span>{language === "fr" ? "En savoir plus" : "Learn more"}</span>
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Explore services button */}
                  <motion.div
                    className="mt-8 sm:mt-10 flex justify-center md:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Link href="/services">
                      <motion.button
                        className="px-6 py-3 bg-secondary text-white rounded-full flex items-center shadow-lg hover:bg-secondary/90 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="font-medium">
                          {language === "fr" ? "Explorer nos services" : "Explore our services"}
                        </span>
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Image section - Positioned to the right on desktop */}
                <motion.div
                  className="relative w-full md:w-1/2 mt-8 md:mt-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden shadow-2xl border-4 border-white dark:border-navy/30">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-secondary/5 z-10 pointer-events-none"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>

                    <OptimizedImage
                      src="/images/jobs25.webp"
                      alt="Team working together"
                      fill
                      className="object-cover scale-105 hover:scale-110 transition-all duration-700"
                      priority
                    />

                    {/* Overlay with design elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 w-full h-full border border-white/20 dark:border-white/10 z-20"></div>
                    <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-white/30 dark:border-white/20 z-20"></div>
                    <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-white/30 dark:border-white/20 z-20"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-30">
                      <h3 className="text-white sm:text-2xl font-bold mb-2">
                        {language === "fr" ? "Une équipe passionnée" : "A passionate team"}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base">
                        {language === "fr"
                          ? "Nous mettons notre expertise au service de votre succès"
                          : "We put our expertise at the service of your success"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Statistics Section with Animated Numbers */}
          <AnimatedSection className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-gray-50 dark:bg-navy/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {statistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-navy/50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group transform-gpu"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.div
                      className="mx-auto mb-3 sm:mb-4 w-12 sm:w-16 h-12 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300"
                      animate={stat.animate}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <stat.icon className="w-6 sm:w-8 h-6 sm:h-8" />
                    </motion.div>
                    <motion.h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-navy dark:text-white mb-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <AnimatedNumber value={Number.parseInt(stat.label)} />
                    </motion.h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{stat.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Background decoration with optimized blur */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/5 rounded-full blur-3xl transform-gpu" />
              <div className="absolute bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full blur-3xl transform-gpu" />
            </div>
          </AnimatedSection>

          {/* About Section with Values */}
          <AnimatedSection className="py-16 md:py-20 relative bg-white dark:bg-navy/90">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="relative">
                  {/* Optimized decorative elements */}
                  <div className="absolute -top-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl transform-gpu"></div>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/10 rounded-full blur-3xl transform-gpu"></div>

                  <motion.div
                    className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-secondary font-medium tracking-widest text-sm">{t.about.sectionTitle}</span>
                  </motion.div>

                  <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4 }}
                  >
                    {t.about.title}
                  </motion.h2>

                  <motion.p
                    className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {t.about.description}
                  </motion.p>

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {t.about.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="w-3 h-3 bg-secondary rounded-full transform-gpu"></div>
                        <p className="text-gray-600 dark:text-gray-300">{feature}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Link
                      href="/about"
                      className="px-6 py-2 bg-secondary text-white rounded-full hover:bg-secondary-light transition-all duration-300 inline-flex items-center group transform-gpu hover:scale-105"
                    >
                      {t.about.learnMoreButton}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </motion.div>
                </div>

                {/* Values Grid */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-8 sm:mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold gradient-text">
                      {language === "fr" ? "Nos Axes" : "Our Focus Areas"}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-8">
                    {[
                      {
                        icon: <GraduationCap className="w-16 h-16 text-secondary" />,
                        title: language === "fr" ? "Formations" : "Training",
                        description:
                          language === "fr"
                            ? "Formation continue et développement des compétences pour les étudiants et les professionnels"
                            : "Continuous training and skill development for students and professionals",
                      },
                      {
                        icon: <FolderKanban className="w-16 h-16 text-secondary" />,
                        title: language === "fr" ? "Projets" : "Projects",
                        description:
                          language === "fr"
                            ? "Réalisation de projets innovants et solutions techniques pour les entreprises"
                            : "Implementation of innovative projects and technical solutions for companies",
                      },
                      {
                        icon: <Calendar className="w-16 h-16 text-secondary" />,
                        title: language === "fr" ? "Événementiel" : "Events",
                        description:
                          language === "fr"
                            ? "Organisation d'événements professionnels et conférences pour la communauté tech"
                            : "Organization of professional events and conferences for the tech community",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="group relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative bg-white dark:bg-navy/50 backdrop-blur-sm rounded-xl p-8 border border-gray-100 dark:border-white/10 hover:border-secondary/20 transition-all duration-300 shadow-lg">
                          <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">{item.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-lg">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
          {/* Projects Section */}
          <AnimatedSection className="py-12 sm:py-16 md:py-20 relative bg-gray-50 dark:bg-navy/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollRevealSection>
                <div className="text-center mb-8 sm:mb-12">
                  <motion.div
                    className="inline-block bg-secondary/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-secondary font-medium tracking-widest text-xs sm:text-sm">
                      {t.projects.sectionTitle}
                    </span>
                  </motion.div>

                  <motion.h2
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {t.projects.title}
                  </motion.h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {t.projects.items.map((project, index) => (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-secondary/20 transform-gpu"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="relative overflow-hidden aspect-[16/9]">
                        <OptimizedImage
                          src="/placeholder.svg?height=300&width=400"
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                          {project.category}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <span className="text-white p-4 font-medium">{t.projects.viewProject}</span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-navy dark:text-white">{project.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                          {project.description}
                        </p>
                        <Link
                          href={`/projects/${index + 1}`}
                          className="text-secondary hover:text-secondary-dark transition-colors duration-300 flex items-center group text-sm sm:text-base"
                        >
                          {t.projects.learnMore}
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="text-center mt-8 sm:mt-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link
                    href="/projects"
                    className="inline-block px-6 sm:px-8 py-3 border-2 border-navy dark:border-white text-navy dark:text-white rounded-full hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-all duration-300 transform-gpu text-sm sm:text-base"
                  >
                    {t.projects.viewAllButton}
                  </Link>
                </motion.div>
              </ScrollRevealSection>
            </div>
          </AnimatedSection>

          {/* Latest News Section */}
          <AnimatedSection className="py-12 sm:py-16 md:py-20 relative dark:bg-navy/90">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollRevealSection>
                <div className="text-center mb-8 sm:mb-12">
                  <motion.div
                    className="inline-block bg-secondary/10 px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-secondary font-medium tracking-widest text-xs sm:text-sm">
                      {t.news.sectionTitle}
                    </span>
                  </motion.div>

                  <motion.h2
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {t.news.title}
                  </motion.h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {t.news.items.map((news, index) => (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                          <span className="text-xs font-semibold text-secondary">{news.category}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{news.date}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-3 text-navy dark:text-white line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {news.excerpt}
                        </p>
                        <Link
                          href={`/news/${index + 1}`}
                          className="text-secondary hover:text-secondary-dark transition-colors duration-300 flex items-center group text-sm sm:text-base"
                        >
                          {t.news.readMore}
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="text-center mt-8 sm:mt-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link
                    href="/news"
                    className="inline-block px-6 sm:px-8 py-3 bg-secondary text-white rounded-full hover:bg-secondary-light transition-all duration-300 transform-gpu text-sm sm:text-base"
                  >
                    {t.news.viewAllButton}
                  </Link>
                </motion.div>
              </ScrollRevealSection>
            </div>
          </AnimatedSection>

          {/* Call to Action Section */}
          <AnimatedSection className="py-12 sm:py-16 bg-secondary text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t.cta.title}</h2>
                <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">{t.cta.description}</p>
                <Link
                  href="/contact"
                  className="inline-block px-6 sm:px-8 py-3 bg-white text-secondary rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  {t.cta.button}
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Clients Section */}
          <ClientsSection />

          {/* Footer Section */}
          <Footer />
        </div>
      </LazyMotion>
    </LanguageContext.Provider>
  )
}

