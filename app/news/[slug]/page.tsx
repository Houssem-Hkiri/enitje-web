import { Suspense } from 'react'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Metadata } from 'next'
import type { NewsArticle as BaseNewsArticle } from "@/app/lib/supabase"
import NewsDetailPageClient from './NewsDetailPageClient'

// Extend the imported NewsArticle type with the tags property
export type NewsArticle = BaseNewsArticle & {
  tags?: string[]
}

type Props = {
  params: {
    slug: string
  }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: article } = await supabase
      .from("news")
      .select("title, description, excerpt")
      .eq("slug", params.slug)
      .single()
    
    if (article) {
      return {
        title: `${article.title} | ENIT Junior Entreprise`,
        description: article.excerpt || article.description || 'Actualités de ENIT Junior Entreprise',
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }
  
  return {
    title: `News - ${params.slug} | ENIT Junior Entreprise`,
    description: 'Actualités de ENIT Junior Entreprise',
  }
}

// Loading UI component
function LoadingUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#28384d] transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin"></div>
    </div>
  );
}

// This is the server component that will fetch data and pass it to the client component
export default async function NewsDetailPage({ params }: Props) {
  const slug = params.slug;
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Fetch article data
    const { data: article, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (error) {
      throw new Error(error.message)
    }
    
    // Fetch related articles (same category but different article)
    const { data: relatedArticles } = await supabase
      .from("news")
      .select("*")
      .eq("category", article.category)
      .not("id", "eq", article.id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    return (
      <Suspense fallback={<LoadingUI />}>
        <NewsDetailPageClient 
          initialArticle={article as NewsArticle} 
          initialRelatedArticles={relatedArticles as NewsArticle[] || []}
          initialError={null} 
        />
      </Suspense>
    );
  } catch (err: any) {
    console.error("Error fetching article:", err);
    return (
      <NewsDetailPageClient 
        initialArticle={null} 
        initialRelatedArticles={[]}
        initialError={err.message || "Error fetching article"} 
      />
    );
  }
}