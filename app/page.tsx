import { Suspense } from "react"
import HomeClient from "./HomeClient"
import { createClient } from '@/app/lib/supabase-server'

// Loading component
function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#28384d] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-[#00adb5]/30 border-t-gray-600 dark:border-t-[#00adb5] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
          Loading ENIT Junior Entreprise...
        </p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const supabase = createClient()
  
  try {
    // Fetch latest projects and news for the homepage using server functions
    const { data: projects = [] } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    const { data: news = [] } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    return (
      <Suspense fallback={<HomeLoading />}>
        <HomeClient 
          initialProjects={projects} 
          initialNews={news}
          initialError={null}
        />
      </Suspense>
    )
  } catch (error: any) {
    console.error("Error fetching homepage data:", error)
    return (
      <Suspense fallback={<HomeLoading />}>
        <HomeClient 
          initialProjects={[]} 
          initialNews={[]}
          initialError={error.message}
        />
      </Suspense>
    )
  }
}

