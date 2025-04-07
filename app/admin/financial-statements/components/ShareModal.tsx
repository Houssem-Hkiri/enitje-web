"use client"

import { useState } from "react"
import { Link, Copy, X, Check, RotateCw, Clock, AlertCircle } from "lucide-react"

interface ShareModalProps {
  documentId: string
  documentTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ 
  documentId, 
  documentTitle, 
  isOpen, 
  onClose 
}: ShareModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secureUrl, setSecureUrl] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [expiration, setExpiration] = useState("4h") // Default expiration time
  
  if (!isOpen) return null
  
  const handleGenerateLink = async () => {
    setLoading(true)
    setError(null)
    setCopied(false)
    
    // Calculate expiration in seconds
    let expiresIn = 4 * 60 * 60 // 4 hours default
    
    if (expiration === "1h") expiresIn = 60 * 60
    if (expiration === "24h") expiresIn = 24 * 60 * 60
    if (expiration === "7d") expiresIn = 7 * 24 * 60 * 60
    if (expiration === "30d") expiresIn = 30 * 24 * 60 * 60
    
    try {
      const response = await fetch('/api/generate-financial-statement-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          expiresIn
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate link')
      }
      
      setSecureUrl(data.url)
      setExpiresAt(data.expiresAt)
    } catch (err: any) {
      console.error('Error generating secure link:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const copyToClipboard = async () => {
    if (!secureUrl) return
    
    try {
      await navigator.clipboard.writeText(secureUrl)
      setCopied(true)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      setError('Failed to copy link to clipboard')
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-navy-light rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            Share Financial Statement
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Generate a secure, time-limited link to share the document: <span className="font-semibold">{documentTitle}</span>
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Link Expiration</label>
            <select
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-navy dark:border-gray-700"
            >
              <option value="1h">1 hour</option>
              <option value="4h">4 hours</option>
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {!secureUrl ? (
            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Generate Secure Link
                </>
              )}
            </button>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Secure Link</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={secureUrl}
                    readOnly
                    className="w-full px-3 py-2 border rounded-l-md dark:bg-navy dark:border-gray-700 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-gray-100 dark:bg-navy border border-l-0 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {expiresAt && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  Expires: {new Date(expiresAt).toLocaleString()}
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-navy transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleGenerateLink}
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
                >
                  Generate New Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 