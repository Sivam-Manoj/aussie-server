import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret_key'; // Use a separate secret for refresh token

// Function to create the JWT access token
export const createJwtToken = (
  res: Response,
  payload: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
  }
) => {
  try {
    // Generate JWT access token (expires in 7 days)
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Generate a refresh token (expires in 30 days)
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: '30d',
    });

    // Set access token in HTTP-only cookie
    res.cookie('jwt', accessToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshJwt', refreshToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log('✅ JWT Tokens created and sent.');
    return { accessToken, refreshToken }; // Optionally return the tokens
  } catch (error) {
    console.error('❌ Error creating JWT tokens:', error);
    throw error; // Handle this in the route
  }
};
