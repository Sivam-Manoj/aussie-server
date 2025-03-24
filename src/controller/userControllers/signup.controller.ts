import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import User from "../../model/userModel/userModel.js";
import { sendSmsVerification } from "../../utils/twilio/twilioSMS.js";
import { sendEmailVerification } from "../../utils/twilio/twilioEmail.js";
import { generateVerificationCode } from "../../utils/verificationCode/generateVerificationCode.js";
import { VERIFICATION_CODE_EXPIRATION } from "../../utils/verificationCode/verificationTime.js";

export const signupController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, phone, firstName, lastName, verifyMethod } =
      req.body;

    if (!email || !password || !phone || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Please provide required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered, please login" });
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
        isVerified: false, // User is not verified yet
        verificationCode, // Store the token in DB
        verificationCodeExpiresAt: Date.now() + VERIFICATION_CODE_EXPIRATION, // Set expiration time
      });

      await newUser.save();

      // Send SMS and Email verification with the JWT token
      if (verifyMethod == "phone") {
        await sendSmsVerification(phone, verificationCode);
      } else {
        await sendEmailVerification(email, verificationCode);
      }

      return res.status(201).json({
        message:
          "User registered successfully. Please verify your email or phone.",
      });
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({ message: "Error during registration" });
    }
  }
);
