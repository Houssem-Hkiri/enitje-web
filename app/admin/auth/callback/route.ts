import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Check the user's role after sign-in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user?.user_metadata?.role === 'pending') {
      // Redirect to a pending approval page
      return NextResponse.redirect(new URL('/admin/pending-approval', request.url))
    } else if (user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin') {
      // Redirect to admin dashboard for approved users
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      // Redirect to access request page for new users or users without roles
      return NextResponse.redirect(new URL('/admin/request-access', request.url))
    }
  }

  // If no code or error, redirect to login
  return NextResponse.redirect(new URL('/admin/login', request.url))
} 