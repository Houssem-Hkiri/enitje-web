import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import FinancialStatementsContent, { FinancialStatement } from "./FinancialStatementsContent"

// Loading component
function FinancialStatementsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy">
      <div className="container mx-auto px-4 pt-40 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function FinancialStatementsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Fetch financial statements from Supabase
    const { data: statements, error } = await supabase
      .from('financial_statements')
      .select('*')
      .order('year', { ascending: false })
    
    return (
      <Suspense fallback={<FinancialStatementsLoading />}>
        <FinancialStatementsContent 
          initialStatements={statements as FinancialStatement[] || []} 
          initialError={error ? error.message : null} 
        />
      </Suspense>
    )
  } catch (err: any) {
    return (
      <FinancialStatementsContent 
        initialStatements={[]} 
        initialError={err.message || "An error occurred while fetching financial statements"} 
      />
    )
  }
}

