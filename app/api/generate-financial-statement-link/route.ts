import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Token expiration time - default 4 hours in seconds
const DEFAULT_EXPIRATION = 4 * 60 * 60

export async function POST(request: NextRequest) {
  try {
    // Check if the request is authenticated (only authenticated users should generate links)
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse the request body
    const body = await request.json()
    const { documentId, expiresIn } = body
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }
    
    // Get the file path from the database
    const { data: statement, error: dbError } = await supabase
      .from('financial_statements')
      .select('file_path')
      .eq('id', documentId)
      .single()
    
    if (dbError || !statement || !statement.file_path) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    const filePath = statement.file_path
    
    // Calculate timestamp and expiration
    const timestamp = Math.floor(Date.now() / 1000)
    const expirationSeconds = expiresIn || DEFAULT_EXPIRATION
    const expiresAt = timestamp + expirationSeconds
    
    // Generate the token
    const token = createHash('sha256')
      .update(`${filePath}-${process.env.DOWNLOAD_SECRET_KEY || 'fallback-key'}-${timestamp}`)
      .digest('hex')
    
    // Log this token generation
    try {
      await supabase.from('document_share_logs').insert({
        document_id: documentId,
        document_type: 'financial_statement',
        shared_by: session.user.id,
        expires_at: new Date(expiresAt * 1000).toISOString(),
        created_at: new Date().toISOString()
      })
    } catch (logError) {
      console.error('Failed to log token generation:', logError)
      // Continue despite logging error
    }
    
    // Construct the secure URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const secureUrl = `${baseUrl}/api/download-financial-statement?path=${encodeURIComponent(filePath)}&token=${token}&ts=${timestamp}`
    
    return NextResponse.json({
      url: secureUrl,
      expiresAt: new Date(expiresAt * 1000).toISOString()
    })
  } catch (error) {
    console.error('Error generating secure link:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 