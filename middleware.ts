import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    // Create a response object that we can modify
    const res = NextResponse.next()

    // Create the Supabase client
    const supabase = createMiddlewareClient({ req, res })

    // Refresh the session - this is required for the middleware to work
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Get the current URL pathname
    const path = req.nextUrl.pathname

    // If trying to access admin pages without a session, redirect to login
    if (path.startsWith("/admin") && path !== "/admin/login" && !session) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // If trying to access login page with a session, redirect to admin
    if (path === "/admin/login" && session) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Special handling for image requests
    if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      // For image requests, don't add the security headers that might block them
      const imageRes = NextResponse.next()
      
      // Allow images from Supabase storage
      if (req.headers.get('referer')?.includes('supabase.co')) {
        imageRes.headers.set('Access-Control-Allow-Origin', '*')
      }
      
      return imageRes
    }

    // Add security and performance headers for non-image requests
    res.headers.set('X-DNS-Prefetch-Control', 'on')
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    res.headers.set('X-XSS-Protection', '1; mode=block')
    res.headers.set('X-Frame-Options', 'SAMEORIGIN')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    
    // Add Content-Security-Policy header in production with less restrictive settings
    if (process.env.NODE_ENV === 'production') {
      res.headers.set(
        'Content-Security-Policy',
        "default-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://*.supabase.co https://*.supabase.in; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://*.supabase.in;"
      )
    }

    // Add Permissions-Policy
    res.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
    )

    // Add required CORS headers
    const origin = req.headers.get('origin') || '*'
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    )

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: res.headers
      })
    }

    // For all other cases, continue with the request
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error checking the session, redirect to login for safety
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    
    // For non-admin routes, continue with security headers on error
    const res = NextResponse.next()
    
    // Add security headers even when there's an error
    res.headers.set('X-DNS-Prefetch-Control', 'on')
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    res.headers.set('X-XSS-Protection', '1; mode=block')
    res.headers.set('X-Frame-Options', 'SAMEORIGIN')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
} 