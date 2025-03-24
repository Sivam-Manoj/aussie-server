import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../model/userModel/userModel.js";

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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
      email: string;
      isVerified: boolean;
    };

    // Fetch user from database
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "Access denied: User not found" });
    }

    // Attach user data to request
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      isVerified: user.isVerified,
    };

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("❌ Authentication error:", error);
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};
