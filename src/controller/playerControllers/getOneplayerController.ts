import { Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import { AuthRequest } from "../../middleware/auth/authMiddleware.js";
import Player from "../../model/playerModel/playerModel.js";
import { checkUser } from "../../utils/checkUser/checkUser.js";

export const getOnePlayer = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No user found in request" });
      }
      const userId = req.user?._id;

      const user = await Player.findOne({ user: userId });

      if (!user) {
        checkUser(res, false); // Assuming you want to clear the cookies here if no user
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);
