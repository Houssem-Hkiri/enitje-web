"use client"

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react"
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
  ChevronUp,
} from "lucide-react"
import { motion, useScroll, useTransform, LazyMotion, domAnimation } from "framer-motion"
import { useLanguage } from "./contexts/LanguageContext"
import dynamic from "next/dynamic"
import { getThemePreference, setThemePreference } from './utils/theme'
import Header from "./components/Header"
import Footer from "./components/Footer"

// Lazy load components with preload
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

// Define types for props
interface HomeClientProps {
  initialProjects: any[]
  initialNews: any[]
  initialError: string | null
}

// Optimize intersection observer with better performance
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
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

export default function HomeClient({ initialProjects, initialNews, initialError }: HomeClientProps) {
  const { language, translations } = useLanguage()
  const [darkMode, setDarkMode] = useState(true)
  const { scrollY } = useScroll()
  const [isLoaded, setIsLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Optimized scroll-based animations with transform-gpu
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const scale = useTransform(scrollY, [0, 200], [1, 0.95])
  const y = useTransform(scrollY, [0, 200], [0, 20])

  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === "dark")
    setThemePreference(theme)
    setIsLoaded(true)
    
    // Apply dark mode to document element for better compatibility
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Memoized toggle function
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light"
      setThemePreference(newTheme)
      
      // Update document element class for better theme consistency
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      
      return !prev
    })
  }, [])

  // Handle scroll to section
  const handleScrollToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = element.offsetTop - 80
        window.scrollTo({
          top: offset,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        })
      }
    },
    [prefersReducedMotion],
  )

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
  
    useEffect(() => {
      if (!ref.current) return
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: "50px" }
      )
  
      observer.observe(ref.current)
      return () => observer.disconnect()
    }, [])
  
    return (
      <motion.div
        ref={ref}
        className={`transform-gpu will-change-transform ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.4 },
          delay,
        }}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300 touch-manipulation">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          toggleLanguage={() => {}}
        />

        {/* Hero Section with navy overlay in dark mode */}
        <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <BackgroundSlider />
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
                  {language === "fr" ? "BIENVENUE À ENIT JUNIOR ENTREPRISE" : "WELCOME TO ENIT JUNIOR ENTREPRISE"}
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
                {language === "fr" 
                  ? "Nous comblons le fossé entre l'excellence académique et la réussite professionnelle grâce à une expérience pratique dans des projets réels."
                  : "We bridge the gap between academic excellence and professional success through practical experience in real projects."}
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
                    {language === "fr" ? "Commencer" : "Get Started"}
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
                    {language === "fr" ? "En Savoir Plus" : "Learn More"}
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

        {/* Services Section */}
        <section id="features" className="py-12 sm:py-16 md:py-20 relative bg-white dark:bg-navy">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-10">
                <div className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4">
                  <span className="text-secondary font-medium tracking-widest text-sm">
                    {language === "fr" ? "NOS SERVICES" : "OUR SERVICES"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  {language === "fr" ? "Ce que nous offrons" : "What we offer"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {language === "fr" 
                    ? "Des solutions innovantes pour répondre à vos besoins professionnels et académiques" 
                    : "Innovative solutions to meet your professional and academic needs"}
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                {
                  icon: Code2,
                  title: language === "fr" ? "Développement" : "Development",
                  description: language === "fr" 
                    ? "Solutions web et mobiles" 
                    : "Web and mobile solutions",
                },
                {
                  icon: LineChart,
                  title: language === "fr" ? "Consulting" : "Consulting",
                  description: language === "fr" 
                    ? "Expertise stratégique" 
                    : "Strategic expertise",
                },
                {
                  icon: Cog,
                  title: language === "fr" ? "Ingénierie" : "Engineering",
                  description: language === "fr" 
                    ? "Solutions techniques" 
                    : "Technical solutions",
                },
                {
                  icon: GraduationCap,
                  title: language === "fr" ? "Formation" : "Training",
                  description: language === "fr" 
                    ? "Ateliers et cours" 
                    : "Workshops and courses",
                }
              ].map((service, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="bg-white dark:bg-navy/50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-white/10 hover:border-secondary/20 h-full">
                    <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-navy dark:text-white">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                    <Link href={`/services`} className="text-secondary flex items-center group text-sm">
                      {language === "fr" ? "En savoir plus" : "Learn more"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 bg-gray-50 dark:bg-navy/90">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <div className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4">
                  <span className="text-secondary font-medium tracking-widest text-sm">
                    {language === "fr" ? "NOS PROJETS" : "OUR PROJECTS"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  {language === "fr" ? "Découvrez nos réalisations" : "Discover our work"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {language === "fr" 
                    ? "Explorez nos projets réussis qui démontrent notre expertise" 
                    : "Explore our successful projects showcasing our expertise"}
                </p>
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {initialProjects.slice(0, 3).map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.1}>
                  <div className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={project.cover_image || "/placeholder.svg?height=300&width=400"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-navy dark:text-white line-clamp-1">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-secondary hover:text-secondary-dark flex items-center group"
                      >
                        {language === "fr" ? "Voir le projet" : "View project"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/projects"
                className="inline-block px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary-light transition-all duration-300"
              >
                {language === "fr" ? "Voir tous les projets" : "View all projects"}
              </Link>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-16 bg-white dark:bg-navy">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <div className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4">
                  <span className="text-secondary font-medium tracking-widest text-sm">
                    {language === "fr" ? "ACTUALITÉS" : "NEWS"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  {language === "fr" ? "Restez informé" : "Stay informed"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {language === "fr" 
                    ? "Découvrez les dernières actualités et événements" 
                    : "Check out our latest news and events"}
                </p>
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {initialNews.slice(0, 3).map((article, index) => (
                <AnimatedSection key={article.id} delay={index * 0.1}>
                  <div className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-secondary">{article.category}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-navy dark:text-white line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                      <Link
                        href={`/news/${article.id}`}
                        className="text-secondary hover:text-secondary-dark flex items-center group"
                      >
                        {language === "fr" ? "Lire la suite" : "Read more"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/news"
                className="inline-block px-6 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary hover:text-white transition-all duration-300"
              >
                {language === "fr" ? "Toutes les actualités" : "All news"}
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-gradient-to-r from-secondary to-secondary-dark text-white">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {language === "fr" ? "Prêt à collaborer ?" : "Ready to collaborate?"}
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  {language === "fr" 
                    ? "Contactez-nous dès aujourd'hui pour discuter de votre projet." 
                    : "Contact us today to discuss your project."}
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-8 py-3 bg-white text-secondary rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  {language === "fr" ? "Contactez-nous" : "Contact us"}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Footer />
      </div>
    </LazyMotion>
  )
} 