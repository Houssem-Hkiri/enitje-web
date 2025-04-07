const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testGmailForm() {
  // Create a transporter with Gmail settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // smtp.gmail.com
    port: Number(process.env.SMTP_PORT), // 587
    secure: process.env.SMTP_SECURE === 'true', // false
    auth: {
      user: process.env.SMTP_USER, // enitjuniorentreprise@gmail.com
      pass: process.env.SMTP_PASSWORD, // your password or app password
    }
  });

  console.log('SMTP Configuration:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`Secure: ${process.env.SMTP_SECURE}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  
  try {
    // First verify the connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    // Send a test email
    const info = await transporter.sendMail({
      from: `"ENIT Junior Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // sending to the same Gmail address
      subject: 'Test Contact Form Email',
      text: `
This is a test email from the contact form.
Testing if emails can be sent using the Gmail SMTP server.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #00adb5; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Test Contact Form Email</h2>
          
          <div style="margin: 20px 0;">
            <p>This is a test email from the contact form.</p>
            <p>Testing if emails can be sent using the Gmail SMTP server.</p>
          </div>
          
          <div style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eaeaea;">
            <p>This email was sent from the contact form on the ENIT Junior Enterprise website.</p>
          </div>
        </div>
      `
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Run the test
testGmailForm()
  .then(result => console.log('Test completed successfully'))
  .catch(error => console.error('Test failed:', error.message)); 