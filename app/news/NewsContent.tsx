"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Newspaper as NewspaperIcon } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useLanguage } from "../contexts/LanguageContext"
import { getThemePreference, setThemePreference } from "../utils/theme"
import type { NewsArticle } from "@/app/lib/supabase"

// NewsCard component for displaying individual news articles
const NewsCard = ({ article, language }: { article: NewsArticle, language: string }) => {
  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  // Helper function to strip HTML tags from content
  const stripHtmlTags = (html: string): string => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  // Helper function to create excerpt from content
  const createExcerpt = (content: string, length: number = 150): string => {
    const plainText = stripHtmlTags(content);
    return plainText.length > length ? 
      plainText.substring(0, length) + '...' : 
      plainText;
  };

  return (
    <Link 
      href={`/news/${article.slug}`}
      className="bg-white dark:bg-[#28384d]/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/20 group hover:transform hover:-translate-y-1 flex flex-col h-full"
    >
      {article.image_url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 bg-[#00adb5] text-white text-xs font-medium rounded-full">
                {article.category}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-sm text-gray-500 dark:text-white/60 mb-2">
          {formatDate(article.publication_date || article.created_at)}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#00adb5] transition-colors">
          {article.title}
        </h3>
        <div className="text-gray-600 dark:text-white/70 line-clamp-3 mb-4 flex-1">
          {article.excerpt || createExcerpt(article.content || '')}
        </div>
        <div className="flex items-center text-[#00adb5] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
          {language === 'fr' ? 'Lire la suite' : 'Read more'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

// For the empty news state
const EmptyState = ({ language, selectedCategory, resetCategory }: { 
  language: string, 
  selectedCategory: string | null,
  resetCategory: () => void 
}) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-6">
      <NewspaperIcon className="h-8 w-8 text-[#00adb5]" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
      {language === "fr" ? "Aucun article trouvé" : "No articles found"}
    </h3>
    <p className="text-gray-600 dark:text-white/70 max-w-md mx-auto">
      {language === "fr"
        ? "Aucun article n'a été trouvé pour cette catégorie. Veuillez essayer une autre catégorie."
        : "No articles were found for this category. Please try another category."}
    </p>
    {selectedCategory && (
      <button
        onClick={resetCategory}
        className="mt-6 px-4 py-2 bg-[#00adb5] text-white rounded-md hover:bg-[#00adb5]/90 transition-colors"
      >
        {language === "fr" ? "Voir tous les articles" : "View all articles"}
      </button>
    )}
  </div>
);

// Main client component
export default function NewsContent({ 
  initialNewsArticles, 
  initialError 
}: { 
  initialNewsArticles: NewsArticle[],
  initialError: string | null
}) {
  // Initialize state variables
  const [news, setNews] = useState<NewsArticle[]>(initialNewsArticles)
  const [error, setError] = useState<string | null>(initialError)
  const [darkMode, setDarkMode] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()

  // Extract unique categories from news articles
  const categories = [...new Set(news.map(article => article.category).filter(Boolean))] as string[];

  // Filter news based on selected category
  const filteredNews = selectedCategory 
    ? news.filter(article => article.category === selectedCategory)
    : news;

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

  const resetCategory = () => {
    setSelectedCategory(null)
  }

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
                {language === "fr" ? "Actualités" : "Latest News"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {language === "fr" 
                  ? "Restez informé des dernières actualités, événements et réalisations de ENIT Junior Enterprise."
                  : "Stay informed about the latest news, events, and achievements from ENIT Junior Enterprise."
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
        {/* News Articles Grid */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-white p-4 rounded-lg max-w-xl mx-auto">
            <p>{error}</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                language={language}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            language={language} 
            selectedCategory={selectedCategory}
            resetCategory={resetCategory}
          />
        )}
      </div>
      
      <Footer />
    </div>
  )
} 