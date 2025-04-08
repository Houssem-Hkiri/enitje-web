import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Test connection by fetching a count from news table
    const { data, error } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: {
        count: data?.length || 0,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }
      }
    })
  } catch (error: any) {
    console.error('Supabase connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    }, { status: 500 })
  }
} 