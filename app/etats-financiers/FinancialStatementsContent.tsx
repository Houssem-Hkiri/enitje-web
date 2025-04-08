"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Calendar, Loader2 } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"
import { useLanguage } from "../contexts/LanguageContext"
import { getThemePreference, setThemePreference } from '../utils/theme'
import Link from "next/link"

export type FinancialStatement = {
  id: string
  year: string
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
  file_path?: string
  created_at: string
}

interface FinancialStatementsContentProps {
  initialStatements: FinancialStatement[]
  initialError: string | null
}

export default function FinancialStatementsContent({ 
  initialStatements, 
  initialError 
}: FinancialStatementsContentProps) {
  const [darkMode, setDarkMode] = useState(true)
  const { language, setLanguage } = useLanguage()
  const [statements, setStatements] = useState<FinancialStatement[]>(initialStatements)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [mounted, setMounted] = useState(false)
  
  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === 'dark')
    setThemePreference(theme)
    setMounted(true)
  }, [])
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? 'dark' : 'light'
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
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background dark:bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background dark:bg-navy text-foreground overflow-x-hidden transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      <PageHeader
        title={language === "fr" ? "États Financiers" : "Financial Statements"}
        subtitle={
          language === "fr" ? "Transparence et responsabilité financière" : "Financial transparency and accountability"
        }
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10">
              <p className="max-w-prose">
                {language === "fr"
                  ? "Consultez nos rapports financiers annuels pour voir comment nous gérons les ressources de l'association. Notre engagement envers la transparence financière est une partie essentielle de notre gouvernance."
                  : "Review our annual financial reports to see how we manage the association's resources. Our commitment to financial transparency is an essential part of our governance."}
              </p>
            </div>

            {error && (
              <motion.div 
                className="p-4 mb-6 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {error}
              </motion.div>
            )}
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : statements.length === 0 ? (
              <motion.div 
                className="text-center py-12 text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl">
                  {language === "fr" ? "Aucun état financier disponible." : "No financial statements available."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {statements.map((statement, index) => (
                  <motion.div
                    key={statement.id}
                    className="bg-white dark:bg-navy-light p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="bg-secondary/10 p-3 rounded-lg">
                        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {language === "fr" ? statement.title_fr : statement.title_en}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {language === "fr" ? statement.description_fr : statement.description_en}
                            </p>
                          </div>
                          <span className="text-sm font-semibold px-3 py-1 bg-gray-100 dark:bg-navy rounded-full self-start sm:self-auto flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {statement.year}
                          </span>
                        </div>
                        {statement.file_path && (
                          <a
                            href={`/api/download-financial-statement?id=${encodeURIComponent(statement.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-secondary hover:text-secondary-dark transition-colors duration-300"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {language === "fr" ? "Télécharger le PDF" : "Download PDF"}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Add a CTA section */}
            <motion.div 
              className="mt-12 p-6 bg-gray-50 dark:bg-navy rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                {language === "fr" ? "Besoin d'autres informations financières ?" : "Need additional financial information?"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {language === "fr" 
                  ? "Notre équipe est disponible pour répondre à vos questions concernant nos rapports financiers."
                  : "Our team is available to answer your questions about our financial reports."}
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors duration-300"
              >
                {language === "fr" ? "Contactez-nous" : "Contact Us"}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 