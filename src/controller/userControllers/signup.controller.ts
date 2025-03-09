import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asynchandler/asyncHandler.js';
import User from '../../model/userModel/userModel.js';
import { sendSmsVerification } from '../../utils/twilio/twilioSMS.js';
import { sendEmailVerification } from '../../utils/twilio/twilioEmail.js';
import { createJwtVerifyToken } from '../../utils/jwt/createjwtVerifyToken.js';

export const signupController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, phoneNo, userName } = req.body;

    if (!email || !password || !phoneNo || !userName) {
      return res
        .status(400)
        .json({ message: 'Please provide required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already registered, please login' });
    }

    try {
      // Generate a JWT token as a verification code (includes email and user ID)
      const verificationCode = createJwtVerifyToken(email, userName);

      // Create a new user (not verified yet)
      const newUser = new User({
        email,
        password,
        phoneNo,
        userName,
        isVerified: false, // User is not verified yet
        verificationCode, // Store the JWT token in DB
      });

      await newUser.save();

      // Send SMS and Email verification with the JWT token
      await sendSmsVerification(phoneNo, verificationCode);
      await sendEmailVerification(email, verificationCode);

      return res.status(201).json({
        message:
          'User registered successfully. Please verify your email and phone.',
      });
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ message: 'Error during registration' });
    }
  }
);
