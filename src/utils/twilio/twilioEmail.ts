import sgMail from "@sendgrid/mail";
import { createEmailHtml } from "../template/emailHtml.js";

// Twilio SendGrid API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
export const sendEmailVerification = async (
  email: string,
  verificationCode: string
): Promise<void> => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL as string,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}`,
      html: createEmailHtml(verificationCode),
    };

    await sgMail.send(msg);
    console.log("Verification email sent.");
  } catch (error: any) {
    if (error.response) {
      console.error("SendGrid Error Response:", error.response.body);
    }
    console.error("Error sending email verification:", error);
    throw new Error("Failed to send email verification.");
  }
};
