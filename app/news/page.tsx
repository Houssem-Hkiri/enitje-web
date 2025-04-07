import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import NewsContent from "./NewsContent"

// Main server component
export default async function NewsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  // Fetch news articles server-side
  const { data: newsArticles, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin"></div>
    </div>}>
      <NewsContent 
        initialNewsArticles={newsArticles || []} 
        initialError={error ? error.message : null} 
      />
    </Suspense>
  )
}

