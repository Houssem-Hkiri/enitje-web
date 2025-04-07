"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Shield, Award, BarChart4 } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"
import { useLanguage } from "../contexts/LanguageContext"
import { getThemePreference, setThemePreference } from '../utils/theme'

export default function QualityPolicyPage() {
  const [darkMode, setDarkMode] = useState(true)
  const { language, setLanguage } = useLanguage()
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

  const qualityPolicies = {
    fr: [
      {
        icon: CheckCircle2,
        title: "Excellence Opérationnelle",
        description:
          "Nous nous engageons à maintenir les plus hauts standards de qualité dans tous nos processus opérationnels et services.",
      },
      {
        icon: Shield,
        title: "Responsabilité et Éthique",
        description:
          "Nous adhérons à des principes éthiques stricts et assumons notre responsabilité envers nos clients, membres et partenaires.",
      },
      {
        icon: Award,
        title: "Amélioration Continue",
        description:
          "Nous cherchons constamment à nous améliorer en évaluant et en optimisant nos processus, services et compétences.",
      },
      {
        icon: BarChart4,
        title: "Objectifs Mesurables",
        description:
          "Nous définissons des objectifs de qualité clairs et mesurables pour suivre et évaluer notre performance.",
      },
    ],
    en: [
      {
        icon: CheckCircle2,
        title: "Operational Excellence",
        description:
          "We are committed to maintaining the highest quality standards in all our operational processes and services.",
      },
      {
        icon: Shield,
        title: "Responsibility and Ethics",
        description:
          "We adhere to strict ethical principles and take responsibility toward our clients, members, and partners.",
      },
      {
        icon: Award,
        title: "Continuous Improvement",
        description: "We constantly seek to improve by evaluating and optimizing our processes, services, and skills.",
      },
      {
        icon: BarChart4,
        title: "Measurable Objectives",
        description: "We define clear and measurable quality objectives to track and evaluate our performance.",
      },
    ],
  }

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
        title={language === "fr" ? "Politique Qualité" : "Quality Policy"}
        subtitle={
          language === "fr"
            ? "Notre engagement envers l'excellence et la satisfaction client"
            : "Our commitment to excellence and customer satisfaction"
        }
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">
                {language === "fr" ? "Notre Engagement Qualité" : "Our Quality Commitment"}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-prose">
                {language === "fr"
                  ? "Chez ENIT Junior Entreprise, nous nous engageons à offrir des services de la plus haute qualité qui répondent ou dépassent les attentes de nos clients. Notre politique qualité est fondée sur les principes suivants :"
                  : "At ENIT Junior Entreprise, we are committed to providing services of the highest quality that meet or exceed our clients' expectations. Our quality policy is based on the following principles:"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-12">
              {qualityPolicies[language].map((policy, index) => {
                const Icon = policy.icon
                return (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-navy-light p-5 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 md:h-7 md:w-7 text-secondary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">{policy.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{policy.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-navy-light p-6 md:p-8 rounded-lg shadow-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === "fr" ? "Certification et Assurance Qualité" : "Certification and Quality Assurance"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {language === "fr"
                  ? "ENIT Junior Entreprise s'engage à maintenir et à améliorer continuellement son système de gestion de la qualité conformément aux normes internationales. Notre approche systématique de la qualité nous permet de :"
                  : "ENIT Junior Entreprise is committed to maintaining and continuously improving its quality management system in accordance with international standards. Our systematic approach to quality allows us to:"}
              </p>

              <ul className="space-y-3 mb-6">
                {(language === "fr"
                  ? [
                      "Identifier et atténuer les risques potentiels",
                      "Standardiser les processus pour assurer la cohérence",
                      "Évaluer régulièrement notre performance",
                      "Recueillir et agir sur les retours des clients",
                      "Former et développer les compétences de nos membres",
                    ]
                  : [
                      "Identify and mitigate potential risks",
                      "Standardize processes to ensure consistency",
                      "Regularly evaluate our performance",
                      "Collect and act on client feedback",
                      "Train and develop our members' skills",
                    ]
                ).map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-secondary mr-2 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <p className="text-gray-600 dark:text-gray-300 mt-6">
                {language === "fr"
                  ? "Notre engagement envers la qualité est une responsabilité partagée par tous les membres d'ENIT Junior Entreprise, de la direction aux nouveaux recrus."
                  : "Our commitment to quality is a responsibility shared by all members of ENIT Junior Entreprise, from management to new recruits."}
              </p>
            </motion.div>
          </div>
          
          {/* Call to action */}
          <motion.div
            className="max-w-4xl mx-auto mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              {language === "fr" 
                ? "Intéressé par notre approche qualité ?" 
                : "Interested in our quality approach?"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
              {language === "fr"
                ? "Découvrez comment notre engagement envers la qualité peut bénéficier à votre projet."
                : "Discover how our commitment to quality can benefit your project."}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/contact" 
                className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors duration-300"
              >
                {language === "fr" ? "Contactez-nous" : "Contact Us"}
              </a>
              <a 
                href="/services" 
                className="px-6 py-2 bg-navy-light dark:bg-navy text-white rounded-md hover:bg-navy hover:dark:bg-navy-light transition-colors duration-300"
              >
                {language === "fr" ? "Voir nos services" : "View our services"}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

