import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.GMAIL_EMAIL);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
import cors from "cors";

// Configure CORS (Allow all origins or specify allowed origins)
const corsHandler = cors({ origin: true });

export const sendEmail = onRequest(async (req, res) => {
  // Handle CORS
  return corsHandler(req, res, async () => {
    try {
      // Handle OPTIONS (Preflight) request
      if (req.method === "OPTIONS") {
        return res.status(204).send(""); // Respond with no content
      }

      // Allow only POST requests
      if (req.method !== "POST") {
        return res.status(405).send({ error: "Method Not Allowed" });
      }

      // Parse request body
      const { to, subject, text } = req.body;

      // Validate input fields
      if (!to || !subject || !text) {
        return res.status(400).send({ error: "Missing required fields" });
      }
      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to,
        subject,
        text,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully.");
      } catch (error) {
        res.status(500).send(`Error sending email: ${error}`);
      }
    //   console.log(Sending email to: ${to}, Subject: ${subject}, Text: ${text});
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  });
});