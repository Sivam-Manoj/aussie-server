import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import User from "../../model/userModel/userModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";

export const signinController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    try {
      // Check if the user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found, please register first" });
      }

      // Validate password (you should use a hashing comparison for security)
      const isPasswordValid = await user.comparePassword(password); // Assuming comparePassword is a method defined in your User model

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // If valid, create both access token
      const { accessToken } = createJwtToken(res, {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        isProfileDone: user.isProfileDone,
      });

      return res.status(200).json({
        message: "success",
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error during login" });
    }
  }
);
