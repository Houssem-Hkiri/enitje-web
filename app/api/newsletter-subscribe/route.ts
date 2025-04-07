import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const email = formData.get('email') as string;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Check if email already exists in the newsletter subscribers
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Vous êtes déjà inscrit à notre newsletter' },
        { status: 200 }
      );
    }

    // Add the email to the newsletter_subscribers table
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          status: 'active',
          subscribed_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Une erreur est survenue lors de l\'inscription' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: 'Merci de vous être inscrit à notre newsletter!'
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Erreur du serveur: ' + error.message },
      { status: 500 }
    );
  }
} 