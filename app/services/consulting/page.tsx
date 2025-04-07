"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  BarChart,
  PieChart,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Briefcase,
  FileText,
  PresentationIcon as PresentationChart,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { getThemePreference, setThemePreference } from "@/app/utils/theme"
import { useLanguage } from "@/app/contexts/LanguageContext"

export default function ConsultingPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("business")
  const { language, setLanguage } = useLanguage()

  // Initialize theme and state on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === "dark")
    setThemePreference(theme)

    // Apply dark mode class immediately
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Apply dark mode class to html element when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

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
      setLanguage(lang);
    } else {
      setLanguage(language === "fr" ? "en" : "fr");
    }
  }

  // FAQ data
  const faqs =
    language === "fr"
      ? [
          {
            question: "Quels types de services de consulting proposez-vous ?",
            answer:
              "Nous offrons une gamme complète de services de consulting, notamment l'analyse de marché, l'optimisation des processus, la stratégie d'entreprise, la gestion de projet, et le conseil en transformation numérique. Nos services sont adaptés aux besoins spécifiques de chaque client.",
          },
          {
            question: "Comment mesurez-vous le succès de vos services de consulting ?",
            answer:
              "Nous définissons des indicateurs de performance clés (KPIs) spécifiques à chaque projet en collaboration avec nos clients. Ces indicateurs peuvent inclure l'amélioration de l'efficacité opérationnelle, l'augmentation des revenus, la réduction des coûts, ou d'autres métriques pertinentes pour votre entreprise.",
          },
          {
            question: "Quelle est votre approche en matière de confidentialité des données ?",
            answer:
              "La confidentialité et la sécurité des données de nos clients sont primordiales. Nous signons des accords de confidentialité (NDA) avant de commencer tout projet et nous adhérons strictement aux réglementations en matière de protection des données, notamment le RGPD pour les clients européens.",
          },
          {
            question: "Combien de temps dure généralement un projet de consulting ?",
            answer:
              "La durée d'un projet de consulting varie en fonction de sa complexité et de sa portée. Un projet d'analyse de marché peut prendre 2-4 semaines, tandis qu'un projet d'optimisation des processus ou de transformation d'entreprise peut s'étendre sur plusieurs mois. Nous établissons toujours un calendrier détaillé lors de la phase initiale.",
          },
        ]
      : [
          {
            question: "What types of consulting services do you offer?",
            answer:
              "We offer a comprehensive range of consulting services, including market analysis, process optimization, business strategy, project management, and digital transformation consulting. Our services are tailored to the specific needs of each client.",
          },
          {
            question: "How do you measure the success of your consulting services?",
            answer:
              "We define key performance indicators (KPIs) specific to each project in collaboration with our clients. These indicators may include improved operational efficiency, increased revenue, cost reduction, or other metrics relevant to your business.",
          },
          {
            question: "What is your approach to data confidentiality?",
            answer:
              "The confidentiality and security of our clients' data are paramount. We sign non-disclosure agreements (NDAs) before starting any project and strictly adhere to data protection regulations, including GDPR for European clients.",
          },
          {
            question: "How long does a consulting project typically last?",
            answer:
              "The duration of a consulting project varies depending on its complexity and scope. A market analysis project may take 2-4 weeks, while a process optimization or business transformation project may extend over several months. We always establish a detailed timeline during the initial phase.",
          },
        ]

  return (
    <div className="min-h-screen bg-white dark:bg-navy text-navy dark:text-white transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-navy/5 dark:bg-navy-light/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8"
            >
              <div className="bg-navy/10 dark:bg-navy-light/20 p-6 rounded-2xl flex items-center justify-center text-navy dark:text-navy-light flex-shrink-0">
                <LineChart className="h-16 w-16" />
              </div>
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-navy-light text-sm font-semibold tracking-wide mb-4">
                  {language === "fr" ? "CONSULTING" : "CONSULTING"}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  {language === "fr" ? (
                    <>
                      Expertise <span className="text-secondary">Stratégique</span> pour Votre Croissance
                    </>
                  ) : (
                    <>
                      Strategic <span className="text-secondary">Expertise</span> for Your Growth
                    </>
                  )}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {language === "fr"
                    ? "Nous fournissons des conseils stratégiques et des solutions pratiques pour optimiser vos opérations, stimuler la croissance et résoudre les défis commerciaux complexes."
                    : "We provide strategic advice and practical solutions to optimize your operations, drive growth, and solve complex business challenges."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#services"
                    className="px-6 py-3 bg-navy dark:bg-navy-light text-white rounded-full hover:bg-navy/80 dark:hover:bg-navy-light/80 transition-all duration-300 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {language === "fr" ? "Nos Services" : "Our Services"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-white dark:bg-navy-light/30 text-navy dark:text-white border border-gray-200 dark:border-navy-light/50 rounded-full hover:bg-gray-50 dark:hover:bg-navy-light/40 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    {language === "fr" ? "Demander un Devis" : "Request a Quote"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-gray-50 dark:bg-navy-light/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Aperçu du Service" : "Service Overview"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {language === "fr"
                  ? "Notre équipe de consultants expérimentés combine expertise sectorielle, analyse rigoureuse et pensée innovante pour vous aider à naviguer dans les défis commerciaux complexes et à saisir de nouvelles opportunités. Nous travaillons en étroite collaboration avec vous pour développer des stratégies sur mesure qui génèrent des résultats tangibles."
                  : "Our team of experienced consultants combines industry expertise, rigorous analysis, and innovative thinking to help you navigate complex business challenges and seize new opportunities. We work closely with you to develop tailored strategies that deliver tangible results."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {[
                  {
                    icon: BarChart,
                    title: language === "fr" ? "Analyse Basée sur les Données" : "Data-Driven Analysis",
                    description:
                      language === "fr"
                        ? "Décisions éclairées basées sur des analyses de données approfondies et des insights de marché."
                        : "Informed decisions based on in-depth data analysis and market insights.",
                  },
                  {
                    icon: Target,
                    title: language === "fr" ? "Solutions Stratégiques" : "Strategic Solutions",
                    description:
                      language === "fr"
                        ? "Stratégies personnalisées alignées sur vos objectifs commerciaux spécifiques."
                        : "Customized strategies aligned with your specific business goals.",
                  },
                  {
                    icon: TrendingUp,
                    title: language === "fr" ? "Résultats Mesurables" : "Measurable Results",
                    description:
                      language === "fr"
                        ? "Focus sur la livraison de résultats tangibles et d'améliorations quantifiables."
                        : "Focus on delivering tangible results and quantifiable improvements.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-navy-light/20 p-6 rounded-xl shadow-md border border-gray-100 dark:border-navy-light/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-navy/10 dark:bg-navy-light/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center text-navy dark:text-navy-light mb-4">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-navy-light text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "NOS SERVICES" : "OUR SERVICES"}
              </span>
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Solutions de Consulting" : "Consulting Solutions"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Explorez notre gamme complète de services de consulting conçus pour répondre à vos besoins spécifiques."
                  : "Explore our comprehensive range of consulting services designed to meet your specific needs."}
              </p>
            </motion.div>

            {/* Service Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: "market", label: language === "fr" ? "Analyse de Marché" : "Market Analysis", icon: PieChart },
                  {
                    id: "process",
                    label: language === "fr" ? "Optimisation des Processus" : "Process Optimization",
                    icon: TrendingUp,
                  },
                  {
                    id: "strategy",
                    label: language === "fr" ? "Stratégie d'Entreprise" : "Business Strategy",
                    icon: Target,
                  },
                  {
                    id: "project",
                    label: language === "fr" ? "Gestion de Projet" : "Project Management",
                    icon: Briefcase,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-navy dark:bg-navy-light text-white"
                        : "bg-gray-100 dark:bg-navy-light/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-light/30"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Market Analysis */}
              {activeTab === "market" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Analyse de Marché" : "Market Analysis"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous fournissons des analyses de marché approfondies pour vous aider à comprendre votre environnement concurrentiel, identifier les opportunités et prendre des décisions stratégiques éclairées."
                        : "We provide in-depth market analysis to help you understand your competitive landscape, identify opportunities, and make informed strategic decisions."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Études de marché et analyse concurrentielle",
                            "Segmentation de marché et ciblage",
                            "Analyse des tendances et prévisions",
                            "Évaluation des opportunités de marché",
                            "Analyse du comportement des consommateurs",
                          ]
                        : [
                            "Market research and competitive analysis",
                            "Market segmentation and targeting",
                            "Trend analysis and forecasting",
                            "Market opportunity assessment",
                            "Consumer behavior analysis",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-navy/10 dark:bg-navy-light/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Market Analysis"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Process Optimization */}
              {activeTab === "process" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Optimisation des Processus" : "Process Optimization"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous identifions les inefficacités dans vos processus d'affaires et mettons en œuvre des solutions pour améliorer l'efficacité opérationnelle, réduire les coûts et augmenter la productivité."
                        : "We identify inefficiencies in your business processes and implement solutions to improve operational efficiency, reduce costs, and increase productivity."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Cartographie et analyse des processus",
                            "Identification des goulots d'étranglement et des inefficacités",
                            "Réingénierie des processus d'affaires",
                            "Automatisation des processus",
                            "Mise en œuvre de méthodologies d'amélioration continue",
                          ]
                        : [
                            "Process mapping and analysis",
                            "Identification of bottlenecks and inefficiencies",
                            "Business process reengineering",
                            "Process automation",
                            "Implementation of continuous improvement methodologies",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-navy/10 dark:bg-navy-light/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Process Optimization"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Business Strategy */}
              {activeTab === "strategy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Stratégie d'Entreprise" : "Business Strategy"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous développons des stratégies d'entreprise complètes pour vous aider à définir votre vision, établir des objectifs clairs et créer une feuille de route pour atteindre vos ambitions commerciales."
                        : "We develop comprehensive business strategies to help you define your vision, establish clear objectives, and create a roadmap to achieve your business ambitions."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Planification stratégique et développement",
                            "Analyse SWOT et positionnement concurrentiel",
                            "Stratégies de croissance et d'expansion",
                            "Planification de la transformation numérique",
                            "Développement de modèles d'affaires innovants",
                          ]
                        : [
                            "Strategic planning and development",
                            "SWOT analysis and competitive positioning",
                            "Growth and expansion strategies",
                            "Digital transformation planning",
                            "Innovative business model development",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-navy/10 dark:bg-navy-light/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Business Strategy"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Project Management */}
              {activeTab === "project" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Gestion de Projet" : "Project Management"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous fournissons des services de gestion de projet experts pour vous aider à planifier, exécuter et livrer vos projets dans les délais, dans le respect du budget et selon les spécifications requises."
                        : "We provide expert project management services to help you plan, execute, and deliver your projects on time, within budget, and to the required specifications."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Planification et cadrage de projet",
                            "Gestion des ressources et des délais",
                            "Suivi et reporting de projet",
                            "Gestion des risques et des problèmes",
                            "Méthodologies agiles et traditionnelles",
                          ]
                        : [
                            "Project planning and scoping",
                            "Resource and timeline management",
                            "Project tracking and reporting",
                            "Risk and issue management",
                            "Agile and traditional methodologies",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-navy/10 dark:bg-navy-light/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Project Management"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50 dark:bg-navy-light/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-navy-light text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "NOTRE PROCESSUS" : "OUR PROCESS"}
              </span>
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Notre Approche de Consulting" : "Our Consulting Approach"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Notre méthodologie éprouvée garantit que nous fournissons des solutions efficaces et des résultats mesurables."
                  : "Our proven methodology ensures we deliver effective solutions and measurable results."}
              </p>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: language === "fr" ? "Découverte et Diagnostic" : "Discovery and Diagnosis",
                  description:
                    language === "fr"
                      ? "Nous commençons par comprendre en profondeur votre entreprise, vos défis et vos objectifs pour identifier les opportunités d'amélioration."
                      : "We start by deeply understanding your business, challenges, and goals to identify opportunities for improvement.",
                  icon: Lightbulb,
                },
                {
                  step: "02",
                  title: language === "fr" ? "Analyse et Stratégie" : "Analysis and Strategy",
                  description:
                    language === "fr"
                      ? "Nous analysons les données et développons des stratégies personnalisées pour répondre à vos besoins spécifiques."
                      : "We analyze data and develop customized strategies to address your specific needs.",
                  icon: PresentationChart,
                },
                {
                  step: "03",
                  title: language === "fr" ? "Mise en Œuvre" : "Implementation",
                  description:
                    language === "fr"
                      ? "Nous travaillons avec vous pour mettre en œuvre les solutions recommandées et gérer le changement efficacement."
                      : "We work with you to implement the recommended solutions and manage change effectively.",
                  icon: FileText,
                },
                {
                  step: "04",
                  title: language === "fr" ? "Évaluation et Optimisation" : "Evaluation and Optimization",
                  description:
                    language === "fr"
                      ? "Nous mesurons les résultats, identifions les opportunités d'amélioration continue et affinons les stratégies si nécessaire."
                      : "We measure results, identify opportunities for continuous improvement, and refine strategies as needed.",
                  icon: CheckCircle,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="md:w-16 flex-shrink-0">
                    <div className="w-16 h-16 bg-navy dark:bg-navy-light text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <step.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <div className="text-secondary font-bold text-xl mr-3">{step.step}</div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-navy-light text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "FAQ" : "FAQ"}
              </span>
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Questions Fréquentes" : "Frequently Asked Questions"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Trouvez des réponses aux questions les plus courantes sur nos services de consulting."
                  : "Find answers to the most common questions about our consulting services."}
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-navy-light/20 rounded-xl shadow-md border border-gray-100 dark:border-navy-light/10 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-navy dark:bg-navy-light text-white relative overflow-hidden">
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
              {language === "fr" ? "Prêt à Transformer Votre Entreprise ?" : "Ready to Transform Your Business?"}
            </h2>
            <p className="text-lg mb-8 text-white/90">
              {language === "fr"
                ? "Contactez-nous dès aujourd'hui pour discuter de vos défis commerciaux et découvrir comment notre expertise en consulting peut vous aider à atteindre vos objectifs."
                : "Contact us today to discuss your business challenges and discover how our consulting expertise can help you achieve your goals."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-navy dark:text-navy-light rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block font-medium"
              >
                {language === "fr" ? "Contactez-Nous" : "Get in Touch"}
              </Link>
              <Link
                href="/contact?type=quote"
                className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-navy dark:hover:text-navy-light transition-all duration-300 transform hover:scale-105 shadow-lg inline-block font-medium"
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

