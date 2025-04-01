"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Code,
  Server,
  Globe,
  Smartphone,
  Laptop,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  FileCode,
  Layers,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { getThemePreference, setThemePreference } from '@/app/utils/theme'

export default function ITDevelopmentPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [activeTab, setActiveTab] = useState<string>("web")

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

  // FAQ data
  const faqs =
    language === "fr"
      ? [
          {
            question: "Quels types de projets de développement informatique réalisez-vous ?",
            answer:
              "Nous développons une large gamme de solutions numériques, notamment des sites web, des applications mobiles, des systèmes de gestion, des intégrations API, des plateformes e-commerce et des solutions sur mesure adaptées aux besoins spécifiques de nos clients.",
          },
          {
            question: "Combien de temps faut-il pour développer une application web ?",
            answer:
              "La durée de développement varie en fonction de la complexité du projet. Un site web simple peut prendre 2-4 semaines, tandis qu'une application web complexe peut nécessiter 2-6 mois. Nous fournissons toujours un calendrier détaillé lors de la phase de planification.",
          },
          {
            question: "Quelles technologies utilisez-vous pour le développement ?",
            answer:
              "Nous utilisons les technologies les plus récentes et les plus adaptées à chaque projet. Pour le développement web, nous travaillons avec React, Next.js, Vue.js, et d'autres frameworks modernes. Pour le mobile, nous utilisons React Native et Flutter. Nos solutions backend sont développées avec Node.js, Python, et Java.",
          },
          {
            question: "Proposez-vous des services de maintenance après le lancement ?",
            answer:
              "Oui, nous offrons des services de maintenance et de support continus pour tous nos projets. Nous proposons différents forfaits de maintenance adaptés aux besoins de chaque client, incluant les mises à jour de sécurité, les corrections de bugs, et les améliorations fonctionnelles.",
          },
        ]
      : [
          {
            question: "What types of IT development projects do you handle?",
            answer:
              "We develop a wide range of digital solutions, including websites, mobile applications, management systems, API integrations, e-commerce platforms, and custom solutions tailored to our clients' specific needs.",
          },
          {
            question: "How long does it take to develop a web application?",
            answer:
              "Development time varies depending on project complexity. A simple website might take 2-4 weeks, while a complex web application could require 2-6 months. We always provide a detailed timeline during the planning phase.",
          },
          {
            question: "What technologies do you use for development?",
            answer:
              "We use the latest and most appropriate technologies for each project. For web development, we work with React, Next.js, Vue.js, and other modern frameworks. For mobile, we use React Native and Flutter. Our backend solutions are developed with Node.js, Python, and Java.",
          },
          {
            question: "Do you offer maintenance services after launch?",
            answer:
              "Yes, we provide ongoing maintenance and support services for all our projects. We offer different maintenance packages tailored to each client's needs, including security updates, bug fixes, and functional improvements.",
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
                <Code className="h-16 w-16" />
              </div>
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide mb-4">
                  {language === "fr" ? "DÉVELOPPEMENT INFORMATIQUE" : "IT DEVELOPMENT"}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  {language === "fr" ? (
                    <>
                      Solutions <span className="text-secondary">Numériques</span> Personnalisées
                    </>
                  ) : (
                    <>
                      Custom <span className="text-secondary">Digital</span> Solutions
                    </>
                  )}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {language === "fr"
                    ? "Nous concevons et développons des solutions numériques innovantes qui répondent parfaitement à vos besoins spécifiques, en utilisant les technologies les plus récentes et les meilleures pratiques de l'industrie."
                    : "We design and develop innovative digital solutions that perfectly meet your specific needs, using the latest technologies and industry best practices."}
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {language === "fr" ? "Aperçu du Service" : "Service Overview"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {language === "fr"
                  ? "Notre équipe de développeurs talentueux crée des solutions numériques sur mesure qui aident votre entreprise à se démarquer dans le paysage numérique actuel. Nous combinons expertise technique, design intuitif et stratégie commerciale pour développer des produits numériques qui répondent à vos objectifs spécifiques."
                  : "Our team of talented developers creates custom digital solutions that help your business stand out in today's digital landscape. We combine technical expertise, intuitive design, and business strategy to develop digital products that meet your specific goals."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {[
                  {
                    icon: Globe,
                    title: language === "fr" ? "Sites Web Modernes" : "Modern Websites",
                    description:
                      language === "fr"
                        ? "Sites web réactifs et performants avec des expériences utilisateur exceptionnelles."
                        : "Responsive and high-performance websites with exceptional user experiences.",
                  },
                  {
                    icon: Smartphone,
                    title: language === "fr" ? "Applications Mobiles" : "Mobile Applications",
                    description:
                      language === "fr"
                        ? "Applications natives et multiplateformes pour iOS et Android."
                        : "Native and cross-platform applications for iOS and Android.",
                  },
                  {
                    icon: Server,
                    title: language === "fr" ? "Solutions Backend" : "Backend Solutions",
                    description:
                      language === "fr"
                        ? "APIs robustes, systèmes de gestion et infrastructures cloud évolutives."
                        : "Robust APIs, management systems, and scalable cloud infrastructures.",
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
                {language === "fr" ? "Solutions de Développement" : "Development Solutions"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Explorez notre gamme complète de services de développement informatique conçus pour répondre à vos besoins spécifiques."
                  : "Explore our comprehensive range of IT development services designed to meet your specific needs."}
              </p>
            </motion.div>

            {/* Service Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: "web", label: language === "fr" ? "Développement Web" : "Web Development", icon: Globe },
                  { id: "mobile", label: language === "fr" ? "Applications Mobiles" : "Mobile Apps", icon: Smartphone },
                  {
                    id: "custom",
                    label: language === "fr" ? "Solutions Sur Mesure" : "Custom Solutions",
                    icon: Layers,
                  },
                  { id: "maintenance", label: language === "fr" ? "Maintenance" : "Maintenance", icon: RefreshCw },
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

              {/* Web Development */}
              {activeTab === "web" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Développement Web" : "Web Development"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous créons des sites web et des applications web modernes, réactifs et performants qui offrent une expérience utilisateur exceptionnelle sur tous les appareils."
                        : "We create modern, responsive, and high-performance websites and web applications that deliver an exceptional user experience across all devices."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Sites web d'entreprise et vitrines",
                            "Applications web progressives (PWA)",
                            "Plateformes e-commerce",
                            "Systèmes de gestion de contenu (CMS)",
                            "Intégrations API et services tiers",
                          ]
                        : [
                            "Corporate websites and showcases",
                            "Progressive Web Applications (PWA)",
                            "E-commerce platforms",
                            "Content Management Systems (CMS)",
                            "API integrations and third-party services",
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
                      alt="Web Development"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Mobile Apps */}
              {activeTab === "mobile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Applications Mobiles" : "Mobile Applications"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous développons des applications mobiles natives et multiplateformes qui offrent des performances optimales et une expérience utilisateur fluide sur iOS et Android."
                        : "We develop native and cross-platform mobile applications that deliver optimal performance and a seamless user experience on iOS and Android."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Applications iOS et Android natives",
                            "Applications multiplateformes (React Native, Flutter)",
                            "Applications d'entreprise et B2B",
                            "Applications e-commerce et marketplace",
                            "Intégration de fonctionnalités avancées (géolocalisation, notifications push, etc.)",
                          ]
                        : [
                            "Native iOS and Android applications",
                            "Cross-platform applications (React Native, Flutter)",
                            "Enterprise and B2B applications",
                            "E-commerce and marketplace applications",
                            "Integration of advanced features (geolocation, push notifications, etc.)",
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
                      alt="Mobile Applications"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Custom Solutions */}
              {activeTab === "custom" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Solutions Sur Mesure" : "Custom Solutions"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous développons des solutions logicielles personnalisées qui répondent parfaitement à vos besoins spécifiques et s'intègrent à vos systèmes existants."
                        : "We develop custom software solutions that perfectly meet your specific needs and integrate with your existing systems."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Systèmes de gestion d'entreprise (ERP, CRM)",
                            "Automatisation des processus métier",
                            "Intégration de systèmes et migration de données",
                            "Solutions cloud et architecture évolutive",
                            "Développement d'API et services web",
                          ]
                        : [
                            "Enterprise management systems (ERP, CRM)",
                            "Business process automation",
                            "System integration and data migration",
                            "Cloud solutions and scalable architecture",
                            "API development and web services",
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
                      alt="Custom Solutions"
                      width={400}
                      height={300}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}

              {/* Maintenance */}
              {activeTab === "maintenance" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {language === "fr" ? "Maintenance et Support" : "Maintenance and Support"}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {language === "fr"
                        ? "Nous offrons des services de maintenance et de support continus pour garantir que vos applications fonctionnent de manière optimale et restent à jour avec les dernières technologies."
                        : "We provide ongoing maintenance and support services to ensure your applications run optimally and stay up-to-date with the latest technologies."}
                    </p>
                    <ul className="space-y-3">
                      {(language === "fr"
                        ? [
                            "Maintenance préventive et corrective",
                            "Mises à jour de sécurité et corrections de bugs",
                            "Optimisation des performances",
                            "Ajout de nouvelles fonctionnalités",
                            "Support technique et assistance utilisateur",
                          ]
                        : [
                            "Preventive and corrective maintenance",
                            "Security updates and bug fixes",
                            "Performance optimization",
                            "Addition of new features",
                            "Technical support and user assistance",
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
                      alt="Maintenance and Support"
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
                {language === "fr" ? "Comment Nous Travaillons" : "How We Work"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {language === "fr"
                  ? "Notre approche méthodique garantit que nous livrons des solutions de haute qualité qui répondent parfaitement à vos besoins."
                  : "Our methodical approach ensures we deliver high-quality solutions that perfectly meet your needs."}
              </p>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: language === "fr" ? "Analyse des Besoins" : "Requirements Analysis",
                  description:
                    language === "fr"
                      ? "Nous commençons par comprendre en profondeur vos besoins, objectifs et contraintes pour définir clairement la portée du projet."
                      : "We start by deeply understanding your needs, goals, and constraints to clearly define the project scope.",
                  icon: MessageSquare,
                },
                {
                  step: "02",
                  title: language === "fr" ? "Conception et Prototypage" : "Design and Prototyping",
                  description:
                    language === "fr"
                      ? "Nous créons des wireframes et des prototypes interactifs pour visualiser la solution avant le développement."
                      : "We create wireframes and interactive prototypes to visualize the solution before development.",
                  icon: Laptop,
                },
                {
                  step: "03",
                  title: language === "fr" ? "Développement" : "Development",
                  description:
                    language === "fr"
                      ? "Notre équipe développe la solution en utilisant les technologies les plus adaptées, avec des cycles de développement itératifs."
                      : "Our team develops the solution using the most appropriate technologies, with iterative development cycles.",
                  icon: FileCode,
                },
                {
                  step: "04",
                  title: language === "fr" ? "Tests et Déploiement" : "Testing and Deployment",
                  description:
                    language === "fr"
                      ? "Nous effectuons des tests rigoureux pour garantir la qualité, puis déployons la solution dans votre environnement."
                      : "We perform rigorous testing to ensure quality, then deploy the solution to your environment.",
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
                  ? "Trouvez des réponses aux questions les plus courantes sur nos services de développement informatique."
                  : "Find answers to the most common questions about our IT development services."}
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
                ? "Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous aider à atteindre vos objectifs numériques."
                : "Contact us today to discuss your project and discover how we can help you achieve your digital goals."}
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

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

