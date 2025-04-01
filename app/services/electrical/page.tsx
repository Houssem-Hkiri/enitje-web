"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Cpu, FileText, CheckCircle, ArrowRight, Gauge, Wifi, Clipboard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { getThemePreference, setThemePreference } from '@/app/utils/theme'

export default function ElectricalDesignPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [activeTab, setActiveTab] = useState<string>("circuit")

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
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Create Circuit icon component since it's not in lucide-react
  const Circuit = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 13V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z" />
      <path d="M5 8v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V8" />
      <path d="M16 9h.01" />
      <path d="M12 9h.01" />
      <path d="M8 9h.01" />
      <path d="M16 13h.01" />
      <path d="M12 13h.01" />
      <path d="M8 13h.01" />
    </svg>
  )

  // FAQ data
  const faqs =
    language === "fr"
      ? [
          {
            question: "Quels types de projets de conception électrique réalisez-vous ?",
            answer:
              "Nous réalisons une large gamme de projets de conception électrique, notamment des circuits imprimés (PCB), des systèmes de contrôle, des systèmes d'automatisation, des installations électriques pour bâtiments et des systèmes d'énergie renouvelable. Notre équipe est qualifiée pour travailler sur des projets de toutes tailles et complexités.",
          },
          {
            question: "Utilisez-vous des logiciels spécifiques pour la conception électrique ?",
            answer:
              "Oui, nous utilisons les logiciels de conception électrique les plus avancés de l'industrie, notamment Altium Designer, Eagle, KiCad pour la conception de PCB, ainsi que AutoCAD Electrical, EPLAN et Siemens NX pour les schémas électriques et l'automatisation. Nous choisissons l'outil le plus adapté à chaque projet.",
          },
          {
            question: "Vos conceptions électriques respectent-elles les normes internationales ?",
            answer:
              "Absolument. Toutes nos conceptions électriques sont conformes aux normes internationales pertinentes, notamment IEC, IEEE, NEC, et les directives CE pour le marché européen. Nous nous assurons que tous les aspects de sécurité, de compatibilité électromagnétique (CEM) et d'efficacité énergétique sont pris en compte.",
          },
          {
            question: "Proposez-vous des services de prototypage pour les conceptions électriques ?",
            answer:
              "Oui, nous offrons des services de prototypage rapide pour les circuits imprimés et les systèmes électriques. Nous pouvons produire des prototypes fonctionnels pour tester et valider vos conceptions avant la production à grande échelle, ce qui permet d'identifier et de résoudre les problèmes potentiels à un stade précoce.",
          },
        ]
      : [
          {
            question: "What types of electrical design projects do you handle?",
            answer:
              "We handle a wide range of electrical design projects, including printed circuit boards (PCBs), control systems, automation systems, electrical installations for buildings, and renewable energy systems. Our team is qualified to work on projects of all sizes and complexities.",
          },
          {
            question: "Do you use specific software for electrical design?",
            answer:
              "Yes, we use the most advanced electrical design software in the industry, including Altium Designer, Eagle, KiCad for PCB design, as well as AutoCAD Electrical, EPLAN, and Siemens NX for electrical schematics and automation. We choose the most appropriate tool for each project.",
          },
          {
            question: "Do your electrical designs comply with international standards?",
            answer:
              "Absolutely. All our electrical designs comply with relevant international standards, including IEC, IEEE, NEC, and CE directives for the European market. We ensure that all aspects of safety, electromagnetic compatibility (EMC), and energy efficiency are taken into account.",
          },
          {
            question: "Do you offer prototyping services for electrical designs?",
            answer:
              "Yes, we offer rapid prototyping services for printed circuit boards and electrical systems. We can produce functional prototypes to test and validate your designs before large-scale production, allowing potential issues to be identified and resolved at an early stage.",
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
                <Zap className="h-16 w-16" />
              </div>
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-navy-light text-sm font-semibold tracking-wide mb-4">
                  {language === "fr" ? "CONCEPTION ÉLECTRIQUE" : "ELECTRICAL DESIGN"}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  {language === "fr" ? (
                    <>
                      Expertise en <span className="text-secondary">Ingénierie</span> Électrique
                    </>
                  ) : (
                    <>
                      <span className="text-secondary">Electrical</span> Engineering Expertise
                    </>
                  )}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {language === "fr"
                    ? "Nous concevons des systèmes électriques fiables, efficaces et innovants qui répondent à vos besoins spécifiques, en utilisant les dernières technologies et méthodologies d'ingénierie."
                    : "We design reliable, efficient, and innovative electrical systems that meet your specific needs, using the latest engineering technologies and methodologies."}
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Aperçu du Service" : "Service Overview"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {language === "fr"
                  ? "Notre équipe d'ingénieurs électriques qualifiés combine expertise technique, innovation et rigueur pour concevoir des systèmes électriques qui répondent aux exigences les plus strictes en matière de performance, de sécurité et d'efficacité. De la conception de circuits à l'automatisation industrielle, nous vous accompagnons à chaque étape du processus de développement électrique."
                  : "Our team of qualified electrical engineers combines technical expertise, innovation, and rigor to design electrical systems that meet the most stringent requirements for performance, safety, and efficiency. From circuit design to industrial automation, we support you at every stage of the electrical development process."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {[
                  {
                    icon: Circuit,
                    title: language === "fr" ? "Conception de Circuits" : "Circuit Design",
                    description:
                      language === "fr"
                        ? "Conception de circuits électroniques et de PCB pour diverses applications."
                        : "Design of electronic circuits and PCBs for various applications.",
                  },
                  {
                    icon: Cpu,
                    title: language === "fr" ? "Systèmes de Contrôle" : "Control Systems",
                    description:
                      language === "fr"
                        ? "Développement de systèmes d'automatisation et de contrôle industriels."
                        : "Development of industrial automation and control systems.",
                  },
                  {
                    icon: Gauge,
                    title: language === "fr" ? "Audits Énergétiques" : "Energy Audits",
                    description:
                      language === "fr"
                        ? "Évaluation et optimisation de l'efficacité énergétique des systèmes électriques."
                        : "Assessment and optimization of electrical systems' energy efficiency.",
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
                {language === "fr" ? "Solutions de Conception Électrique" : "Electrical Design Solutions"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Explorez notre gamme complète de services de conception électrique conçus pour répondre à vos besoins spécifiques."
                  : "Explore our comprehensive range of electrical design services designed to meet your specific needs."}
              </p>
            </motion.div>

            {/* Service Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  {
                    id: "circuit",
                    label: language === "fr" ? "Conception de Circuits" : "Circuit Design",
                    icon: Circuit,
                  },
                  { id: "automation", label: language === "fr" ? "Automatisation" : "Automation", icon: Cpu },
                  { id: "control", label: language === "fr" ? "Systèmes de Contrôle" : "Control Systems", icon: Wifi },
                  { id: "energy", label: language === "fr" ? "Audits Énergétiques" : "Energy Audits", icon: Gauge },
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

              {/* Circuit Design */}
              {activeTab === "circuit" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Conception de Circuits" : "Circuit Design"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous concevons des circuits électroniques et des PCB personnalisés pour diverses applications, en utilisant les dernières technologies et méthodologies de conception."
                        : "We design custom electronic circuits and PCBs for various applications, using the latest design technologies and methodologies."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Conception de circuits imprimés (PCB)",
                            "Conception de circuits analogiques et numériques",
                            "Conception de circuits intégrés",
                            "Conception de circuits RF et micro-ondes",
                            "Conception pour la fabrication et les tests (DFM/DFT)",
                          ]
                        : [
                            "Printed Circuit Board (PCB) design",
                            "Analog and digital circuit design",
                            "Integrated circuit design",
                            "RF and microwave circuit design",
                            "Design for Manufacturing and Testing (DFM/DFT)",
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
                      alt="Circuit Design"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Automation */}
              {activeTab === "automation" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Automatisation" : "Automation"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous développons des solutions d'automatisation industrielle pour améliorer l'efficacité, la productivité et la sécurité de vos processus de production."
                        : "We develop industrial automation solutions to improve the efficiency, productivity, and safety of your production processes."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Programmation d'automates programmables (PLC)",
                            "Systèmes SCADA",
                            "Interfaces homme-machine (IHM)",
                            "Réseaux industriels",
                            "Intégration de robots industriels",
                          ]
                        : [
                            "Programmable Logic Controller (PLC) programming",
                            "SCADA systems",
                            "Human-Machine Interfaces (HMI)",
                            "Industrial networks",
                            "Industrial robot integration",
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
                      alt="Automation"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Control Systems */}
              {activeTab === "control" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Systèmes de Contrôle" : "Control Systems"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous concevons des systèmes de contrôle avancés pour surveiller et gérer divers processus et équipements, garantissant une performance optimale et une fiabilité maximale."
                        : "We design advanced control systems to monitor and manage various processes and equipment, ensuring optimal performance and maximum reliability."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Systèmes de contrôle distribué (DCS)",
                            "Contrôle de processus",
                            "Systèmes de sécurité et d'alarme",
                            "Contrôle de moteurs et d'entraînements",
                            "Systèmes de surveillance et de diagnostic",
                          ]
                        : [
                            "Distributed Control Systems (DCS)",
                            "Process control",
                            "Safety and alarm systems",
                            "Motor and drive control",
                            "Monitoring and diagnostic systems",
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
                      alt="Control Systems"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Energy Audits */}
              {activeTab === "energy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-navy dark:text-navy-light">
                      {language === "fr" ? "Audits Énergétiques" : "Energy Audits"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous évaluons l'efficacité énergétique de vos systèmes électriques et proposons des solutions pour réduire la consommation d'énergie, les coûts opérationnels et l'impact environnemental."
                        : "We assess the energy efficiency of your electrical systems and propose solutions to reduce energy consumption, operational costs, and environmental impact."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Analyse de la consommation d'énergie",
                            "Identification des pertes d'énergie",
                            "Recommandations d'amélioration de l'efficacité",
                            "Conception de systèmes d'énergie renouvelable",
                            "Conformité aux normes d'efficacité énergétique",
                          ]
                        : [
                            "Energy consumption analysis",
                            "Identification of energy losses",
                            "Efficiency improvement recommendations",
                            "Renewable energy system design",
                            "Compliance with energy efficiency standards",
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
                      alt="Energy Audits"
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
                {language === "fr" ? "Notre Approche de Conception" : "Our Design Approach"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Notre processus de conception méthodique garantit que nous livrons des solutions électriques de haute qualité qui répondent à vos exigences spécifiques."
                  : "Our methodical design process ensures we deliver high-quality electrical solutions that meet your specific requirements."}
              </p>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: language === "fr" ? "Analyse des Besoins" : "Requirements Analysis",
                  description:
                    language === "fr"
                      ? "Nous commençons par comprendre en profondeur vos besoins, contraintes et objectifs pour définir clairement les spécifications du projet."
                      : "We start by deeply understanding your needs, constraints, and goals to clearly define the project specifications.",
                  icon: Clipboard,
                },
                {
                  step: "02",
                  title: language === "fr" ? "Conception et Simulation" : "Design and Simulation",
                  description:
                    language === "fr"
                      ? "Nous créons des schémas électriques détaillés et effectuons des simulations pour valider les concepts avant la mise en œuvre."
                      : "We create detailed electrical schematics and perform simulations to validate concepts before implementation.",
                  icon: Circuit,
                },
                {
                  step: "03",
                  title: language === "fr" ? "Prototypage et Tests" : "Prototyping and Testing",
                  description:
                    language === "fr"
                      ? "Nous développons des prototypes et effectuons des tests rigoureux pour garantir la fonctionnalité, la fiabilité et la sécurité."
                      : "We develop prototypes and perform rigorous testing to ensure functionality, reliability, and safety.",
                  icon: Cpu,
                },
                {
                  step: "04",
                  title: language === "fr" ? "Documentation et Livraison" : "Documentation and Delivery",
                  description:
                    language === "fr"
                      ? "Nous fournissons une documentation technique complète et assurons une transition en douceur vers la production ou l'implémentation."
                      : "We provide comprehensive technical documentation and ensure a smooth transition to production or implementation.",
                  icon: FileText,
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
                  ? "Trouvez des réponses aux questions les plus courantes sur nos services de conception électrique."
                  : "Find answers to the most common questions about our electrical design services."}
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
              {language === "fr" ? "Prêt à Concrétiser Votre Projet ?" : "Ready to Bring Your Project to Life?"}
            </h2>
            <p className="text-lg mb-8 text-white/90">
              {language === "fr"
                ? "Contactez-nous dès aujourd'hui pour discuter de vos besoins en conception électrique et découvrir comment notre expertise peut vous aider à réaliser vos idées."
                : "Contact us today to discuss your electrical design needs and discover how our expertise can help you bring your ideas to life."}
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

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

