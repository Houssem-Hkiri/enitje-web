"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Cog,
  PenToolIcon as Tool,
  Ruler,
  FileText,
  CheckCircle,
  ArrowRight,
  Wrench,
  Cpu,
  Clipboard,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { getThemePreference, setThemePreference } from "@/app/utils/theme"
import { useLanguage } from "@/app/contexts/LanguageContext"

export default function MechanicalDesignPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("design")
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
            question: "Quels logiciels de CAO utilisez-vous pour la conception mécanique ?",
            answer:
              "Nous utilisons les logiciels de CAO les plus avancés de l'industrie, notamment SolidWorks, AutoCAD, CATIA, et Fusion 360. Notre équipe est certifiée et expérimentée dans l'utilisation de ces outils pour créer des conceptions mécaniques précises et détaillées.",
          },
          {
            question: "Pouvez-vous créer des prototypes physiques de vos conceptions ?",
            answer:
              "Oui, nous offrons des services de prototypage rapide en utilisant diverses technologies, notamment l'impression 3D, l'usinage CNC et la fabrication de tôles. Nous pouvons créer des prototypes fonctionnels pour tester et valider vos conceptions avant la production à grande échelle.",
          },
          {
            question: "Comment assurez-vous la qualité de vos conceptions mécaniques ?",
            answer:
              "Nous suivons un processus rigoureux d'assurance qualité qui comprend des analyses par éléments finis (FEA), des simulations de contraintes et de déformations, et des vérifications de conception par des pairs. Nous adhérons également aux normes industrielles pertinentes et aux meilleures pratiques de conception.",
          },
          {
            question: "Combien de temps faut-il pour compléter un projet de conception mécanique ?",
            answer:
              "La durée d'un projet de conception mécanique varie en fonction de sa complexité et de sa portée. Un projet simple peut prendre 1-2 semaines, tandis qu'un projet complexe peut nécessiter plusieurs mois. Nous établissons toujours un calendrier détaillé lors de la phase initiale du projet.",
          },
        ]
      : [
          {
            question: "What CAD software do you use for mechanical design?",
            answer:
              "We use the most advanced CAD software in the industry, including SolidWorks, AutoCAD, CATIA, and Fusion 360. Our team is certified and experienced in using these tools to create precise and detailed mechanical designs.",
          },
          {
            question: "Can you create physical prototypes of your designs?",
            answer:
              "Yes, we offer rapid prototyping services using various technologies, including 3D printing, CNC machining, and sheet metal fabrication. We can create functional prototypes to test and validate your designs before large-scale production.",
          },
          {
            question: "How do you ensure the quality of your mechanical designs?",
            answer:
              "We follow a rigorous quality assurance process that includes finite element analysis (FEA), stress and strain simulations, and peer design reviews. We also adhere to relevant industry standards and design best practices.",
          },
          {
            question: "How long does it take to complete a mechanical design project?",
            answer:
              "The duration of a mechanical design project varies depending on its complexity and scope. A simple project may take 1-2 weeks, while a complex project may require several months. We always establish a detailed timeline during the initial project phase.",
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
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8"
            >
              <div className="bg-secondary/10 dark:bg-secondary/20 p-6 rounded-2xl flex items-center justify-center text-secondary flex-shrink-0">
                <Cog className="h-16 w-16" />
              </div>
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                  {language === "fr" ? "CONCEPTION MÉCANIQUE" : "MECHANICAL DESIGN"}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  {language === "fr" ? (
                    <>
                      Solutions <span className="text-secondary">d'Ingénierie</span> Mécanique Innovantes
                    </>
                  ) : (
                    <>
                      Innovative <span className="text-secondary">Mechanical</span> Engineering Solutions
                    </>
                  )}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {language === "fr"
                    ? "Nous concevons des solutions mécaniques innovantes et efficaces qui répondent à vos besoins spécifiques, en utilisant les dernières technologies et méthodologies d'ingénierie."
                    : "We design innovative and efficient mechanical solutions that meet your specific needs, using the latest engineering technologies and methodologies."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#services"
                    className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary/80 transition-all duration-300 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {language === "fr" ? "Nos Services" : "Our Services"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-white dark:bg-navy-light text-navy dark:text-white border border-gray-200 dark:border-navy-light/50 rounded-full hover:bg-gray-50 dark:hover:bg-navy-light/80 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
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
                  ? "Notre équipe d'ingénieurs mécaniques qualifiés combine expertise technique, créativité et rigueur pour concevoir des solutions mécaniques qui répondent aux exigences les plus strictes. De la conception initiale à la documentation technique détaillée, nous vous accompagnons à chaque étape du processus de développement de produits mécaniques."
                  : "Our team of qualified mechanical engineers combines technical expertise, creativity, and rigor to design mechanical solutions that meet the most stringent requirements. From initial design to detailed technical documentation, we support you at every stage of the mechanical product development process."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {[
                  {
                    icon: Ruler,
                    title: language === "fr" ? "Conception Précise" : "Precise Design",
                    description:
                      language === "fr"
                        ? "Conceptions mécaniques détaillées et précises utilisant les derniers outils de CAO."
                        : "Detailed and precise mechanical designs using the latest CAD tools.",
                  },
                  {
                    icon: Tool,
                    title: language === "fr" ? "Prototypage Rapide" : "Rapid Prototyping",
                    description:
                      language === "fr"
                        ? "Création rapide de prototypes fonctionnels pour tester et valider les conceptions."
                        : "Rapid creation of functional prototypes to test and validate designs.",
                  },
                  {
                    icon: FileText,
                    title: language === "fr" ? "Documentation Complète" : "Comprehensive Documentation",
                    description:
                      language === "fr"
                        ? "Documentation technique détaillée pour la fabrication et l'assemblage."
                        : "Detailed technical documentation for manufacturing and assembly.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-navy-light/20 p-6 rounded-xl shadow-md border border-gray-100 dark:border-navy-light/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-secondary/10 dark:bg-secondary/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center text-secondary mb-4">
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
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "NOS SERVICES" : "OUR SERVICES"}
              </span>
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Solutions de Conception Mécanique" : "Mechanical Design Solutions"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Explorez notre gamme complète de services de conception mécanique conçus pour répondre à vos besoins spécifiques."
                  : "Explore our comprehensive range of mechanical design services designed to meet your specific needs."}
              </p>
            </motion.div>

            {/* Service Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: "cad", label: language === "fr" ? "Conception CAO" : "CAD Design", icon: Ruler },
                  { id: "prototype", label: language === "fr" ? "Prototypage" : "Prototyping", icon: Tool },
                  {
                    id: "analysis",
                    label: language === "fr" ? "Analyse Structurelle" : "Structural Analysis",
                    icon: Cpu,
                  },
                  {
                    id: "documentation",
                    label: language === "fr" ? "Documentation" : "Documentation",
                    icon: Clipboard,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-secondary text-white"
                        : "bg-gray-100 dark:bg-navy-light/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-light/30"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* CAD Design */}
              {activeTab === "cad" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Conception CAO" : "CAD Design"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous créons des modèles 3D détaillés et des dessins techniques précis en utilisant les logiciels de CAO les plus avancés pour transformer vos idées en conceptions réalisables."
                        : "We create detailed 3D models and precise technical drawings using the most advanced CAD software to transform your ideas into feasible designs."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Modélisation 3D paramétrique",
                            "Conception de pièces et d'assemblages",
                            "Dessins techniques détaillés",
                            "Conception pour la fabrication (DFM)",
                            "Rétro-ingénierie de pièces existantes",
                          ]
                        : [
                            "Parametric 3D modeling",
                            "Parts and assembly design",
                            "Detailed technical drawings",
                            "Design for Manufacturing (DFM)",
                            "Reverse engineering of existing parts",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-secondary/10 dark:bg-secondary/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="CAD Design"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Prototyping */}
              {activeTab === "prototype" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Prototypage" : "Prototyping"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous développons des prototypes fonctionnels pour tester et valider vos conceptions avant la production à grande échelle, réduisant ainsi les risques et les coûts."
                        : "We develop functional prototypes to test and validate your designs before large-scale production, reducing risks and costs."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Impression 3D (FDM, SLA, SLS)",
                            "Usinage CNC",
                            "Fabrication de tôles",
                            "Prototypes fonctionnels",
                            "Tests et validation de concepts",
                          ]
                        : [
                            "3D printing (FDM, SLA, SLS)",
                            "CNC machining",
                            "Sheet metal fabrication",
                            "Functional prototypes",
                            "Concept testing and validation",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-secondary/10 dark:bg-secondary/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Prototyping"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Structural Analysis */}
              {activeTab === "analysis" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Analyse Structurelle" : "Structural Analysis"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous effectuons des analyses par éléments finis (FEA) pour évaluer la résistance, la rigidité et la durabilité de vos conceptions, garantissant qu'elles répondent aux exigences de performance."
                        : "We perform Finite Element Analysis (FEA) to evaluate the strength, stiffness, and durability of your designs, ensuring they meet performance requirements."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Analyse statique et dynamique",
                            "Analyse thermique",
                            "Optimisation topologique",
                            "Analyse de fatigue",
                            "Simulation de contraintes et de déformations",
                          ]
                        : [
                            "Static and dynamic analysis",
                            "Thermal analysis",
                            "Topology optimization",
                            "Fatigue analysis",
                            "Stress and strain simulation",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-secondary/10 dark:bg-secondary/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Structural Analysis"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Documentation */}
              {activeTab === "documentation" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Documentation Technique" : "Technical Documentation"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous créons une documentation technique complète et détaillée pour faciliter la fabrication, l'assemblage et la maintenance de vos produits mécaniques."
                        : "We create comprehensive and detailed technical documentation to facilitate the manufacturing, assembly, and maintenance of your mechanical products."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Dessins d'assemblage et de détail",
                            "Nomenclatures (BOM)",
                            "Instructions d'assemblage",
                            "Manuels d'utilisation et de maintenance",
                            "Documentation conforme aux normes industrielles",
                          ]
                        : [
                            "Assembly and detail drawings",
                            "Bills of Materials (BOM)",
                            "Assembly instructions",
                            "User and maintenance manuals",
                            "Documentation compliant with industry standards",
                          ]
                      ).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-secondary/10 dark:bg-secondary/20 p-8 rounded-2xl">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Technical Documentation"
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
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "NOTRE PROCESSUS" : "OUR PROCESS"}
              </span>
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Notre Approche de Conception" : "Our Design Approach"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Notre processus de conception méthodique garantit que nous livrons des solutions mécaniques de haute qualité qui répondent à vos exigences spécifiques."
                  : "Our methodical design process ensures we deliver high-quality mechanical solutions that meet your specific requirements."}
              </p>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: language === "fr" ? "Définition des Exigences" : "Requirements Definition",
                  description:
                    language === "fr"
                      ? "Nous commençons par comprendre en profondeur vos besoins, contraintes et objectifs pour définir clairement les spécifications du projet."
                      : "We start by deeply understanding your needs, constraints, and goals to clearly define the project specifications.",
                  icon: Clipboard,
                },
                {
                  step: "02",
                  title: language === "fr" ? "Conception et Modélisation" : "Design and Modeling",
                  description:
                    language === "fr"
                      ? "Nous créons des modèles 3D détaillés et des dessins techniques en utilisant des logiciels de CAO avancés."
                      : "We create detailed 3D models and technical drawings using advanced CAD software.",
                  icon: Ruler,
                },
                {
                  step: "03",
                  title: language === "fr" ? "Analyse et Optimisation" : "Analysis and Optimization",
                  description:
                    language === "fr"
                      ? "Nous effectuons des analyses structurelles et optimisons les conceptions pour garantir performance et fabricabilité."
                      : "We perform structural analysis and optimize designs to ensure performance and manufacturability.",
                  icon: Cpu,
                },
                {
                  step: "04",
                  title: language === "fr" ? "Prototypage et Validation" : "Prototyping and Validation",
                  description:
                    language === "fr"
                      ? "Nous créons des prototypes pour tester et valider les conceptions, puis finalisons la documentation technique pour la production."
                      : "We create prototypes to test and validate designs, then finalize technical documentation for production.",
                  icon: Wrench,
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
                    <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg">
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
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                {language === "fr" ? "FAQ" : "FAQ"}
              </span>
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Questions Fréquentes" : "Frequently Asked Questions"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Trouvez des réponses aux questions les plus courantes sur nos services de conception mécanique."
                  : "Find answers to the most common questions about our mechanical design services."}
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
              {language === "fr" ? "Prêt à Concrétiser Votre Projet ?" : "Ready to Bring Your Project to Life?"}
            </h2>
            <p className="text-lg mb-8 text-white/90">
              {language === "fr"
                ? "Contactez-nous dès aujourd'hui pour discuter de vos besoins en conception mécanique et découvrir comment notre expertise peut vous aider à réaliser vos idées."
                : "Contact us today to discuss your mechanical design needs and discover how our expertise can help you bring your ideas to life."}
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

