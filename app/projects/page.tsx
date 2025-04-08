import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import ProjectsContent from "./ProjectsContent"
import { Project } from "@/app/lib/supabase"

// Loading component
function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#28384d]">
      <div className="container mx-auto px-4 pt-40 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8"></div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-96 animate-pulse">
              <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Fetch projects from Supabase
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    return (
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsContent 
          initialProjects={projects as Project[] || []} 
          initialError={error ? error.message : null} 
        />
      </Suspense>
    )
  } catch (err: any) {
    return (
      <ProjectsContent 
        initialProjects={[]} 
        initialError={err.message || "An error occurred while fetching projects"} 
      />
    )
  }
}

