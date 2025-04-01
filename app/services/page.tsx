"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Code,
  LineChart,
  Cog,
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Lightbulb,
  Clock,
  DollarSign,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

import Header from "../components/Header"
import Footer from "../components/Footer"

// Import translations
import { translations } from "../translations"
import { getThemePreference, setThemePreference } from '../utils/theme'

export default function ServicesPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [activeTab, setActiveTab] = useState<number>(0)

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

  // Services data
  const services = [
    {
      id: "it",
      icon: Code,
      title: language === "fr" ? "Développement Informatique" : "IT Development",
      description:
        language === "fr"
          ? "Solutions numériques personnalisées pour répondre à vos besoins spécifiques."
          : "Custom digital solutions to meet your specific needs.",
      features:
        language === "fr"
          ? [
              "Développement web et mobile",
              "Applications sur mesure",
              "Intégration de systèmes",
              "Maintenance et support",
            ]
          : ["Web & mobile development", "Custom applications", "System integration", "Maintenance & support"],
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500",
    },
    {
      id: "consulting",
      icon: LineChart,
      title: language === "fr" ? "Consulting" : "Consulting",
      description:
        language === "fr"
          ? "Expertise stratégique pour optimiser vos opérations et stimuler la croissance."
          : "Strategic expertise to optimize your operations and drive growth.",
      features:
        language === "fr"
          ? ["Analyse de marché", "Optimisation des processus", "Stratégie d'entreprise", "Gestion de projet"]
          : ["Market analysis", "Process optimization", "Business strategy", "Project management"],
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500",
    },
    {
      id: "mechanical",
      icon: Cog,
      title: language === "fr" ? "Conception Mécanique" : "Mechanical Design",
      description:
        language === "fr"
          ? "Solutions d'ingénierie mécanique innovantes pour vos projets."
          : "Innovative mechanical engineering solutions for your projects.",
      features:
        language === "fr"
          ? ["Conception CAO", "Prototypage", "Analyse structurelle", "Documentation technique"]
          : ["CAD design", "Prototyping", "Structural analysis", "Technical documentation"],
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-500",
    },
    {
      id: "electrical",
      icon: Zap,
      title: language === "fr" ? "Conception Électrique" : "Electrical Design",
      description:
        language === "fr"
          ? "Expertise en ingénierie électrique pour des systèmes fiables et efficaces."
          : "Electrical engineering expertise for reliable and efficient systems.",
      features:
        language === "fr"
          ? ["Conception de circuits", "Automatisation", "Systèmes de contrôle", "Audits énergétiques"]
          : ["Circuit design", "Automation", "Control systems", "Energy audits"],
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-navy text-navy dark:text-white transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-navy/5 dark:bg-navy-light/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "NOS SERVICES" : "OUR SERVICES"}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {language === "fr" ? (
                  <>
                    Solutions <span className="text-secondary">Innovantes</span> pour Votre Entreprise
                  </>
                ) : (
                  <>
                    <span className="text-secondary">Innovative</span> Solutions for Your Business
                  </>
                )}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                {language === "fr"
                  ? "Nous proposons une gamme complète de services adaptés pour répondre à vos besoins professionnels et vous aider à atteindre vos objectifs."
                  : "We offer a comprehensive range of services tailored to meet your business needs and help you achieve your goals."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="#services"
                  className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary-light transition-all duration-300 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {language === "fr" ? "Explorer Nos Services" : "Explore Our Services"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white dark:bg-navy-light text-navy dark:text-white border border-gray-200 dark:border-navy-light/50 rounded-full hover:bg-gray-50 dark:hover:bg-navy-light/80 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  {language === "fr" ? "Nous Contacter" : "Contact Us"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Improved */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "CE QUE NOUS OFFRONS" : "WHAT WE OFFER"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {language === "fr" ? "Nos Services Professionnels" : "Our Professional Services"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                {language === "fr"
                  ? "Notre équipe multidisciplinaire combine expertise technique et réflexion innovante pour fournir des résultats exceptionnels."
                  : "Our multidisciplinary team combines technical expertise with innovative thinking to deliver exceptional results."}
              </p>
            </motion.div>
          </div>

          {/* Service Tabs - Mobile - Improved scrolling with indicators */}
          <div className="md:hidden mb-8">
            <div className="relative">
              <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                {services.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 flex-shrink-0 snap-start ${
                      activeTab === index
                        ? "bg-secondary text-white shadow-md"
                        : "bg-gray-100 dark:bg-navy-light/20 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <service.icon className="h-4 w-4" />
                      <span>{service.title}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Scroll indicators */}
              <div className="mt-3 flex justify-center gap-1.5">
                {services.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeTab === index 
                        ? "w-5 bg-secondary" 
                        : "w-1.5 bg-gray-300 dark:bg-gray-600"
                    }`}
                    onClick={() => setActiveTab(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid - Desktop - With improved tablet layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-navy-light/20 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-navy-light/10 h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`h-2 w-full bg-gradient-to-r ${service.color}`}></div>
                <div className="p-5 md:p-6 flex-grow">
                  <div
                    className={`w-14 h-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-5 ${service.iconColor} group-hover:bg-secondary group-hover:text-white transition-all duration-300`}
                  >
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 md:p-6 pt-0 mt-auto">
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center text-secondary font-medium hover:underline group/link"
                  >
                    {language === "fr" ? "En savoir plus" : "Learn more"}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Service - Mobile - Improved UI */}
          <div className="md:hidden">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-navy-light/20 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-navy-light/10 h-full flex flex-col"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${services[activeTab].color}`}></div>
              <div className="p-6 flex-grow">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-14 h-14 ${services[activeTab].bgColor} rounded-2xl flex items-center justify-center ${services[activeTab].iconColor} flex-shrink-0`}
                  >
                    {React.createElement(services[activeTab].icon, { className: "h-7 w-7" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{services[activeTab].title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{services[activeTab].description}</p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {services[activeTab].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start bg-gray-50 dark:bg-navy/20 p-3 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0 border-t border-gray-100 dark:border-navy-light/10">
                <Link
                  href={`/services/${services[activeTab].id}`}
                  className="inline-flex items-center justify-center w-full bg-secondary text-white py-3 px-4 rounded-xl font-medium hover:bg-secondary-light transition-all duration-300"
                >
                  {language === "fr" ? "En savoir plus" : "Learn more"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-navy-light/10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "NOTRE PROCESSUS" : "OUR PROCESS"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {language === "fr" ? "Comment Nous Travaillons" : "How We Work"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                {language === "fr"
                  ? "Notre approche structurée garantit que nous fournissons des résultats de haute qualité qui répondent à vos besoins spécifiques."
                  : "Our structured approach ensures that we deliver high-quality results that meet your specific needs."}
              </p>
            </motion.div>
          </div>

          <div className="relative">
            {/* Connecting line - improved for tablet */}
            <div className="absolute top-24 left-0 w-full h-0.5 bg-gray-200 dark:bg-navy-light/20 hidden lg:block"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  step: "01",
                  title: language === "fr" ? "Découverte" : "Discovery",
                  description:
                    language === "fr"
                      ? "Nous commençons par comprendre votre entreprise, vos objectifs et vos défis pour identifier la meilleure approche."
                      : "We start by understanding your business, goals, and challenges to identify the best approach.",
                  icon: Lightbulb,
                },
                {
                  step: "02",
                  title: language === "fr" ? "Planification" : "Planning",
                  description:
                    language === "fr"
                      ? "Notre équipe développe un plan de projet détaillé avec des jalons clairs, des livrables et des délais."
                      : "Our team develops a detailed project plan with clear milestones, deliverables, and timelines.",
                  icon: Users,
                },
                {
                  step: "03",
                  title: language === "fr" ? "Exécution" : "Execution",
                  description:
                    language === "fr"
                      ? "Nous mettons en œuvre la solution avec des mises à jour régulières et des opportunités de feedback et d'ajustements."
                      : "We implement the solution with regular updates and opportunities for feedback and adjustments.",
                  icon: Cog,
                },
                {
                  step: "04",
                  title: language === "fr" ? "Livraison" : "Delivery",
                  description:
                    language === "fr"
                      ? "Nous fournissons les livrables finaux avec documentation et support pour assurer votre succès."
                      : "We provide the final deliverables along with documentation and support to ensure your success.",
                  icon: CheckCircle,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Mobile connector line */}
                  {index > 0 && (
                    <div className="absolute top-0 left-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-8 bg-gray-200 dark:bg-navy-light/20 sm:hidden"></div>
                  )}
                  
                  <div className="bg-white dark:bg-navy-light/20 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-navy-light/10 h-full relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary text-white rounded-2xl flex items-center justify-center mb-6 mx-auto lg:absolute lg:-top-8 lg:left-1/2 lg:-translate-x-1/2 shadow-lg">
                      <step.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <div className="pt-0 lg:pt-8 text-center">
                      <div className="text-secondary font-bold text-xl mb-2">{step.step}</div>
                      <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-navy/5 dark:bg-navy-light/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "POURQUOI NOUS CHOISIR" : "WHY CHOOSE US"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {language === "fr" ? "L'Avantage ENIT Junior" : "The ENIT Junior Advantage"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {language === "fr"
                  ? "Lorsque vous travaillez avec ENIT Junior Entreprise, vous n'obtenez pas seulement un prestataire de services – vous vous associez à une équipe d'étudiants talentueux et motivés qui apportent des perspectives fraîches et des solutions innovantes à vos défis professionnels."
                  : "When you work with ENIT Junior Entreprise, you're not just getting a service provider – you're partnering with a team of talented, motivated students who bring fresh perspectives and innovative solutions to your business challenges."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Lightbulb,
                    title: language === "fr" ? "Innovation" : "Innovation",
                    description:
                      language === "fr"
                        ? "Nous apportons des idées fraîches et des approches créatives à chaque projet."
                        : "We bring fresh ideas and creative approaches to every project.",
                  },
                  {
                    icon: CheckCircle,
                    title: language === "fr" ? "Qualité" : "Quality",
                    description:
                      language === "fr"
                        ? "Nous nous engageons à fournir un travail de la plus haute qualité qui répond aux normes professionnelles."
                        : "We are committed to delivering work of the highest quality that meets professional standards.",
                  },
                  {
                    icon: Clock,
                    title: language === "fr" ? "Flexibilité" : "Flexibility",
                    description:
                      language === "fr"
                        ? "Nous nous adaptons à vos besoins spécifiques et travaillons selon votre calendrier."
                        : "We adapt to your specific needs and work according to your schedule.",
                  },
                  {
                    icon: DollarSign,
                    title: language === "fr" ? "Abordabilité" : "Affordability",
                    description:
                      language === "fr"
                        ? "Nous offrons un excellent rapport qualité-prix sans compromettre la qualité."
                        : "We offer excellent value for money without compromising on quality.",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col sm:flex-row items-start bg-white dark:bg-navy-light/20 p-4 rounded-xl shadow-md border border-gray-100 dark:border-navy-light/10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="bg-secondary/10 p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4 text-secondary flex-shrink-0 mx-auto sm:mx-0">
                      <value.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  className="bg-secondary rounded-xl sm:rounded-2xl p-6 sm:p-8 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg h-32 sm:h-48"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {language === "fr" ? "Innovation" : "Innovation"}
                </motion.div>
                <motion.div
                  className="bg-navy dark:bg-navy-light rounded-xl sm:rounded-2xl p-6 sm:p-8 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg h-32 sm:h-48"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {language === "fr" ? "Flexibilité" : "Flexibility"}
                </motion.div>
              </div>
              <div className="space-y-4 sm:space-y-6 sm:mt-12">
                <motion.div
                  className="bg-navy dark:bg-navy-light rounded-xl sm:rounded-2xl p-6 sm:p-8 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg h-32 sm:h-48"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {language === "fr" ? "Qualité" : "Quality"}
                </motion.div>
                <motion.div
                  className="bg-secondary rounded-xl sm:rounded-2xl p-6 sm:p-8 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg h-32 sm:h-48"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {language === "fr" ? "Abordabilité" : "Affordability"}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {language === "fr" ? "Prêt à Démarrer Votre Projet ?" : "Ready to Start Your Project?"}
            </h2>
            <p className="text-lg mb-8 text-white/90">
              {language === "fr"
                ? "Contactez-nous dès aujourd'hui pour discuter de la façon dont nous pouvons vous aider à atteindre vos objectifs professionnels avec nos services complets."
                : "Contact us today to discuss how we can help you achieve your business goals with our comprehensive services."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-secondary rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block font-medium"
              >
                {language === "fr" ? "Contactez-Nous" : "Get in Touch"}
              </Link>
              <Link
                href="/contact?type=quote"
                className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-secondary transition-all duration-300 transform hover:scale-105 shadow-lg inline-block font-medium"
              >
                {language === "fr" ? "Demander un Devis" : "Request a Quote"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

