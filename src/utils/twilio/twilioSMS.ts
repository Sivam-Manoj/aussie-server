import twilio from "twilio";

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const client = twilio(accountSid, authToken);

export const sendSmsVerification = async (
  phone: string,
  verificationCode: string
): Promise<void> => {
  try {
    await client.messages.create({
      body: `Your verification code is ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phone, // User's phone number
    });
    console.log("Verification SMS sent.");
  } catch (error) {
    console.error("Error sending SMS verification:", error);
    throw new Error("Failed to send SMS verification.");
  }
};
