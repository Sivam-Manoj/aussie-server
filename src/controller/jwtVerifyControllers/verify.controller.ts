import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../model/userModel/userModel.js';
import { createJwtToken } from '../../utils/jwt/createToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret_key'; // Separate secret for refresh token

export const verifyController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { verificationToken } = req.body; // This will be the JWT sent by the user

  if (!verificationToken) {
    return res
      .status(400)
      .json({ message: 'Please provide verification token' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(verificationToken, JWT_SECRET) as {
      email: string;
    };

    // Find the user by email from the decoded JWT payload
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is already verified, return a message
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Create the access token and refresh token
    const { accessToken, refreshToken } = createJwtToken(res, {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
    });

    // Return the success response with both access token and refresh token
    return res.status(200).json({
      message: 'User verified successfully',
      accessToken,
      refreshToken, // Send the refresh token along with the access token
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res
      .status(400)
      .json({ message: 'Invalid or expired verification token' });
  }
};
