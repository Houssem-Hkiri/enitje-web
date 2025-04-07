import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if required environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: "Supabase credentials missing",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        }
      }, { status: 500 });
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by fetching table info
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        error: "Database query error",
        message: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    // Success
    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      supabaseUrl: supabaseUrl.split('.')[0] + '.[redacted]', // Partial URL for security
      tableInfo: data
    });
    
  } catch (err: any) {
    return NextResponse.json({
      error: "Server error",
      message: err.message
    }, { status: 500 });
  }
} 