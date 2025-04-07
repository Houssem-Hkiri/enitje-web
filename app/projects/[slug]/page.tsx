import { Metadata } from 'next'
import { Suspense } from 'react'
import type { Project } from "@/app/lib/supabase"
import ProjectDetailPageClient from './ProjectDetailPageClient'

type Props = {
  params: {
    slug: string
  }
}

export const generateMetadata = ({ params }: Props): Metadata => {
  return {
    title: `Project - ${params.slug} | ENIT Junior Entreprise`,
    description: 'Découvrez nos projets récents',
  }
}

// This is the server component that will unwrap params before passing to client component
export default function ProjectDetailPage({ params }: Props) {
  // Extract the slug from params at the server level
  const slug = params.slug;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectDetailPageClient slug={slug} />
    </Suspense>
  );
}

// Loading UI component
function LoadingUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#28384d] transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin"></div>
    </div>
  );
} 