import { Request, Response } from "express";
import User from "../../model/userModel/userModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";
 

export const verifyController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { verificationCode } = req.body; // This will be the JWT sent by the user

  if (!verificationCode) {
    return res
      .status(400)
      .json({ message: "Please provide verification token" });
  }

  try {
    // Verify the JWT token
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the verification code has expired
    if (Date.now() > user.verificationCodeExpiresAt.getTime()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // If user is already verified, return a message
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Create the access token
    const { accessToken } = createJwtToken(res, {
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName, // ✅ Add this field
      isVerified: user.isVerified,
      isProfileDone: user.isProfileDone,
    });

    // Return the success response with both access token and refresh token
    return res.status(200).json({
      message: "User verified successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });
  }
};
