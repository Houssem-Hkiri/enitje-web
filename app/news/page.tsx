"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Search } from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"
import { newsData } from "../data/news"
import { getThemePreference, setThemePreference } from '../utils/theme'

export default function NewsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNews, setFilteredNews] = useState<any[]>([])

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

  // Get current news based on language
  const currentNews = newsData[language]

  // Get unique categories
  const categories = (() => {
    const allCategories = currentNews.map((item) => item.category)
    const uniqueCategories = Array.from(new Set(allCategories))
    return [language === "fr" ? "Tous" : "All", ...uniqueCategories]
  })()

  // Filter news when language, category, or search query changes
  useEffect(() => {
    let filtered = [...currentNews]

    // Filter by category
    if (
      !(
        activeCategory === "all" ||
        (language === "fr" && activeCategory === "Tous") ||
        (language === "en" && activeCategory === "All")
      )
    ) {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) => item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query),
      )
    }

    setFilteredNews(filtered)
  }, [activeCategory, searchQuery, language, currentNews])

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
        title={language === "fr" ? "Actualités & Événements" : "News & Events"}
        subtitle={
          language === "fr"
            ? "Restez informé des dernières actualités, événements et annonces d'ENIT Junior Entreprise"
            : "Stay updated with the latest news, events, and announcements from ENIT Junior Entreprise"
        }
      />

      {/* News Filters */}
      <section className="py-12 bg-white dark:bg-navy/90">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Filters */}
            <motion.div
              className="flex flex-wrap gap-3"
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
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy/50 dark:text-gray-300 dark:hover:bg-navy/70"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Search */}
            <motion.div
              className="relative w-full md:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <input
                type="text"
                placeholder={language === "fr" ? "Rechercher..." : "Search news..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full w-full md:w-64 bg-gray-100 dark:bg-navy/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </motion.div>

          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  variants={itemVariants}
                  className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative overflow-hidden h-48">
                    <Image
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{news.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-navy dark:text-white">{news.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{news.excerpt}</p>
                    <Link
                      href={`/news/${news.id}`}
                      className="text-secondary hover:text-secondary-dark transition-colors duration-300 flex items-center group"
                    >
                      {language === "fr" ? "Lire la suite" : "Read more"}
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
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-medium mb-2 text-navy dark:text-white">
                {language === "fr" ? "Aucun résultat trouvé" : "No results found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {language === "fr"
                  ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-navy/80">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {language === "fr" ? "Restez Informé avec Notre Newsletter" : "Stay Updated with Our Newsletter"}
            </motion.h2>
            <motion.p
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {language === "fr"
                ? "Abonnez-vous à notre newsletter pour recevoir les dernières actualités, événements et opportunités directement dans votre boîte de réception."
                : "Subscribe to our newsletter to receive the latest news, events, and opportunities directly in your inbox."}
            </motion.p>
            <motion.form
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <input
                type="email"
                placeholder={language === "fr" ? "Votre adresse email" : "Your email address"}
                className="px-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent flex-grow"
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary-light transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {language === "fr" ? "S'abonner" : "Subscribe"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

