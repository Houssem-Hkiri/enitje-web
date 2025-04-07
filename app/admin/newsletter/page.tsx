"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Download, RefreshCw, ChevronDown, ChevronUp, FileDown, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  status: string
}

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  const supabase = createClientComponentClient()
  
  const fetchSubscribers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: sortDirection === 'asc' })
      
      if (error) {
        throw error
      }
      
      setSubscribers(data || [])
      setSelectedSubscribers([])
      setSelectAll(false)
    } catch (err: any) {
      console.error('Error fetching subscribers:', err)
      setError(err.message || 'Une erreur est survenue lors du chargement des abonnés')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSubscribers()
  }, [sortDirection])
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
  }
  
  const exportToCSV = () => {
    if (subscribers.length === 0) return
    
    // Filter subscribers if there are selected ones
    const subscribersToExport = selectedSubscribers.length > 0 
      ? subscribers.filter(sub => selectedSubscribers.includes(sub.id))
      : subscribers
    
    // Format the data for CSV
    const csvContent = [
      ['Email', 'Date d\'inscription', 'Statut'], // Headers
      ...subscribersToExport.map(sub => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleString('fr-FR'),
        sub.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n')
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', `abonnes-newsletter-${new Date().toISOString().slice(0,10)}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(subscribers.map(sub => sub.id))
    }
    setSelectAll(!selectAll)
  }
  
  const handleSelectSubscriber = (id: string) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(prev => prev.filter(subId => subId !== id))
    } else {
      setSelectedSubscribers(prev => [...prev, id])
    }
  }
  
  const handleBulkStatusChange = async (newStatus: 'active' | 'inactive') => {
    if (selectedSubscribers.length === 0) return
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: newStatus })
        .in('id', selectedSubscribers)
      
      if (error) throw error
      
      fetchSubscribers()
    } catch (err: any) {
      console.error('Error updating subscribers:', err)
      setError(err.message || 'Une erreur est survenue lors de la mise à jour des abonnés')
    }
  }
  
  const handleDeleteSelected = async () => {
    if (selectedSubscribers.length === 0) return
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedSubscribers.length} abonné(s) ?`)) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('id', selectedSubscribers)
      
      if (error) throw error
      
      fetchSubscribers()
    } catch (err: any) {
      console.error('Error deleting subscribers:', err)
      setError(err.message || 'Une erreur est survenue lors de la suppression des abonnés')
    }
  }
  
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Abonnés à la Newsletter</h1>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleSortDirection}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            {sortDirection === 'desc' ? (
              <>
                Plus récents d'abord
                <ChevronDown className="h-4 w-4" />
              </>
            ) : (
              <>
                Plus anciens d'abord
                <ChevronUp className="h-4 w-4" />
              </>
            )}
          </button>
          
          <button
            onClick={fetchSubscribers}
            className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            title="Rafraîchir"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#00adb5] text-white rounded-md shadow-sm hover:bg-[#00adb5]/90 transition-colors"
            disabled={subscribers.length === 0 || loading}
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </button>
          
          <Link
            href="/api/admin/export-subscribers"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#28384d] text-white rounded-md shadow-sm hover:bg-[#28384d]/90 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Export complet
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {selectedSubscribers.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
          <div className="text-sm text-blue-700">
            {selectedSubscribers.length} abonné(s) sélectionné(s)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Activer
            </button>
            <button
              onClick={() => handleBulkStatusChange('inactive')}
              className="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Désactiver
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-[#00adb5] border-gray-300 rounded focus:ring-[#00adb5]"
                      disabled={loading || subscribers.length === 0}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun abonné trouvé
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={() => handleSelectSubscriber(subscriber.id)}
                          className="h-4 w-4 text-[#00adb5] border-gray-300 rounded focus:ring-[#00adb5]"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.subscribed_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {!loading && subscribers.length > 0 && `Total: ${subscribers.length} abonnés`}
      </div>
    </div>
  )
} 