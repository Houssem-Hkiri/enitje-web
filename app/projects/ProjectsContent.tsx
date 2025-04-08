"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Code, Users, ExternalLink } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useLanguage } from "../contexts/LanguageContext"
import { getThemePreference, setThemePreference } from "../utils/theme"
import type { Project } from "@/app/lib/supabase"

// ProjectCard component for displaying individual projects
const ProjectCard = ({ project, language }: { project: Project, language: string }) => {
  // Format date helper function
  const formatDate = (dateString: string, lang: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  return (
    <div className="bg-white dark:bg-[#28384d]/80 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100 dark:border-white/5">
      <div className="relative h-56 w-full">
        {project.image_url ? (
          <Image 
            src={project.image_url} 
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-100 dark:bg-[#00adb5]/20 h-full w-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-[#00adb5]">{language === 'fr' ? 'Pas d\'image' : 'No image'}</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-y-2 text-sm mb-4">
          {project.client && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 mr-4">
              <Users size={16} className="text-[#00adb5] mr-2" />
              <span>{project.client}</span>
            </div>
          )}
          
          {project.technologies && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 mr-4">
              <Code size={16} className="text-[#fccd11] mr-2" />
              <span>{project.technologies}</span>
            </div>
          )}
          
          {project.created_at && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar size={16} className="text-[#00adb5] mr-2" />
              <span>{formatDate(project.created_at, language)}</span>
            </div>
          )}
        </div>
        
        <Link 
          href={`/projects/${project.slug}`}
          className="inline-flex items-center px-4 py-2 bg-[#00adb5] text-white rounded-md hover:bg-[#00adb5]/90 transition-colors"
        >
          <span>{language === 'fr' ? 'Voir le projet' : 'View project'}</span>
          <ExternalLink size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

// For the empty projects state
const EmptyState = ({ language }: { language: string }) => (
  <div className="bg-gray-50 dark:bg-[#28384d]/80 p-8 rounded-lg text-center shadow-sm border border-gray-100 dark:border-white/5">
    <p className="text-gray-600 dark:text-white">
      {language === 'fr' 
        ? 'Aucun projet disponible pour le moment.' 
        : 'No projects available at this time.'}
    </p>
  </div>
);

// Main client component
export default function ProjectsContent({ 
  initialProjects, 
  initialError 
}: { 
  initialProjects: Project[],
  initialError: string | null
}) {
  // Initialize state variables
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [error, setError] = useState<string | null>(initialError)
  const [darkMode, setDarkMode] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()

  // Extract unique categories from projects
  const categories = [...new Set(projects.map(project => project.category).filter(Boolean))] as string[];

  // Filter projects based on selected category
  const filteredProjects = selectedCategory 
    ? projects.filter(project => project.category === selectedCategory)
    : projects;

  useEffect(() => {
    // Initialize dark mode
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? 'dark' : 'light'
      setThemePreference(newTheme)
      return !prev
    })
  }

  const toggleLanguage = (lang?: "fr" | "en") => {
    setLanguage(lang || (language === "fr" ? "en" : "fr"))
  }

  // Display debug info if there's an error
  const DebugInfo = () => (
    <div className="bg-gray-50 dark:bg-[#28384d]/40 p-4 rounded-lg border border-gray-200 dark:border-white/10 my-4 text-sm max-w-xl mx-auto">
      <h3 className="font-semibold mb-2">Debug Information</h3>
      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
        <li>Environment: <span className="font-mono">{process.env.NODE_ENV}</span></li>
        <li>Supabase URL: <span className="font-mono">{process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</span></li>
        <li>Supabase Key: <span className="font-mono">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</span></li>
        <li><a href="/api/supabase-test" className="text-blue-500 hover:underline" target="_blank">Check API Connection</a></li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#28384d] transition-colors duration-300">
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
      />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-b from-white via-white/95 to-white/90 dark:from-[#28384d] dark:via-[#28384d]/95 dark:to-[#28384d]/90 pt-40 pb-16 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {language === "fr" ? "Nos Projets" : "Our Projects"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {language === "fr" 
                  ? "Découvrez les projets innovants réalisés par ENIT Junior Enterprise, témoignant de notre expertise et de notre engagement envers l'excellence."
                  : "Explore the innovative projects delivered by ENIT Junior Enterprise, showcasing our expertise and commitment to excellence."
                }
              </p>
              
              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                    ${!selectedCategory 
                      ? 'bg-[#00adb5] text-white' 
                      : 'bg-gray-100 dark:bg-[#28384d]/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#28384d]/80'
                    }`}
                >
                  {language === "fr" ? "Tous" : "All"}
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                      ${selectedCategory === category 
                        ? 'bg-[#00adb5] text-white' 
                        : 'bg-gray-100 dark:bg-[#28384d]/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#28384d]/80'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Display error if there is one */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-white p-4 rounded-lg max-w-xl mx-auto">
              <p>{error}</p>
            </div>
            <DebugInfo />
          </div>
        )}
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                language={language}
              />
            ))}
          </div>
        ) : (
          <EmptyState language={language} />
        )}
      </div>
      
      <Footer />
    </div>
  )
} 