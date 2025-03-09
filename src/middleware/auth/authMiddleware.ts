import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../model/userModel/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use env variable in production

interface AuthRequest extends Request {
  user?: { _id: string; email: string; isVerified: boolean }; // Extend request type to include user
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]; // Get token from cookie or Authorization header

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      email: string;
      isVerified: boolean;
    };

    // ✅ Fetch user from DB (AWAIT is necessary!)
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: 'Access denied: User not found' });
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      isVerified: user.isVerified,
    }; // Attach user data to request

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'Forbidden: Invalid or expired token' });
  }
};
