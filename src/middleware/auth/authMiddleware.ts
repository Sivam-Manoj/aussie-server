import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../model/userModel/userModel.js";
import Admin from "../../model/adminModel/adminModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";

export interface AuthUser {
  _id: string;
  email: string;
  isVerified: boolean;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Helper function to attach user to request
 */
const attachUserToRequest = async (req: AuthRequest, decoded: AuthUser) => {
  // Check if user is admin first
  const admin = await Admin.findOne({ email: decoded.email });
  if (admin) {
    req.user = {
      _id: admin._id.toString(),
      email: admin.email,
      isVerified: true,
      role: admin.role,
    };
    return;
  }

  // If not admin, check regular users
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new Error('User not found');
  }

  req.user = {
    _id: user._id.toString(),
    email: user.email,
    isVerified: user.isVerified,
  };
};

/**
 * Middleware to verify JWT token and attach user to request
 * Returns 401 if no token or invalid token
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Bypass authentication for testing - REMOVE IN PRODUCTION
    console.log('Bypassing authentication for testing');
    // Use the existing player's user ID
    req.user = {
      _id: '68029cc85cbda14842b78b74',  // This is the user._id from your document
      email: 'manom8193@gmail.com',
      role: 'player'
    } as any;
    return next();
    
    /* Uncomment this for production
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
      await attachUserToRequest(req, decoded);
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      }
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
    */
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Middleware that will attach user if token exists, but won't fail if it doesn't
 * Useful for public routes that have optional authentication
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
        await attachUserToRequest(req, decoded);
      } catch (error) {
        // Token is invalid, but we'll continue without setting req.user
        console.warn("Optional Auth: Invalid token - ", error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    next();
  } catch (error) {
    console.error("Optional Auth Middleware Error:", error);
    next();
  }
};

/**
 * Middleware to check if user is an admin
 * Must be used after protect middleware
 */
export const admin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Check if user is admin in the database
    const adminUser = await Admin.findOne({ email: req.user.email });
    
    if (!adminUser) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!adminUser.isActive) {
      return res.status(403).json({ message: 'Admin account is not active' });
    }

    // Update request user with admin role
    req.user.role = adminUser.role;
    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Middleware to refresh access token using refresh token
 */
export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshJwt;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET as string
      ) as AuthUser;

      // Check if user is admin
      const admin = await Admin.findOne({ email: decoded.email });
      if (admin) {
        createJwtToken(res, {
          _id: admin._id.toString(),
          email: admin.email,
          role: admin.role,
          isVerified: true,
        });

        req.user = {
          _id: admin._id.toString(),
          email: admin.email,
          isVerified: true,
          role: admin.role,
        };

        return next();
      }

      // Handle regular user refresh
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      createJwtToken(res, {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        isProfileDone: user.isProfileDone,
      });

      // Attach user data to request
      req.user = {
        _id: user._id.toString(),
        email: user.email,
        isVerified: user.isVerified,
      };

      console.log("✅ New access token issued");
      return next();
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  } catch (error) {
    console.error("Refresh Token Middleware Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
