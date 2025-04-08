import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import AdminDashboardClient from "./components/AdminDashboardClient"

export interface RecentItem {
  id: string
  title: string
  category: string
  created_at: string
  type: string
}

export interface StatsState {
  news: number
  projects: number
  gallery: number
  contacts: number
  recentItems: RecentItem[]
}

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Fetch counts for each content type
    const [newsResult, projectsResult, galleryResult, contactsResult] = await Promise.all([
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true })
    ])
    
    // Fetch recent items (5 most recent across all content types)
    const recentNews = await supabase
      .from('news')
      .select('id, title, category, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
    
    const recentProjects = await supabase
      .from('projects')
      .select('id, title, category, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
    
    const recentContacts = await supabase
      .from('contacts')
      .select('id, name, subject, category, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
    
    // Combine and sort recent items
    const recentItems = [
      ...(recentNews.data || []).map(item => ({ ...item, type: 'news' })),
      ...(recentProjects.data || []).map(item => ({ ...item, type: 'projects' })),
      ...(recentContacts.data || []).map(item => ({ 
        ...item, 
        title: item.name,
        type: 'contacts' 
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
    
    const stats = {
      news: newsResult.count || 0,
      projects: projectsResult.count || 0,
      gallery: galleryResult.count || 0,
      contacts: contactsResult.count || 0,
      recentItems
    }
    
    return <AdminDashboardClient initialStats={stats} initialError={null} />
    
  } catch (error: any) {
    console.error("Error fetching admin dashboard data:", error)
    return <AdminDashboardClient initialStats={null} initialError={error.message} />
  }
}

