import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Test connection
    const { data, error } = await supabase.from('news').select('count').single()

    if (error) {
      throw error
    }

    // Get environment details (safe to expose)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      DEPLOYMENT_URL: process.env.VERCEL_URL || 'Not deployed on Vercel',
      NEXTJS_VERSION: process.env.npm_package_dependencies_next || 'Unknown',
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      supabaseReachable: true,
      data,
      environment: envInfo,
    })
  } catch (error: any) {
    console.error('Supabase Test API Error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Supabase connection failed',
      supabaseReachable: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_ANON_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        DEPLOYMENT_URL: process.env.VERCEL_URL || 'Not deployed on Vercel',
      }
    }, { status: 500 })
  }
} 