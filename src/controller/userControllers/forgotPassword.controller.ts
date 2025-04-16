import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import User from "../../model/userModel/userModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email address" });
    }

    try {
      // Check if the user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a password reset token
      const { accessToken: resetToken } = createJwtToken(res, {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        isProfileDone: user.isProfileDone,
      });

      // TODO: Implement email sending functionality
      // For now, we'll just return the token in the response
      return res.status(200).json({
        message: "Password reset token generated successfully",
        resetToken,
      });
    } catch (error) {
      console.error("Error in forgot password:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  }
); 