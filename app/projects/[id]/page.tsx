"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { projectsData } from "../../data/projects"
import { getThemePreference, setThemePreference } from '../../utils/theme'

export default function ProjectDetailPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [project, setProject] = useState<any>(null)
  const params = useParams()
  const router = useRouter()

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

  // Find the project based on the ID
  useEffect(() => {
    if (params.id) {
      const id = Number.parseInt(params.id as string)
      const currentProjects = projectsData[language]
      const foundProject = currentProjects.find((item) => item.id === id)

      if (foundProject) {
        // Add additional details for the detail page
        setProject({
          ...foundProject,
          date: language === "fr" ? "15 juin 2023" : "June 15, 2023",
          client: language === "fr" ? "TechSolutions Inc." : "TechSolutions Inc.",
          duration: language === "fr" ? "3 mois" : "3 months",
          team: language === "fr" ? "4 membres" : "4 members",
          content:
            language === "fr"
              ? `<p>Ce projet a été réalisé pour TechSolutions Inc., une entreprise spécialisée dans les solutions technologiques innovantes. Notre équipe a travaillé en étroite collaboration avec le client pour comprendre ses besoins spécifiques et développer une solution sur mesure.</p>
               <p>Le projet a impliqué plusieurs phases, de la conception initiale à la mise en œuvre finale, en passant par des tests rigoureux pour garantir la qualité et la fiabilité de la solution.</p>
               <h3>Défis</h3>
               <ul>
                 <li>Intégration avec les systèmes existants</li>
                 <li>Optimisation des performances pour gérer de grands volumes de données</li>
                 <li>Création d'une interface utilisateur intuitive et responsive</li>
                 <li>Mise en œuvre de mesures de sécurité robustes</li>
               </ul>
               <h3>Solutions</h3>
               <p>Notre équipe a relevé ces défis en utilisant les technologies les plus récentes et les meilleures pratiques de l'industrie. Nous avons développé une architecture modulaire qui permet une intégration facile avec les systèmes existants tout en offrant des performances optimales.</p>
               <p>L'interface utilisateur a été conçue en suivant les principes de l'UX design, avec une attention particulière à l'accessibilité et à la facilité d'utilisation. Des tests d'utilisabilité ont été menés pour s'assurer que l'interface répond aux besoins des utilisateurs finaux.</p>
               <h3>Résultats</h3>
               <p>Le projet a été livré dans les délais et le budget prévus, et a dépassé les attentes du client. La solution a permis à TechSolutions Inc. d'améliorer son efficacité opérationnelle de 30% et de réduire les coûts de 25%.</p>
               <p>Le client a exprimé sa satisfaction quant à la qualité de notre travail et à notre approche professionnelle tout au long du projet.</p>`
              : `<p>This project was carried out for TechSolutions Inc., a company specializing in innovative technological solutions. Our team worked closely with the client to understand their specific needs and develop a customized solution.</p>
               <p>The project involved several phases, from initial design to final implementation, including rigorous testing to ensure the quality and reliability of the solution.</p>
               <h3>Challenges</h3>
               <ul>
                 <li>Integration with existing systems</li>
                 <li>Performance optimization to handle large volumes of data</li>
                 <li>Creation of an intuitive and responsive user interface</li>
                 <li>Implementation of robust security measures</li>
               </ul>
               <h3>Solutions</h3>
               <p>Our team addressed these challenges by using the latest technologies and industry best practices. We developed a modular architecture that allows for easy integration with existing systems while providing optimal performance.</p>
               <p>The user interface was designed following UX design principles, with particular attention to accessibility and ease of use. Usability tests were conducted to ensure that the interface meets the needs of end users.</p>
               <h3>Results</h3>
               <p>The project was delivered on time and within budget, and exceeded client expectations. The solution allowed TechSolutions Inc. to improve its operational efficiency by 30% and reduce costs by 25%.</p>
               <p>The client expressed satisfaction with the quality of our work and our professional approach throughout the project.</p>`,
        })
      } else {
        // Redirect to projects page if project not found
        router.push("/projects")
      }
    }
  }, [params.id, language, router])

  // Get related projects (same category)
  const getRelatedProjects = () => {
    if (!project) return []

    const currentProjects = projectsData[language]
    return currentProjects.filter((item) => item.id !== project.id && item.category === project.category).slice(0, 3)
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 to-navy/70 dark:from-navy/95 dark:to-navy/80 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/projects"
              className="inline-flex items-center text-white mb-6 hover:text-secondary transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "fr" ? "Retour aux Projets" : "Back to Projects"}
            </Link>

            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-secondary text-white text-sm font-medium px-3 py-1 rounded-full">
                {project.category}
              </span>
              <span className="text-gray-300 text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {project.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{project.title}</h1>

            <p className="text-xl text-gray-200 mb-8">{project.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="bg-gray-50 dark:bg-navy/50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">
                  {language === "fr" ? "Client" : "Client"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{project.client}</p>
              </div>
              <div className="bg-gray-50 dark:bg-navy/50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">
                  {language === "fr" ? "Catégorie" : "Category"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{project.category}</p>
              </div>
              <div className="bg-gray-50 dark:bg-navy/50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">
                  {language === "fr" ? "Durée" : "Duration"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{project.duration}</p>
              </div>
              <div className="bg-gray-50 dark:bg-navy/50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">
                  {language === "fr" ? "Équipe" : "Team"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{project.team}</p>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-navy dark:prose-headings:text-white prose-a:text-secondary"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 bg-gray-50 dark:bg-navy/80">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 gradient-text text-center">
            {language === "fr" ? "Projets Similaires" : "Related Projects"}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {getRelatedProjects().map((relatedProject, index) => (
              <motion.div
                key={relatedProject.id}
                className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden h-48">
                  <Image
                    src={relatedProject.image || "/placeholder.svg"}
                    alt={relatedProject.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                    <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full">
                      {relatedProject.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-navy dark:text-white">{relatedProject.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{relatedProject.description}</p>
                  <Link
                    href={`/projects/${relatedProject.id}`}
                    className="text-secondary hover:text-secondary-dark transition-colors duration-300 flex items-center group"
                  >
                    {language === "fr" ? "Voir les détails" : "View Details"}
                    <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

