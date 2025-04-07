import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Cache control duration (2 minutes)
const CACHE_DURATION = 120

// Token expiration time - 1 hour in seconds
const TOKEN_EXPIRATION = 3600

export async function GET(request: NextRequest) {
  try {
    // Get the parameters from the query
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')
    const filePath = searchParams.get('path')
    const token = searchParams.get('token')
    const timestamp = searchParams.get('ts')
    
    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    let documentPath: string | null = null
    let documentId: string | null = null;
    
    // Check for direct file access with tokenized validation
    if (token && filePath && timestamp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const requestTime = parseInt(timestamp, 10);
      
      // Validate that the timestamp isn't too old (prevent token reuse)
      if (isNaN(requestTime) || currentTime - requestTime > TOKEN_EXPIRATION) {
        return new NextResponse('Link expired', { status: 401 });
      }
      
      // Validate the token
      const expectedToken = createHash('sha256')
        .update(`${filePath}-${process.env.DOWNLOAD_SECRET_KEY || 'fallback-key'}-${timestamp}`)
        .digest('hex');
        
      if (token !== expectedToken) {
        console.warn(`Invalid token provided for file: ${filePath}`);
        return new NextResponse('Invalid or expired link', { status: 403 });
      }
      
      // Token is valid, set the document path
      documentPath = filePath;
      
      // Check if this path exists in our database as an additional security measure
      const { data: foundStatement } = await supabase
        .from('financial_statements')
        .select('id')
        .eq('file_path', filePath)
        .maybeSingle();
        
      if (foundStatement) {
        documentId = foundStatement.id;
      }
    }
    // Prioritize using the ID if available, which is more secure
    else if (fileId) {
      documentId = fileId;
      
      // Get the file path from the database using the ID
      const { data: statement, error: dbError } = await supabase
        .from('financial_statements')
        .select('file_path, year, title_fr')
        .eq('id', fileId)
        .single()
      
      if (dbError || !statement || !statement.file_path) {
        console.error('Document not found in database:', dbError || 'No record found')
        return new NextResponse('Document not found', { status: 404 })
      }
      
      documentPath = statement.file_path
      
      // Check if the request is coming from our own website to prevent hotlinking
      const referer = request.headers.get('referer');
      if (!referer || 
         (!referer.includes('localhost') && 
          !referer.includes('127.0.0.1') && 
          !referer.includes(process.env.NEXT_PUBLIC_SITE_URL || ''))) {
        console.warn(`Potential hotlinking detected: ${referer}`);
        // Instead of blocking, we'll log and continue for now
      }
      
      // Log access to this document for analytics
      try {
        await supabase.from('document_access_logs').insert({
          document_id: fileId,
          document_type: 'financial_statement',
          document_year: statement.year,
          document_title: statement.title_fr,
          access_method: 'id',
          user_agent: request.headers.get('user-agent') || 'unknown',
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          referrer: request.headers.get('referer') || 'unknown'
        })
      } catch (logError) {
        // Don't fail the request if logging fails
        console.error('Error logging document access:', logError)
      }
    } 
    // Legacy path parameter method - consider deprecating
    else if (filePath) {
      // Validate the file path format
      const pathPattern = /^([0-9]{4}\/[0-9]{4}_[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/
      if (!pathPattern.test(filePath)) {
        return new NextResponse('Invalid file path format', { status: 400 })
      }
      
      documentPath = filePath
      
      // Log direct path access (might be suspicious)
      console.warn(`Direct path access attempted for: ${filePath}`)
    } 
    else {
      return new NextResponse('Either document ID or path is required', { status: 400 })
    }

    // Ensure documentPath is defined before proceeding
    if (!documentPath) {
      return new NextResponse('Unable to determine document path', { status: 400 })
    }

    // Download the file from Supabase storage
    const { data, error } = await supabase.storage
      .from('financial_statements')
      .download(documentPath)

    if (error) {
      console.error('Error downloading file:', error)
      return new NextResponse('Error downloading file', { status: 500 })
    }

    if (!data) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Get the file extension to set content type
    const extension = documentPath.split('.').pop()?.toLowerCase() || 'pdf'
    
    // Define content type based on extension
    let contentType = 'application/octet-stream'
    if (extension === 'pdf') {
      contentType = 'application/pdf'
    } else if (extension === 'doc' || extension === 'docx') {
      contentType = 'application/msword'
    } else if (extension === 'xls' || extension === 'xlsx') {
      contentType = 'application/vnd.ms-excel'
    }

    // Get the filename from the path, but obfuscate it slightly for security
    // Use document ID instead of the original filename when available
    let filename = documentPath.split('/').pop() || 'document.pdf'
    if (documentId) {
      const cleanExt = extension || 'pdf';
      filename = `document-${documentId.substring(0, 8)}.${cleanExt}`;
    }

    // Set the appropriate headers and return the file
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', `inline; filename=${filename}`)
    headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`)
    headers.set('X-Content-Type-Options', 'nosniff') // Security: prevent MIME type sniffing
    headers.set('Content-Security-Policy', "default-src 'self'") // Security: CSP header
    headers.set('X-Frame-Options', 'DENY') // Security: prevent embedding in iframes
    
    return new NextResponse(data, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new NextResponse('An unexpected error occurred', { status: 500 })
  }
} 