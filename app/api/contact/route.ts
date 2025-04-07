import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, category, language } = body;

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (name.length > 100 || email.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Input too long' },
        { status: 400 }
      );
    }

    // Check if Supabase URL and key are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase credentials are missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Insert into Supabase
    try {
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .insert([
          {
            name,
            email,
            subject,
            message,
            category,
            status: 'new'
          }
        ])
        .select()
        .single();

      if (contactError) {
        console.error('Supabase error:', contactError);
        return NextResponse.json(
          { error: 'Database error: ' + contactError.message },
          { status: 500 }
        );
      }

      // Create email content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @media only screen and (max-width: 620px) {
              .email-container {
                width: 100% !important;
                padding: 0 !important;
              }
              .content {
                padding: 20px 15px !important;
              }
              .logo {
                max-width: 120px !important;
              }
              .social-icon {
                width: 30px !important;
                height: 30px !important;
              }
            }
          </style>
        </head>
        <body style="font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; color: #333333; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
          <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.08); margin-top: 30px; margin-bottom: 30px;">
            <!-- Header with logo -->
            <div style="background-color: #28384d; background-image: linear-gradient(135deg, #28384d 0%, #1a2535 100%); padding: 30px 20px; text-align: center;">
              <img src="https://admin.enitje.com/logow" alt="ENIT Junior Enterprise" class="logo" style="max-height: 80px; width: auto;">
            </div>
            
            <!-- Content -->
            <div class="content" style="padding: 35px 30px;">
              <h2 style="color: #28384d; font-size: 22px; margin-top: 0; margin-bottom: 25px; font-weight: 600; border-bottom: 2px solid #00adb5; padding-bottom: 10px;">
                Message de ${name}
              </h2>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #00adb5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; width: 30%;">
                      <strong style="color: #00adb5; font-weight: 600;">Contact:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                      ${name} &lt;${email}&gt;
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #00adb5; font-weight: 600;">Catégorie:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                      ${category}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #00adb5; font-weight: 600;">Sujet:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                      ${subject}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-bottom: 30px;">
                <h3 style="color: #00adb5; font-size: 18px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">
                  Message:
                </h3>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; line-height: 1.6; white-space: pre-wrap; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">${message}</div>
              </div>
            </div>
            
            <!-- Footer with social links -->
            <div style="background-color: #f5f7fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin-top: 0; margin-bottom: 18px; font-size: 15px; color: #555555; font-weight: 500;">
                Suivez-nous sur les réseaux sociaux:
              </p>
              <div style="margin-bottom: 25px;">
                <!-- Social media icons using favicon-style icons -->
                <a href="https://www.facebook.com/juniorenit" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #4267B2; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="height: 20px; width: 20px; fill: white;">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                    </svg>
                  </div>
                </a>
                <a href="https://www.linkedin.com/company/enitjuniorentreprise" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #0077B5; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height: 20px; width: 20px; fill: white;">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                    </svg>
                  </div>
                </a>
                <a href="https://www.instagram.com/enit.juniorentreprise/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80); display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height: 20px; width: 20px; fill: white;">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                    </svg>
                  </div>
                </a>
              </div>
              <p style="margin: 0; font-size: 13px; color: #777777; line-height: 1.6;">
                © ${new Date().getFullYear()} ENIT Junior Entreprise. Tous droits réservés.<br>
                École Nationale d'Ingénieurs de Tunis, Campus Universitaire El Manar, Tunis, Tunisia
              </p>
              <a href="https://enitje.com" style="display: inline-block; padding: 8px 20px; background-color: #00adb5; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px; margin-top: 10px; transition: background-color 0.3s ease;">Visitez notre site web</a>
            </div>
          </div>
        </body>
        </html>
      `;

      // Check if Resend API key is set
      if (!process.env.RESEND_API_KEY) {
        console.error('Resend API key is missing');
        return NextResponse.json(
          { error: 'Email service configuration error' },
          { status: 500 }
        );
      }

      // Send email using Resend
      try {
        const { error: emailError } = await resend.emails.send({
          from: 'ENIT Junior Enterprise <onboarding@resend.dev>',
          to: 'enitjuniorentreprise@gmail.com',
          replyTo: email,
          subject: `[WEBSITE - ${subject}]`,
          html: htmlContent,
        });

        if (emailError) {
          console.error('Resend error:', emailError);
          return NextResponse.json(
            { error: 'Email error: ' + emailError.message },
            { status: 500 }
          );
        }
      } catch (emailError: any) {
        console.error('Email sending error:', emailError);
        return NextResponse.json(
          { error: 'Email service error: ' + emailError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Contact form submitted successfully',
        id: contactData.id
      });
    } catch (dbError: any) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { error: 'Database operation error: ' + dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
} 