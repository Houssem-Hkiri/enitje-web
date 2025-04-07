"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import {
  Newspaper,
  FolderOpen,
  Image as ImageIcon,
  Loader,
  AlertCircle,
  BarChart3,
  Users,
  Mail
} from "lucide-react"

interface RecentItem {
  id: string
  title: string
  category: string
  created_at: string
  type: string
}

interface StatsState {
  news: number
  projects: number
  gallery: number
  contacts: number
  recentItems: RecentItem[]
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsState>({
    news: 0,
    projects: 0,
    gallery: 0,
    contacts: 0,
    recentItems: []
  })
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
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
      
      setStats({
        news: newsResult.count || 0,
        projects: projectsResult.count || 0,
        gallery: galleryResult.count || 0,
        contacts: contactsResult.count || 0,
        recentItems
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    )
  }

  const adminCards = [
    {
      title: "News",
      description: "Manage news articles and announcements",
      count: stats.news,
      icon: Newspaper,
      href: "/admin/news",
      color: "bg-blue-500"
    },
    {
      title: "Projects",
      description: "Manage project portfolio",
      count: stats.projects,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "bg-green-500"
    },
    {
      title: "Gallery",
      description: "Manage image gallery",
      count: stats.gallery,
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "bg-purple-500"
    },
    {
      title: "Contacts",
      description: "View contact form submissions",
      count: stats.contacts,
      icon: Mail,
      href: "/admin/contacts",
      color: "bg-red-500"
    },
    {
      title: "Analytics",
      description: "View site statistics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-orange-500"
    },
    {
      title: "Users",
      description: "Manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "bg-indigo-500"
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the admin dashboard. Manage your site content and settings from here.
        </p>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {adminCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="block group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                <div className={`${card.color} h-2`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${card.color} bg-opacity-20 p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h3>
                      {card.count !== undefined && (
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {card.count} entries
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {stats.recentItems.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentItems.map((item: any) => (
              <div key={`${item.type}-${item.id}`} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/${item.type}#${item.id}`}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        )}
      </div>
    </div>
  )
}

