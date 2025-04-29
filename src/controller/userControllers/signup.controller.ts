import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import User from "../../model/userModel/userModel.js";

import { sendEmailVerification } from "../../utils/twilio/twilioEmail.js";
import { generateVerificationCode } from "../../utils/verificationCode/generateVerificationCode.js";
import { VERIFICATION_CODE_EXPIRATION } from "../../utils/verificationCode/verificationTime.js";

export const signupController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, phone, firstName, lastName } = req.body;

    if (!email || !password || !phone || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Please provide required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "User already registered, please login" });
    }

    if (existingUser && !existingUser.isVerified) {
      return res.status(204).json({ isVerified: false });
    }

    try {
      // Generate a 5 digit token as a verification code
      const verificationCode = generateVerificationCode();

      // Create a new user (not verified yet)
      const newUser = new User({
        email,
        password,
        phone,
        firstName,
        lastName,
        verificationCode, // Store the token in DB
        verificationCodeExpiresAt: Date.now() + VERIFICATION_CODE_EXPIRATION, // Set expiration time
      });

      await newUser.save();

      await sendEmailVerification(email, verificationCode);

      return res.status(201).json({
        message: "User registered successfully. Please verify your email.",
      });
    } catch (error) {
      return res.status(500).json({ message: "Error during registration" });
    }
  }
);

export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const verificationCode = generateVerificationCode();

    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = new Date(
      Date.now() + VERIFICATION_CODE_EXPIRATION
    );

    try {
      await user.save();
      await sendEmailVerification(email, verificationCode);
      return res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error sending verification email" });
    }
  }
);
