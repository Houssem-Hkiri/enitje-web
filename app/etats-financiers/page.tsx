"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, FileText, BarChart, TrendingUp, DollarSign, Calendar } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"
import { useLanguage } from "../contexts/LanguageContext"
import { getThemePreference, setThemePreference } from '../utils/theme'

// Sample financial statements data
const financialStatements = {
  fr: [
    {
      id: 1,
      year: "2023",
      title: "Rapport Financier Annuel 2023",
      description: "États financiers audités et rapport annuel pour l'année fiscale 2023.",
      url: "#",
    },
    {
      id: 2,
      year: "2022",
      title: "Rapport Financier Annuel 2022",
      description: "États financiers audités et rapport annuel pour l'année fiscale 2022.",
      url: "#",
    },
    {
      id: 3,
      year: "2021",
      title: "Rapport Financier Annuel 2021",
      description: "États financiers audités et rapport annuel pour l'année fiscale 2021.",
      url: "#",
    },
  ],
  en: [
    {
      id: 1,
      year: "2023",
      title: "Annual Financial Report 2023",
      description: "Audited financial statements and annual report for the 2023 fiscal year.",
      url: "#",
    },
    {
      id: 2,
      year: "2022",
      title: "Annual Financial Report 2022",
      description: "Audited financial statements and annual report for the 2022 fiscal year.",
      url: "#",
    },
    {
      id: 3,
      year: "2021",
      title: "Annual Financial Report 2021",
      description: "Audited financial statements and annual report for the 2021 fiscal year.",
      url: "#",
    },
  ],
}

export default function FinancialStatementsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const { language } = useLanguage()

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

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <PageHeader
        title={language === "fr" ? "États Financiers" : "Financial Statements"}
        subtitle={
          language === "fr" ? "Transparence et responsabilité financière" : "Financial transparency and accountability"
        }
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
              {language === "fr"
                ? "Consultez nos rapports financiers annuels pour voir comment nous gérons les ressources de l'association. Notre engagement envers la transparence financière est une partie essentielle de notre gouvernance."
                : "Review our annual financial reports to see how we manage the association's resources. Our commitment to financial transparency is an essential part of our governance."}
            </p>

            <div className="space-y-8">
              {financialStatements[language].map((statement, index) => (
                <motion.div
                  key={statement.id}
                  className="bg-white dark:bg-navy/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <FileText className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{statement.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{statement.description}</p>
                        </div>
                        <span className="text-sm font-semibold px-3 py-1 bg-gray-100 dark:bg-navy-light rounded-full">
                          {statement.year}
                        </span>
                      </div>
                      <a
                        href={statement.url}
                        className="inline-flex items-center text-secondary hover:text-secondary-dark transition-colors duration-300"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {language === "fr" ? "Télécharger le PDF" : "Download PDF"}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

