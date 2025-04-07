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
    
    // Get current date for filename
    const date = new Date()
    const formattedDate = date.toISOString().slice(0, 10)
    
    // Sample analytics data - In production, this would be fetched from Vercel Analytics API
    // or from your own analytics database
    const analyticsData = [
      {
        date: new Date(date.setDate(date.getDate() - 30)).toISOString().slice(0, 10),
        visitors: 22,
        pageViews: 78,
        bounceRate: '48%'
      },
      {
        date: new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10),
        visitors: 25,
        pageViews: 92,
        bounceRate: '46%'
      },
      // Fill in data for each day
      ...Array.from({ length: 28 }, (_, i) => ({
        date: new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10),
        visitors: Math.floor(Math.random() * 30) + 15,
        pageViews: Math.floor(Math.random() * 100) + 50,
        bounceRate: `${Math.floor(Math.random() * 15) + 35}%`
      }))
    ]
    
    // Format the data for CSV
    const csvRows = [
      ['Date', 'Visitors', 'Page Views', 'Bounce Rate'],
      ...analyticsData.map(day => [
        day.date,
        day.visitors.toString(),
        day.pageViews.toString(),
        day.bounceRate
      ])
    ]
    
    const csvContent = csvRows
      .map(row => row.join(','))
      .join('\n')
    
    // Set headers for CSV download
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv')
    headers.set('Content-Disposition', `attachment; filename="analytics-export-${formattedDate}.csv"`)
    
    return new NextResponse(csvContent, { 
      status: 200,
      headers
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 