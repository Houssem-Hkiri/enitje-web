import { createClient } from '@/lib/supabase-server'
import { Suspense } from 'react'
import AdminDashboardClient from './components/AdminDashboardClient'

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
  const supabase = createClient()
  
  // Fetch counts for each table
  const [newsCount, projectsCount, galleryCount, contactsCount] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('gallery').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true })
  ])

  // Fetch recent items
  const [recentNews, recentProjects, recentContacts] = await Promise.all([
    supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(3)
  ])

  // Combine and sort recent items
  const recentItems = [
    ...(recentNews.data?.map(item => ({ ...item, type: 'news' })) || []),
    ...(recentProjects.data?.map(item => ({ ...item, type: 'project' })) || []),
    ...(recentContacts.data?.map(item => ({ ...item, type: 'contact' })) || [])
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const stats = {
    news: newsCount.count || 0,
    projects: projectsCount.count || 0,
    gallery: galleryCount.count || 0,
    contacts: contactsCount.count || 0,
    recentItems
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardClient initialStats={stats} />
    </Suspense>
  )
}

