const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmailToAlternate() {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'your-app-password',
    },
    debug: true,
    logger: true
  });

  console.log('Using configuration:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`Secure: ${process.env.SMTP_SECURE}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  
  try {
    // Replace this with an alternate email that you have access to
    const alternateEmail = 'contact@enitje.com';
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Email Test" <${process.env.SMTP_USER}>`,
      to: alternateEmail,
      subject: 'Test Email #2 - Alternate Recipient',
      text: 'This is a second test email to verify if there are delivery issues.',
      html: '<strong>This is a second test email to verify if there are delivery issues.</strong>',
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Check your spam/junk folder if you do not see the email in your inbox');
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmailToAlternate().catch(console.error); 