import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../model/userModel/userModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";

export interface AuthRequest extends Request {
  user?: { _id: string; email: string; isVerified: boolean };
}

export const authMiddleware = async (
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
      };

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
          };

          // Fetch user from database
          const user = await User.findOne({ email: decodedRefresh.email });

          if (!user) {
            return res
              .status(404)
              .json({ message: "Access denied: User not found" });
          }

          // Generate new tokens
          const { accessToken, refreshToken: newRefreshToken } = createJwtToken(
            res,
            {
              _id: user._id.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              isVerified: user.isVerified,
            }
          );

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
