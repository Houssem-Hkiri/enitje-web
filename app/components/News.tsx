"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import type { NewsArticle } from "@/app/lib/supabase"

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)
      
      if (error) throw error
      setNews(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
        {error}
      </div>
    )
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#1a2435]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#28384d] dark:text-white">
          Latest News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-[#28384d] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-48">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 bg-[#00adb5] text-white text-xs font-medium rounded">
                    {article.category || 'News'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#28384d] dark:text-white group-hover:text-[#00adb5] dark:group-hover:text-[#00adb5] transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {article.excerpt ? stripHtmlTags(article.excerpt) : createExcerpt(article.content)}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {article.publication_date ? 
                      new Date(article.publication_date).toLocaleDateString() : 
                      new Date(article.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href={`/news/${article.slug && article.slug.trim() !== '' ? article.slug : article.id}`}
                    className="text-[#28384d] dark:text-[#00adb5] hover:text-[#00adb5] dark:hover:text-[#fccd11] font-medium transition-colors"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
} 