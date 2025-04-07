import { Suspense } from 'react'
import type { NewsArticle as BaseNewsArticle } from "@/app/lib/supabase"
import NewsDetailPageClient from './NewsDetailPageClient'

// Extend the imported NewsArticle type with the tags property
export type NewsArticle = BaseNewsArticle & {
  tags?: string[]
}

// This is the server component that will unwrap params before passing to client component
export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  return <NewsDetailPageClient slug={params.slug} />;
}

// Loading UI component
function LoadingUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#28384d] transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin"></div>
    </div>
  );
}