import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../model/userModel/userModel.js";
import Admin from "../../model/adminModel/adminModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";

export interface AuthRequest extends Request {
  user?: { _id: string; email: string; isVerified: boolean; role?: string };
}

// Rename authMiddleware to protect for consistency
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    try {
      // Verify access token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        _id: string;
        email: string;
        isVerified: boolean;
        role?: string;
      };

      // Check if user is admin
      const admin = await Admin.findOne({ email: decoded.email });
      if (admin) {
        req.user = {
          _id: admin._id.toString(),
          email: admin.email,
          isVerified: true,
          role: admin.role,
        };
        return next();
      }

      // Fetch user from database
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Access denied: User not found" });
      }

      // Attach user data to request
      req.user = {
        _id: user._id.toString(),
        email: user.email,
        isVerified: user.isVerified,
      };

      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.warn("⚠️ Access token expired. Attempting to refresh...");

        const refreshToken = req.cookies?.refreshJwt;
        if (!refreshToken) {
          return res
            .status(401)
            .json({ message: "Unauthorized: No refresh token" });
        }

        try {
          // Verify refresh token
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET as string
          ) as {
            _id: string;
            email: string;
            isVerified: boolean;
            role?: string;
          };

          // Check if user is admin
          const admin = await Admin.findOne({ email: decodedRefresh.email });
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

          // Fetch user from database
          const user = await User.findOne({ email: decodedRefresh.email });

          if (!user) {
            return res
              .status(404)
              .json({ message: "Access denied: User not found" });
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

          console.log("✅ New access token issued.");
          return next();
        } catch (refreshError) {
          return res
            .status(403)
            .json({ message: "Forbidden: Invalid refresh token" });
        }
      }

      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin middleware to check if user is admin
export const admin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const admin = await Admin.findOne({ email: req.user.email });
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: "Forbidden: Admin account inactive" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
