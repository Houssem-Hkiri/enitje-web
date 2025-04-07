"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Clock, Shield, UserX, UserCheck, Search, RefreshCw } from "lucide-react"

interface AccessRequest {
  id: string
  user_id: string
  name: string
  email: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AccessRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()
  
  // Check if user is a super admin
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/admin/login')
          return
        }
        
        const role = user.user_metadata?.role
        
        if (role !== 'super_admin') {
          // Redirect non-super-admins
          router.push('/admin')
          return
        }
        
        setCurrentUserRole(role)
        
        // If user is a super_admin, fetch access requests
        fetchRequests()
      } catch (err) {
        console.error("Error checking user role:", err)
        setError("Failed to verify permissions")
        setLoading(false)
      }
    }
    
    checkUserRole()
  }, [router, supabase])
  
  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('admin_access_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setRequests(data || [])
    } catch (err: any) {
      console.error("Error fetching access requests:", err)
      setError(err.message || "Failed to load access requests")
    } finally {
      setLoading(false)
    }
  }
  
  const updateRequestStatus = async (requestId: string, userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setProcessing(requestId)
      setSuccessMessage(null)
      
      // 1. Update the request status
      const { error: requestError } = await supabase
        .from('admin_access_requests')
        .update({ status: newStatus })
        .eq('id', requestId)
      
      if (requestError) throw requestError
      
      // 2. If approved, update the user's role in their metadata
      if (newStatus === 'approved') {
        const { error: userError } = await supabase.auth.admin.updateUserById(
          userId,
          { user_metadata: { role: 'admin' } }
        )
        
        if (userError) throw userError
      }
      
      // Show success message
      setSuccessMessage(`User ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`)
      
      // Refresh the list
      fetchRequests()
    } catch (err: any) {
      console.error(`Error ${newStatus === 'approved' ? 'approving' : 'rejecting'} user:`, err)
      setError(err.message || `Failed to ${newStatus} user`)
    } finally {
      setProcessing(null)
      
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    }
  }
  
  const filteredRequests = requests.filter(request => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      request.name.toLowerCase().includes(query) ||
      request.email.toLowerCase().includes(query) ||
      request.reason.toLowerCase().includes(query) ||
      request.status.toLowerCase().includes(query)
    )
  })
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00adb5]"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage user requests for admin dashboard access
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#00adb5] focus:border-[#00adb5] sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={fetchRequests}
            className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {/* Super admin badge */}
      <div className="mb-6 flex items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
        <Shield className="h-5 w-5 mr-2" />
        <p className="text-sm">
          You are logged in as a <span className="font-semibold">Super Admin</span>. You can approve or reject access requests.
        </p>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-md shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gray-100 p-3">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Requests Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery ? 'No requests match your search criteria.' : 'There are no pending access requests at this time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{request.name}</span>
                        <span className="text-sm text-gray-500">{request.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                        {request.reason}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'approved' ? 'Approved' : 
                         request.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateRequestStatus(request.id, request.user_id, 'approved')}
                            disabled={processing === request.id}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            {processing === request.id ? (
                              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                              <UserCheck className="h-3.5 w-3.5 mr-1" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => updateRequestStatus(request.id, request.user_id, 'rejected')}
                            disabled={processing === request.id}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            {processing === request.id ? (
                              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                              <UserX className="h-3.5 w-3.5 mr-1" />
                            )}
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <span className="text-gray-500">
                          {request.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        {filteredRequests.length > 0 && `Total: ${filteredRequests.length} request(s)`}
      </div>
    </div>
  )
} 