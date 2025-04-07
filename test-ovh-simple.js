const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmailSimple() {
  // Create a simple transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    }
  });

  console.log(`Sending test email using: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} (secure: ${process.env.SMTP_SECURE})`);
  
  try {
    // Send test email
    const info = await transporter.sendMail({
      from: `"Test Email" <${process.env.SMTP_USER}>`,
      to: 'houssem.trabelsi@etudiant-enit.utm.tn',
      subject: 'Test Email - Simple Configuration',
      text: 'This is a test email with simplified configuration.',
      html: '<p>This is a test email with simplified configuration.</p>'
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Run the test
testEmailSimple()
  .then(result => console.log('Test completed successfully'))
  .catch(error => console.error('Test failed:', error)); 