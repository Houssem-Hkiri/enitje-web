import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    // Initialize Supabase client with cookies for authentication
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify admin is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get all subscribers
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching subscribers:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Format the data for CSV
    const csvRows = [
      ['ID', 'Email', 'Date Inscription', 'Status'],
      ...data.map(sub => [
        sub.id,
        sub.email,
        new Date(sub.subscribed_at).toISOString(),
        sub.status
      ])
    ]
    
    const csvContent = csvRows
      .map(row => row.join(','))
      .join('\n')
    
    // Set headers for CSV download
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv')
    headers.set('Content-Disposition', `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0,10)}.csv"`)
    
    return new NextResponse(csvContent, { 
      status: 200,
      headers
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 