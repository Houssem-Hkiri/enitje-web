const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmailConfig() {
  // Create a test account if we don't have SMTP credentials
  let testAccount;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    testAccount = await nodemailer.createTestAccount();
  }

  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || testAccount.user,
      pass: process.env.SMTP_PASSWORD || testAccount.pass,
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
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP connection verified successfully!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Email Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'Test Email from Node.js Application',
      text: 'This is a test email to verify the SMTP configuration.',
      html: '<strong>This is a test email to verify the SMTP configuration.</strong>',
    });

    console.log('Message sent: %s', info.messageId);
    
    // For ethereal test accounts, show the preview URL
    if (testAccount) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmailConfig().catch(console.error); 