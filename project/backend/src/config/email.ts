import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendCreditExhaustedEmail = async (userEmail: string, text: string) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: 'Credits Exhausted - Startup Finder',
    html: `
      <p>${text}</p>
      <p><a href="${process.env.BACKEND_URL}/api/check-recharge-emails?email=${encodeURIComponent(userEmail)}" style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">Recharge Credits</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};