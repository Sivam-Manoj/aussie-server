import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import User from "../../model/userModel/userModel.js";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
}

export const updatePasswordController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { resetToken, password } = req.body;

    console.log(req.body);

    if (!resetToken || !password) {
      return res.status(400).json({ 
        message: "Please provide both reset token and new password" 
      });
    }

    try {

      const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET as string) as TokenPayload;
      const { email } = decodedToken;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }


      // Update password - mongoose will hash it automatically
      user.password = password;
      
      console.log(user.password);
  

      await user.save();

      const message = "Password updated successfully";

      return res.status(200).json(message);
    } catch (error) {
      console.error("Error in update password:", error);
      return res.status(500).json({ 
        message: "Error processing your request" 
      });
    }
  }
);
