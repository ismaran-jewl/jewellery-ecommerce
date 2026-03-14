// src/services/email/mailer.js
import nodemailer from "nodemailer";

let transporter = null;

export const initializeEmailService = () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const emailPort = parseInt(process.env.EMAIL_PORT, 10) || 587;

  if (!emailUser || !emailPassword) {
    console.warn("Email service credentials not configured");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  return transporter;
};

export const sendEmail = async (options) => {
  const transporter = initializeEmailService();

  if (!transporter) {
    console.warn("Email service not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

export const verifyEmailConnection = async () => {
  const transporter = initializeEmailService();

  if (!transporter) {
    return { verified: false, error: "Email service not configured" };
  }

  try {
    await transporter.verify();
    console.log("Email connection verified");
    return { verified: true };
  } catch (error) {
    console.error("Email connection verification failed:", error);
    return { verified: false, error: error.message };
  }
};
