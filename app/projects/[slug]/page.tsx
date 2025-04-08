import { Metadata } from 'next'
import { Suspense } from 'react'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Project } from "@/app/lib/supabase"
import ProjectDetailPageClient from './ProjectDetailPageClient'

type Props = {
  params: {
    slug: string
  }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: project } = await supabase
      .from("projects")
      .select("title, description")
      .eq("slug", params.slug)
      .single()
    
    if (project) {
      return {
        title: `${project.title} | ENIT Junior Entreprise`,
        description: project.description || 'Découvrez nos projets récents',
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }
  
  return {
    title: `Project - ${params.slug} | ENIT Junior Entreprise`,
    description: 'Découvrez nos projets récents',
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
export default async function ProjectDetailPage({ params }: Props) {
  // Extract the slug from params at the server level
  const slug = params.slug;
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // First try to get by slug
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (projectError) {
      // If slug lookup failed, try by ID if it looks like a UUID or number
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const numericPattern = /^\d+$/;
      
      if (uuidPattern.test(slug) || numericPattern.test(slug)) {
        const { data: idData, error: idError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", slug)
          .single();
        
        if (idError) {
          throw new Error("Project not found by ID");
        }
        
        // Get related projects
        const { data: relatedData } = await supabase
          .from("projects")
          .select("*")
          .eq("category", idData.category)
          .not("id", "eq", idData.id)
          .limit(3);
        
        return (
          <Suspense fallback={<LoadingUI />}>
            <ProjectDetailPageClient 
              initialProject={idData as Project} 
              initialRelatedProjects={relatedData as Project[] || []}
              initialError={null} 
            />
          </Suspense>
        );
      }
      
      // Not a UUID/number and slug lookup failed
      throw new Error("Project not found");
    }
    
    // Get related projects (same category but different project)
    const { data: relatedData } = await supabase
      .from("projects")
      .select("*")
      .eq("category", project.category)
      .not("id", "eq", project.id)
      .limit(3);
    
    return (
      <Suspense fallback={<LoadingUI />}>
        <ProjectDetailPageClient 
          initialProject={project as Project} 
          initialRelatedProjects={relatedData as Project[] || []}
          initialError={null} 
        />
      </Suspense>
    );
  } catch (err: any) {
    console.error("Error fetching project:", err);
    return (
      <ProjectDetailPageClient 
        initialProject={null} 
        initialRelatedProjects={[]}
        initialError={err.message || "Error fetching project"} 
      />
    );
  }
} 