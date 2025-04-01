"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Filter } from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"
import { projectsData } from "../data/projects"
import { getThemePreference, setThemePreference } from '../utils/theme'

// Import translations
import { translations } from "../translations"

export default function ProjectsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])

  // Get translations based on current language
  const t = translations[language]

  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === 'dark')
    setThemePreference(theme)
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? 'dark' : 'light'
      setThemePreference(newTheme)
      return !prev
    })
  }

  // Set language
  const toggleLanguage = (lang: "fr" | "en") => {
    setLanguage(lang)
    // Reset category when language changes to avoid mismatches
    setActiveCategory("all")
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Get current projects based on language
  const currentProjects = projectsData[language]

  // Get unique categories
  const categories = (() => {
    const allCategories = currentProjects.map((project) => project.category)
    const uniqueCategories = Array.from(new Set(allCategories))
    return [language === "fr" ? "Tous" : "All", ...uniqueCategories]
  })()

  // Filter projects when language or category changes
  useEffect(() => {
    if (
      activeCategory === "all" ||
      (language === "fr" && activeCategory === "Tous") ||
      (language === "en" && activeCategory === "All")
    ) {
      setFilteredProjects(currentProjects)
    } else {
      setFilteredProjects(currentProjects.filter((project) => project.category === activeCategory))
    }
  }, [activeCategory, language, currentProjects])

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      <PageHeader
        title={language === "fr" ? "Nos Projets" : "Our Projects"}
        subtitle={
          language === "fr"
            ? "Explorez notre portfolio de projets réussis dans divers secteurs"
            : "Explore our portfolio of successful projects across various industries"
        }
      />

      {/* Projects Gallery */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <div className="mb-16">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Filter className="h-5 w-5 text-secondary mr-2" />
              <h3 className="text-lg font-medium">
                {language === "fr" ? "Filtrer par Catégorie" : "Filter by Category"}
              </h3>
            </motion.div>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    (category === "Tous" && activeCategory === "Tous") ||
                    (category === "All" && activeCategory === "All") ||
                    (activeCategory === category)
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Projects Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-secondary/20"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                    {project.category}
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 flex items-end"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white p-4 font-medium">
                      {language === "fr" ? "Voir le Projet" : "View Project"}
                    </span>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-navy">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-secondary hover:text-secondary-dark transition-colors duration-300 flex items-center group"
                  >
                    {language === "fr" ? "Voir les détails" : "View Details"}
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4">
              <span className="text-secondary font-medium tracking-widest text-sm">
                {language === "fr" ? "TÉMOIGNAGES" : "TESTIMONIALS"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              {language === "fr" ? "Ce Que Disent Nos Clients" : "What Our Clients Say"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "fr"
                ? "Ne vous fiez pas seulement à notre parole. Voici ce que nos clients disent de leur collaboration avec ENIT Junior Entreprise."
                : "Don't just take our word for it. Here's what our clients have to say about working with ENIT Junior Entreprise."}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {(language === "fr"
              ? [
                  {
                    quote:
                      "Travailler avec ENIT Junior Entreprise a été une expérience fantastique. L'équipe était professionnelle, réactive et a livré une solution de haute qualité qui a dépassé nos attentes.",
                    author: "Ahmed Benali",
                    company: "TechSolutions Inc.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                  {
                    quote:
                      "Les étudiants d'ENIT Junior Entreprise ont apporté des perspectives fraîches et des idées innovantes à notre projet. Leur expertise technique et leur enthousiasme ont fait toute la différence.",
                    author: "Leila Mansour",
                    company: "GreenEnergy Ltd.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                  {
                    quote:
                      "Nous avons été impressionnés par le professionnalisme et le dévouement de l'équipe d'ENIT Junior Entreprise. Ils ont livré notre projet dans les délais et dans le budget, avec d'excellents résultats.",
                    author: "Karim Hadjeri",
                    company: "Global Logistics",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                ]
              : [
                  {
                    quote:
                      "Working with ENIT Junior Entreprise was a fantastic experience. The team was professional, responsive, and delivered a high-quality solution that exceeded our expectations.",
                    author: "Ahmed Benali",
                    company: "TechSolutions Inc.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                  {
                    quote:
                      "The students at ENIT Junior Entreprise brought fresh perspectives and innovative ideas to our project. Their technical expertise and enthusiasm made all the difference.",
                    author: "Leila Mansour",
                    company: "GreenEnergy Ltd.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                  {
                    quote:
                      "We were impressed by the professionalism and dedication of the ENIT Junior Entreprise team. They delivered our project on time and within budget, with excellent results.",
                    author: "Karim Hadjeri",
                    company: "Global Logistics",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                ]
            ).map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-lg shadow-lg relative"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              >
                <div className="absolute -top-5 -left-2 text-secondary text-6xl opacity-20">"</div>
                <p className="text-gray-600 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-navy">{testimonial.author}</h4>
                    <p className="text-secondary text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === "fr" ? "Prêt à Démarrer Votre Projet ?" : "Ready to Start Your Project?"}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {language === "fr"
                ? "Collaborons pour donner vie à vos idées. Notre équipe d'étudiants talentueux est prête à vous aider à réussir."
                : "Let's collaborate to bring your ideas to life. Our team of talented students is ready to help you succeed."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-white text-secondary rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg inline-block"
                >
                  {language === "fr" ? "Contactez-Nous" : "Get in Touch"}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact?type=quote"
                  className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-secondary transition-all duration-300 shadow-lg inline-block"
                >
                  {language === "fr" ? "Demander un Devis" : "Request a Quote"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

