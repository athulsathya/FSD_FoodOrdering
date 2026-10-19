import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 30000,
    });

    const verificationLink = `http://localhost:5173/verify/${token}`;

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Hi there!

       You have recently registered on our website.

       Please click the link below to verify your email address:

       ${verificationLink}

       Thank you!`,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("Email sent successfully:", info.messageId);

    return info;
  } 
  
    catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
