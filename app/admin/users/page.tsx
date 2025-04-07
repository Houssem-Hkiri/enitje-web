"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { AlertCircle, Construction, ShieldAlert } from "lucide-react"

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/login")
          return
        }
        
        // Only proceed after confirming the user is logged in
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router, supabase])

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border border-gray-200 dark:border-gray-700 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full">
            <Construction className="h-12 w-12 text-amber-600 dark:text-amber-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Management (Coming Soon)</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          The user management module is currently under development. Soon you'll be able to manage users, roles, and permissions.
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 max-w-lg mx-auto">
          <div className="flex items-start">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Currently, user management requires direct database access. Please contact your system administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 