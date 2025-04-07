"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  FileText, 
  Trash2, 
  Upload, 
  Plus, 
  Search,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  Download,
  X,
  Check
} from "lucide-react"

type FinancialStatement = {
  id: string
  year: string
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
  file_path?: string
  file_size?: number
  file_type?: string
  created_at: string
}

export default function FinancialStatementsAdminPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [statements, setStatements] = useState<FinancialStatement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>("year")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStatement, setNewStatement] = useState({
    year: new Date().getFullYear().toString(),
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    file: null as File | null
  })
  
  useEffect(() => {
    checkAuth()
    fetchFinancialStatements()
  }, [sortColumn, sortDirection])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/admin/login")
        return
      }
    } catch (err) {
      console.error("Auth check error:", err)
      setError("Authentication error. Please try again.")
    }
  }

  const fetchFinancialStatements = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('financial_statements')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' })
      
      const { data, error } = await query
      
      if (error) throw error
      
      setStatements(data || [])
      setError(null)
    } catch (err: any) {
      console.error("Error fetching financial statements:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewStatement({ ...newStatement, file: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setUploading(true)
      
      if (!newStatement.file) {
        throw new Error("Please select a PDF file to upload")
      }
      
      if (!newStatement.title_fr || !newStatement.title_en || 
          !newStatement.description_fr || !newStatement.description_en) {
        throw new Error("Please fill all required fields")
      }
      
      // Upload file to storage
      const fileExt = newStatement.file.name.split('.').pop()
      const fileName = `${newStatement.year}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${newStatement.year}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('financial_statements')
        .upload(filePath, newStatement.file)
      
      if (uploadError) throw uploadError
      
      // Add record to database
      const { error: insertError } = await supabase
        .from('financial_statements')
        .insert({
          year: newStatement.year,
          title_fr: newStatement.title_fr,
          title_en: newStatement.title_en,
          description_fr: newStatement.description_fr,
          description_en: newStatement.description_en,
          file_path: filePath,
          file_size: newStatement.file.size,
          file_type: newStatement.file.type
        })
      
      if (insertError) throw insertError
      
      // Reset form and refresh data
      setNewStatement({
        year: new Date().getFullYear().toString(),
        title_fr: "",
        title_en: "",
        description_fr: "",
        description_en: "",
        file: null
      })
      setShowAddForm(false)
      fetchFinancialStatements()
      
    } catch (err: any) {
      console.error("Error adding financial statement:", err)
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }
  
  const handleDelete = async (id: string, filePath?: string) => {
    if (!confirm("Are you sure you want to delete this financial statement?")) {
      return
    }
    
    try {
      setLoading(true)
      
      // Delete file from storage if it exists
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('financial_statements')
          .remove([filePath])
        
        if (storageError) throw storageError
      }
      
      // Delete record from database
      const { error: deleteError } = await supabase
        .from('financial_statements')
        .delete()
        .match({ id })
      
      if (deleteError) throw deleteError
      
      // Refresh data
      fetchFinancialStatements()
      
    } catch (err: any) {
      console.error("Error deleting financial statement:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Filter statements by search term
  const filteredStatements = statements.filter(statement => 
    statement.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.year.includes(searchTerm)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Financial Statements Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
        >
          {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showAddForm ? "Cancel" : "Add New Statement"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-navy-light rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Financial Statement</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="text"
                  value={newStatement.year}
                  onChange={(e) => setNewStatement({ ...newStatement, year: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-navy-light dark:border-navy"
                  placeholder="2023"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-navy-light dark:border-navy"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title (French)</label>
                <input
                  type="text"
                  value={newStatement.title_fr}
                  onChange={(e) => setNewStatement({ ...newStatement, title_fr: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-navy-light dark:border-navy"
                  placeholder="Rapport Financier Annuel 2023"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title (English)</label>
                <input
                  type="text"
                  value={newStatement.title_en}
                  onChange={(e) => setNewStatement({ ...newStatement, title_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-navy-light dark:border-navy"
                  placeholder="Annual Financial Report 2023"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description (French)</label>
                <textarea
                  value={newStatement.description_fr}
                  onChange={(e) => setNewStatement({ ...newStatement, description_fr: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-navy-light dark:border-navy"
                  placeholder="États financiers audités et rapport annuel pour l'année fiscale 2023."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description (English)</label>
                <textarea
                  value={newStatement.description_en}
                  onChange={(e) => setNewStatement({ ...newStatement, description_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-navy-light dark:border-navy"
                  placeholder="Audited financial statements and annual report for the 2023 fiscal year."
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 mr-2 border rounded-md hover:bg-gray-100 dark:hover:bg-navy transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Statement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search statements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-64 dark:bg-navy-light dark:border-navy"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="text-sm text-gray-500">
          {filteredStatements.length} statement{filteredStatements.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="bg-white dark:bg-navy-light rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy border-b">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('year')}
                >
                  <div className="flex items-center">
                    Year
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title (FR/EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  File
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Added
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-navy">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredStatements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No financial statements found
                  </td>
                </tr>
              ) : (
                filteredStatements.map((statement) => (
                  <tr key={statement.id} className="hover:bg-gray-50 dark:hover:bg-navy-light">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
                        <Calendar className="h-4 w-4 mr-1" />
                        {statement.year}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {statement.title_fr}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {statement.title_en}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {statement.description_fr}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {statement.file_path ? (
                        <a
                          href={`/api/admin/download-financial-statement?id=${statement.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-secondary hover:text-secondary-dark"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View PDF
                        </a>
                      ) : (
                        <span className="text-red-500">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(statement.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(statement.id, statement.file_path)}
                        className="inline-flex items-center text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 