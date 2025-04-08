"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { setThemePreference, getThemePreference } from '../../utils/theme'
import { translateArticle, isHtmlContent } from "@/app/lib/translation"
import DOMPurify from 'isomorphic-dompurify'
import type { NewsArticle } from './page'

// Format date based on language
const formatDate = (dateString: string, language: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
};

interface NewsDetailPageClientProps {
  initialArticle: NewsArticle | null
  initialRelatedArticles: NewsArticle[]
  initialError: string | null
}

export default function NewsDetailPageClient({
  initialArticle, 
  initialRelatedArticles, 
  initialError
}: NewsDetailPageClientProps) {
  const [article, setArticle] = useState<NewsArticle | null>(initialArticle)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>(initialRelatedArticles)
  const [darkMode, setDarkMode] = useState(true)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    // Initialize theme on mount
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

  // Toggle dark mode function
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

  const sanitizeContent = (content: string) => {
    if (!content) return ''
    return DOMPurify.sanitize(content)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#28384d] transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#28384d] pt-32 pb-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-white p-4 rounded-lg max-w-xl mx-auto">
            <p>{error || (language === 'fr' ? 'Article introuvable' : 'Article not found')}</p>
            <Link 
              href="/news"
              className="mt-4 inline-flex items-center px-4 py-2 bg-[#00adb5] text-white rounded-md hover:bg-[#00adb5]/90 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === "fr" ? "Retour aux actualités" : "Back to news"}
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
        {article.image_url ? (
          <div className="relative w-full h-[60vh] max-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/50 dark:from-[#28384d]/95 dark:via-[#28384d]/80 dark:to-black/60 z-10 transition-colors duration-300"></div>
            <Image 
              src={article.image_url} 
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 z-20 flex items-end">
              <div className="container mx-auto px-4 sm:px-6 pb-16">
                <div className="max-w-4xl">
                  {article.category && (
                    <span className="inline-block px-3 py-1 bg-[#00adb5] text-white text-sm font-medium rounded-full mb-4">
                      {article.category}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-md">
                    {article.title}
                  </h1>
                  <div className="flex flex-wrap items-center text-gray-800 dark:text-white/90 gap-x-6 gap-y-2">
                    <div className="flex items-center">
                      <Calendar size={18} className="text-[#00adb5] mr-2" />
                      <span>
                        {article.publication_date 
                          ? formatDate(article.publication_date, language)
                          : formatDate(article.created_at, language)}
                      </span>
                    </div>
                    {article.author && (
                      <div className="flex items-center">
                        <User size={18} className="text-[#fccd11] mr-2" />
                        <span>
                          {article.author}
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
                {article.category && (
                  <span className="inline-block px-3 py-1 bg-[#00adb5] text-white text-sm font-medium rounded-full mb-4">
                    {article.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center text-gray-800 dark:text-white/90 gap-x-6 gap-y-2">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-[#00adb5] mr-2" />
                    <span>
                      {article.publication_date 
                        ? formatDate(article.publication_date, language)
                        : formatDate(article.created_at, language)}
                    </span>
                  </div>
                  {article.author && (
                    <div className="flex items-center">
                      <User size={18} className="text-[#fccd11] mr-2" />
                      <span>
                        {article.author}
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
              href="/news"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-white/80 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === "fr" ? "Retour aux actualités" : "Back to news"}
            </Link>
          </div>
          
          {/* Main content area with author sidebar for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article content - takes up more space */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-[#28384d]/80 p-6 md:p-8 rounded-lg shadow-lg border border-gray-100 dark:border-white/5">
                <style jsx>{`
                  :global(.article-content *) {
                    color: #28384d !important;
                    font-family: 'Montserrat', sans-serif !important;
                  }
                  :global(.article-content a) {
                    color: #00adb5 !important;
                    font-family: 'Montserrat', sans-serif !important;
                  }
                  :global(.article-content a:hover) {
                    color: #009099 !important;
                  }
                  :global(.dark .article-content *) {
                    color: white !important;
                    font-family: 'Montserrat', sans-serif !important;
                  }
                  :global(.dark .article-content a) {
                    color: #00adb5 !important;
                  }
                  :global(.dark .article-content a:hover) {
                    color: #009099 !important;
                  }
                `}</style>
                <div 
                  className="prose prose-lg max-w-none article-content font-['Montserrat'] dark:prose-invert prose-headings:text-[#28384d] dark:prose-headings:text-white prose-p:text-[#28384d] dark:prose-p:text-white prose-li:text-[#28384d] dark:prose-li:text-white prose-strong:text-[#28384d] dark:prose-strong:text-white prose-a:text-[#00adb5] hover:prose-a:text-[#00adb5]/80 prose-img:rounded-lg prose-img:mx-auto dark:text-white"
                  dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content || '') }}
                />
              </div>
            </div>
            
            {/* Author and metadata sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#28384d]/80 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-white/5 sticky top-32">
                {/* Author information */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                    {language === "fr" ? "Auteur" : "Author"}
                  </h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#00adb5] text-white rounded-full flex items-center justify-center mr-3">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{article.author || 'ENIT Junior Enterprise'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === "fr" ? "Membre de ENIT Junior Enterprise" : "Member of ENIT Junior Enterprise"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Publication details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                    {language === "fr" ? "Détails de publication" : "Publication details"}
                  </h3>
                  
                  <div className="flex items-start">
                    <Calendar size={18} className="text-[#00adb5] mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {language === "fr" ? "Date de publication" : "Publication date"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {article.publication_date 
                          ? formatDate(article.publication_date, language)
                          : formatDate(article.created_at, language)}
                      </p>
                    </div>
                  </div>
                  
                  {article.category && (
                    <div className="flex items-start">
                      <Tag size={18} className="text-[#fccd11] mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {language === "fr" ? "Catégorie" : "Category"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {article.category}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Link 
                      href="/news"
                      className="inline-flex items-center text-[#00adb5] hover:text-[#00adb5]/80 transition-colors text-sm font-medium"
                    >
                      {language === "fr" ? "Voir tous les articles" : "View all articles"}
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