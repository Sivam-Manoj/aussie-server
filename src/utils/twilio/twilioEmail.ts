import sgMail from '@sendgrid/mail';

// Twilio SendGrid API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmailVerification = async (
  email: string,
  verificationCode: string
): Promise<void> => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL as string, // Your verified sender email in SendGrid
      subject: 'Email Verification',
      text: `Your verification code is ${verificationCode}`,
      html: `<strong>Your verification code is ${verificationCode}</strong>`,
    };

    await sgMail.send(msg);
    console.log('Verification email sent.');
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw new Error('Failed to send email verification.');
  }
};
