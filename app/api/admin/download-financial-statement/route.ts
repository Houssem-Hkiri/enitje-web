import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the parameters from the query
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')
    
    if (!fileId) {
      return new NextResponse('Document ID is required', { status: 400 })
    }
    
    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated and an admin
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const { data: user } = await supabase.auth.getUser()
    const isAdmin = user?.user?.app_metadata?.role === 'admin'
    
    if (!isAdmin) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Get the file info from the database using the ID
    const { data: statement, error: dbError } = await supabase
      .from('financial_statements')
      .select('file_path, year, title_fr')
      .eq('id', fileId)
      .single()
    
    if (dbError || !statement || !statement.file_path) {
      console.error('Document not found in database:', dbError || 'No record found')
      return new NextResponse('Document not found', { status: 404 })
    }
    
    const filePath = statement.file_path
    
    // Log this admin access
    try {
      await supabase.from('admin_document_access_logs').insert({
        document_id: fileId,
        document_type: 'financial_statement',
        user_id: session.user.id,
        user_email: session.user.email,
        document_path: filePath,
        access_timestamp: new Date().toISOString()
      })
    } catch (logError) {
      // Just log the error, don't fail the request
      console.error('Failed to log admin document access:', logError)
    }

    // Download the file from Supabase storage
    const { data, error } = await supabase.storage
      .from('financial_statements')
      .download(filePath)

    if (error) {
      console.error('Error downloading file:', error)
      return new NextResponse('Error downloading file', { status: 500 })
    }

    if (!data) {
      return new NextResponse('File not found in storage', { status: 404 })
    }

    // Get the file extension to set content type
    const extension = filePath.split('.').pop()?.toLowerCase() || 'pdf'
    
    // Define content type based on extension
    let contentType = 'application/octet-stream'
    if (extension === 'pdf') {
      contentType = 'application/pdf'
    } else if (extension === 'doc' || extension === 'docx') {
      contentType = 'application/msword'
    } else if (extension === 'xls' || extension === 'xlsx') {
      contentType = 'application/vnd.ms-excel'
    }

    // Get the original filename from the path
    const filename = filePath.split('/').pop() || 'document.pdf'

    // Set the appropriate headers and return the file
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', `attachment; filename=${filename}`)
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    
    return new NextResponse(data, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Unexpected error in admin download route:', error)
    return new NextResponse('An unexpected error occurred', { status: 500 })
  }
} 