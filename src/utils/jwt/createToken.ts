import jwt from "jsonwebtoken";
import { Response } from "express";

// Function to create the JWT access token
export const createJwtToken = (
  res: Response,
  payload: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    isProfileDone: boolean;
  }
) => {
  try {
    // Generate JWT access token (expires in 7 days)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "21d",
    });

    // Generate a refresh token (expires in 30 days)
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET as string,
      {
        expiresIn: "30d",
      }
    );

    // Set access token in HTTP-only cookie
    res.cookie("jwt", accessToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV == "production", // HTTPS only in production
      //domain: "aussierulespro.com",
      path: "/",
      sameSite: "none",
      maxAge: 21 * 24 * 60 * 60 * 1000, // 21 days
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshJwt", refreshToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV == "production", // HTTPS only in production
      //domain: "aussierulespro.com",
      path: "/",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { accessToken, refreshToken }; // Optionally return the tokens
  } catch (error) {
    console.error("Error creating JWT tokens:", error);
    throw error; // Handle this in the route

  }
};
