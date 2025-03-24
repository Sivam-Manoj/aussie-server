export const createEmailHtml = (verificationCode: string) => {
  return `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #2c3e50; text-align: center;">Welcome to Aussie Rules!</h2>
          <p style="color: #555; text-align: center; font-size: 16px;">Use the code below to verify your email:</p>
          <div style="text-align: center; padding: 15px;">
            <span style="font-size: 24px; font-weight: bold; background: #2ecc71; color: #fff; padding: 10px 20px; border-radius: 5px;">${verificationCode}</span>
          </div>
          <p style="color: #777; text-align: center; font-size: 14px;">If you did not request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #888; text-align: center; font-size: 12px;">&copy; ${new Date().getFullYear()} Aussie Rules. All rights reserved.</p>
        </div>
      </div>
    `;
};
