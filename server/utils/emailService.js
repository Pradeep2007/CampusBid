import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  // UPDATED: Explicitly defining host and port prevents Render connection timeouts
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"CampusBids Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    // NEW: This will print the EXACT reason Google is blocking it into your Render Logs!
    console.error("🚨 NODEMAILER ERROR:", error); 
    throw new Error('Email delivery failed. Please check the email address.');
  }
};