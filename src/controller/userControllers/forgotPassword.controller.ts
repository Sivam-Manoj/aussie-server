import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import User from "../../model/userModel/userModel.js";
import { sendEmailVerification } from "../../utils/twilio/twilioEmail.js";
import { generateVerificationCode } from "../../utils/verificationCode/generateVerificationCode.js";
import { VERIFICATION_CODE_EXPIRATION } from "../../utils/verificationCode/verificationTime.js";
import { createResetToken } from "../../utils/jwt/createResetPasswordCookies.js";

export const forgotPasswordVerifyController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide your email address" });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found in that email" });
      }

     

      const verificationCode = generateVerificationCode();

      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = new Date(
        Date.now() + VERIFICATION_CODE_EXPIRATION
      );

      await user.save();
      await sendEmailVerification(email, verificationCode);
      return res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      console.error("Error in forgot password:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  }
);

export const verifyForgotPasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res
        .status(400)
        .json({ message: "Please provide verification code" });
    }

    try {
      const user = await User.findOne({ verificationCode });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      if (!user.isVerified) {
        return res.status(400).json({ message: "User not verified" });
      }

      const resetToken = createResetToken({
        _id: user._id.toString(),
        email: user.email,
      });

      return res.status(200).json(resetToken);
    } catch (error) {
      console.error("Error in forgot password:", error);
      return res.status(500).json({ message: "Error processing your request" });
    } 
  }
);
