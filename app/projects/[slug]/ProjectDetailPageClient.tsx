"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Users, Code, Briefcase, Tag, Clock, ExternalLink } from "lucide-react"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { getThemePreference, setThemePreference } from '../../utils/theme'
import { useLanguage } from "../../contexts/LanguageContext"
import type { Project } from "@/app/lib/supabase"

interface ProjectDetailPageClientProps {
  initialProject: Project | null
  initialRelatedProjects: Project[]
  initialError: string | null
}

export default function ProjectDetailPageClient({ 
  initialProject, 
  initialRelatedProjects, 
  initialError 
}: ProjectDetailPageClientProps) {
  const [darkMode, setDarkMode] = useState(true)
  const [project, setProject] = useState<Project | null>(initialProject)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>(initialRelatedProjects)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === 'dark')
    setThemePreference(theme)
  }, [])

  // Apply dark mode class to html element
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
      const newTheme = !prev ? 'dark' : 'light'
      setThemePreference(newTheme)
      return !prev
    })
  }

  // Set language
  const toggleLanguage = (lang?: "fr" | "en") => {
    setLanguage(lang || (language === "fr" ? "en" : "fr"))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#28384d] transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#28384d] pt-32 pb-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-white p-4 rounded-lg max-w-xl mx-auto">
            <p>{error || (language === 'fr' ? 'Projet introuvable' : 'Project not found')}</p>
            <Link 
              href="/projects"
              className="mt-4 inline-flex items-center px-4 py-2 bg-[#00adb5] text-white rounded-md hover:bg-[#00adb5]/90 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === "fr" ? "Retour aux projets" : "Back to projects"}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Parse technologies if they exist
  const technologies = project?.technologies ? 
    (typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()) : project.technologies) : 
    [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#28384d] text-gray-800 dark:text-white transition-colors duration-300">
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language} 
        toggleLanguage={toggleLanguage}
      />
      
      {/* Hero Section */}
      <div className="relative">
        {project.image_url ? (
          <div className="relative w-full h-[60vh] max-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-black/50 dark:from-[#28384d]/90 dark:via-[#28384d]/60 dark:to-black/60 z-10 transition-colors duration-300"></div>
            <Image 
              src={project.image_url} 
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 z-20 flex items-end">
              <div className="container mx-auto px-4 sm:px-6 pb-16">
                <div className="max-w-4xl">
                  {project.category && (
                    <span className="inline-block px-3 py-1 bg-[#00adb5] text-white text-sm font-medium rounded-full mb-4">
                      {project.category}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-md">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap items-center text-gray-800 dark:text-white/90 gap-x-6 gap-y-2">
                    {project.client && (
                      <div className="flex items-center">
                        <Users size={18} className="text-[#00adb5] mr-2" />
                        <span>
                          {language === "fr" ? "Client: " : "Client: "}{project.client}
                        </span>
                      </div>
                    )}
                    {project.created_at && (
                      <div className="flex items-center">
                        <Calendar size={18} className="text-[#fccd11] mr-2" />
                        <span>
                          {new Date(project.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-white via-white/95 to-white/90 dark:from-[#28384d] dark:via-[#28384d]/95 dark:to-[#28384d]/90 pt-40 pb-16 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-4xl">
                {project.category && (
                  <span className="inline-block px-3 py-1 bg-[#00adb5] text-white text-sm font-medium rounded-full mb-4">
                    {project.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center text-gray-800 dark:text-white/90 gap-x-6 gap-y-2">
                  {project.client && (
                    <div className="flex items-center">
                      <Users size={18} className="text-[#00adb5] mr-2" />
                      <span>
                        {language === "fr" ? "Client: " : "Client: "}{project.client}
                      </span>
                    </div>
                  )}
                  {project.created_at && (
                    <div className="flex items-center">
                      <Calendar size={18} className="text-[#fccd11] mr-2" />
                      <span>
                        {new Date(project.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Project Content */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            {project.content ? (
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            ) : (
              <p className="text-lg">
                {project.description}
              </p>
            )}
          </div>
          
          {/* Project Details */}
          {(project.technologies || project.client || project.category) && (
            <div className="bg-gray-50 dark:bg-[#28384d]/80 p-6 rounded-lg mb-12 border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold mb-6">
                {language === "fr" ? "Détails du projet" : "Project Details"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.client && (
                  <div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center">
                      <Briefcase size={16} className="mr-2" />
                      {language === "fr" ? "Client" : "Client"}
                    </h4>
                    <p className="text-gray-900 dark:text-white">{project.client}</p>
                  </div>
                )}
                
                {project.category && (
                  <div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center">
                      <Tag size={16} className="mr-2" />
                      {language === "fr" ? "Catégorie" : "Category"}
                    </h4>
                    <p className="text-gray-900 dark:text-white">{project.category}</p>
                  </div>
                )}
                
                {project.created_at && (
                  <div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center">
                      <Clock size={16} className="mr-2" />
                      {language === "fr" ? "Date" : "Date"}
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(project.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
                
                {technologies.length > 0 && (
                  <div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center">
                      <Code size={16} className="mr-2" />
                      {language === "fr" ? "Technologies" : "Technologies"}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-[#00adb5]/10 text-[#00adb5] text-sm rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Back Button */}
          <div className="mb-16">
            <Link 
              href="/projects"
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-[#00adb5] dark:hover:text-[#00adb5] transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === "fr" ? "Retour à tous les projets" : "Back to all projects"}
            </Link>
          </div>
          
          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {language === "fr" ? "Projets similaires" : "Related Projects"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((related) => (
                  <Link 
                    key={related.id} 
                    href={`/projects/${related.slug}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-[#28384d]/80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-white/5 h-full flex flex-col">
                      <div className="relative h-40">
                        {related.image_url ? (
                          <Image 
                            src={related.image_url} 
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="bg-gray-100 dark:bg-[#00adb5]/20 h-full w-full flex items-center justify-center">
                            <span className="text-gray-500 dark:text-[#00adb5]">
                              {language === 'fr' ? 'Pas d\'image' : 'No image'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#00adb5] dark:group-hover:text-[#00adb5] transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-1">
                          {related.description}
                        </p>
                        <span className="inline-flex items-center text-[#00adb5] text-sm font-medium">
                          {language === "fr" ? "Voir le projet" : "View project"}
                          <ExternalLink size={14} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 