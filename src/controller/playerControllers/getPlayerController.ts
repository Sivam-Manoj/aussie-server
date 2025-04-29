import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import { searchIndex } from "../../utils/chromadb/SearchChromaCollection.js";
import { AuthRequest } from "../../middleware/auth/authMiddleware.js";
import User from "../../model/userModel/userModel.js";
import { checkUser } from "../../utils/checkUser/checkUser.js";

export const getPlayerController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<any> => {
    const { search } = req.body;

    // If search is not provided, return 404 with appropriate message
    if (!search) {
      return res.status(404).json({ message: "Please Provide Search" });
    }

    const userId = req.user?._id as string;
    const user = await User.findById(userId);

    // If user is not found, clear cookies and return an error response
    if (!user) {
      checkUser(res, false); // Assuming you want to clear the cookies here if no user
      return res.status(404).json({ message: "User not found" });
    }

    try {
      console.log(search, userId);
      const results = await searchIndex(search, userId);
      console.log(results);
      res.status(200).json({ message: results });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
