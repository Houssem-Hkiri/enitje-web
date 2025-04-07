const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testGmailConfig() {
  // Configure email transporter - using Gmail settings instead of OVH
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // You'll need to replace these with a Gmail account and app password
      user: 'your-gmail@gmail.com', // Replace with your Gmail
      pass: 'your-gmail-app-password', // Replace with an app password
    },
    debug: true,
    logger: true
  });

  console.log('Using Gmail configuration to test');
  
  try {
    // Send test email
    const info = await transporter.sendMail({
      from: '"ENIT Junior Test" <your-gmail@gmail.com>', // Replace with your Gmail
      to: 'houssem.trabelsi@etudiant-enit.utm.tn', // Your student email
      subject: 'Test Email using Gmail SMTP',
      text: 'This is a test email sent via Gmail SMTP to verify if there are delivery issues with the OVH mail server.',
      html: '<strong>This is a test email sent via Gmail SMTP to verify if there are delivery issues with the OVH mail server.</strong>',
    });

    console.log('Message sent via Gmail: %s', info.messageId);
    console.log('Check your student email inbox or spam folder');
  } catch (error) {
    console.error('Error with Gmail test:', error);
  }
}

console.log('Starting Gmail SMTP test...');
testGmailConfig().catch(console.error); 