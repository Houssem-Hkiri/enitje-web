"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Newspaper,
  FolderOpen,
  Image as ImageIcon,
  Loader,
  AlertCircle,
  BarChart3,
  Users,
  Mail,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react"
import { type StatsState, type RecentItem } from "../page"

interface AdminDashboardClientProps {
  initialStats: StatsState | null
  initialError?: string | null
}

export default function AdminDashboardClient({ 
  initialStats, 
  initialError = null 
}: AdminDashboardClientProps) {
  const [error, setError] = useState<string | null>(initialError)
  const [stats, setStats] = useState<StatsState | null>(initialStats)
  
  if (!stats && !error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
        <div className="ml-auto">
          <Link 
            href="/api/supabase-test" 
            className="text-sm underline hover:text-red-600 dark:hover:text-red-200"
            target="_blank"
          >
            Run Diagnostics
          </Link>
        </div>
      </div>
    )
  }

  const adminCards = [
    {
      title: "News",
      description: "Manage news articles and announcements",
      count: stats?.news,
      icon: Newspaper,
      href: "/admin/news",
      color: "bg-blue-500"
    },
    {
      title: "Projects",
      description: "Manage project portfolio",
      count: stats?.projects,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "bg-green-500"
    },
    {
      title: "Gallery",
      description: "Manage image gallery",
      count: stats?.gallery,
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "bg-purple-500"
    },
    {
      title: "Contacts",
      description: "View contact form submissions",
      count: stats?.contacts,
      icon: Mail,
      href: "/admin/contacts",
      color: "bg-red-500"
    },
    {
      title: "Financial Statements",
      description: "Manage financial documents",
      icon: FileText,
      href: "/admin/financial-statements",
      color: "bg-yellow-500"
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

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
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  
                  {typeof card.count === 'number' && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      <span>
                        {card.count} {card.count === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Latest content updates across the site</p>
        </div>
        
        {stats?.recentItems && stats.recentItems.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentItems.map((item: RecentItem) => (
              <div key={`${item.type}-${item.id}`} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {item.type === 'news' && <Newspaper className="w-5 h-5 text-blue-500" />}
                    {item.type === 'projects' && <FolderOpen className="w-5 h-5 text-green-500" />}
                    {item.type === 'contacts' && <Mail className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white">
                        {item.title}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    {item.category && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Category: <span className="font-medium">{item.category}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No recent activity found</p>
          </div>
        )}
      </div>

      {/* Server Status */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Server Status</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Backend connection status</p>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
            <span className="text-gray-500 dark:text-gray-400">News</span>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{stats?.news || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
            <span className="text-gray-500 dark:text-gray-400">Projects</span>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{stats?.projects || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
            <span className="text-gray-500 dark:text-gray-400">Gallery</span>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{stats?.gallery || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
            <span className="text-gray-500 dark:text-gray-400">Contacts</span>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{stats?.contacts || 0}</div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link 
            href="/api/supabase-test" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
          >
            Run Diagnostics
          </Link>
        </div>
      </div>
    </div>
  )
} 