"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Calendar, Users, Code, Briefcase, Tag, Clock, ExternalLink } from "lucide-react"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { getThemePreference, setThemePreference } from '../../utils/theme'
import { useLanguage } from "../../contexts/LanguageContext"
import type { Project } from "@/app/lib/supabase"

export default function ProjectDetailPageClient({ slug }: { slug: string }) {
  const [darkMode, setDarkMode] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const supabase = createClientComponentClient()

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

  // Fetch project based on slug
  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        console.log("Fetching project with slug:", slug);
        
        // First try to get by slug
        let { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (projectError) {
          console.log("Error fetching by slug:", projectError);
          
          // Only try by ID if the slug looks like a UUID or number
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const numericPattern = /^\d+$/;
          
          if (uuidPattern.test(slug) || numericPattern.test(slug)) {
            console.log("Slug appears to be a ID, trying as ID");
            
            // If it's a valid UUID or number format, try fetching by ID
            const { data: idData, error: idError } = await supabase
              .from("projects")
              .select("*")
              .eq("id", slug)
              .single();
            
            if (idError) {
              console.error("Error fetching by ID:", idError);
              throw new Error(language === "fr" 
                ? "Projet non trouvé. Vérifiez l'URL et réessayez." 
                : "Project not found. Please check the URL and try again.");
            }
            
            projectData = idData;
          } else {
            // Not a UUID/number and slug lookup failed
            throw new Error(language === "fr" 
              ? "Projet non trouvé. L'URL spécifiée n'est pas valide." 
              : "Project not found. The specified URL is not valid.");
          }
        }
        
        // Set the project data
        setProject(projectData);
        
        // Get related projects (same category but different project)
        try {
          const { data: relatedData, error: relatedError } = await supabase
            .from("projects")
            .select("*")
            .eq("category", projectData.category)
            .not("id", "eq", projectData.id)
            .limit(3);
          
          if (relatedError) {
            console.error("Error fetching related projects:", relatedError);
            setRelatedProjects([]);
          } else {
            setRelatedProjects(relatedData || []);
          }
        } catch (relatedErr) {
          console.error("Error in related projects fetch:", relatedErr);
          setRelatedProjects([]);
        }
      } catch (err: any) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, supabase, language]);

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
    (typeof project.technologies === 'string' ? project.technologies.split(',') : project.technologies) : 
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
      
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Navigation and breadcrumbs */}
          <div className="mb-8">
            <Link 
              href="/projects"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-white/80 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === "fr" ? "Retour aux projets" : "Back to projects"}
            </Link>
          </div>
          
          {/* Main content area with project details */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Project content - takes up more space */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-[#28384d]/80 p-6 md:p-8 rounded-lg shadow-lg border border-gray-100 dark:border-white/5">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {language === 'fr' ? 'Description du projet' : 'Project Description'}
                </h2>
                <div className="prose prose-lg max-w-none dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-200 space-y-6 whitespace-pre-line">
                  {project.description}
                </div>
                
                {/* Additional content sections */}
                {technologies.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      {language === 'fr' ? 'Technologies utilisées' : 'Technologies Used'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 dark:bg-[#28384d]/50 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Related projects section */}
              {relatedProjects.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    {language === 'fr' ? 'Projets similaires' : 'Related Projects'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedProjects.map(relatedProject => (
                      <Link 
                        key={relatedProject.id}
                        href={`/projects/${relatedProject.slug}`}
                        className="bg-white dark:bg-[#28384d]/50 rounded-lg p-4 shadow-md border border-gray-100 dark:border-white/5 hover:shadow-lg transition-shadow group"
                      >
                        <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                          {relatedProject.image_url ? (
                            <Image 
                              src={relatedProject.image_url} 
                              alt={relatedProject.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-[#28384d]">
                              <Briefcase size={32} className="text-gray-400 dark:text-gray-600" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-[#00adb5] dark:group-hover:text-[#00adb5] transition-colors">
                          {relatedProject.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {relatedProject.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Project metadata sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#28384d]/80 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-white/5 sticky top-32">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {language === "fr" ? "Détails du projet" : "Project Details"}
                </h3>
                
                <div className="space-y-4">
                  {project.client && (
                    <div className="flex items-start">
                      <Users size={18} className="text-[#00adb5] mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {language === "fr" ? "Client" : "Client"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.client}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {project.category && (
                    <div className="flex items-start">
                      <Tag size={18} className="text-[#fccd11] mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {language === "fr" ? "Catégorie" : "Category"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.category}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {project.created_at && (
                    <div className="flex items-start">
                      <Calendar size={18} className="text-[#00adb5] mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {language === "fr" ? "Date" : "Date"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(project.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Link 
                      href="/projects"
                      className="inline-flex items-center text-[#00adb5] hover:text-[#00adb5]/80 transition-colors text-sm font-medium"
                    >
                      {language === "fr" ? "Voir tous les projets" : "View all projects"}
                      <ArrowLeft size={14} className="ml-2 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 