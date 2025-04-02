import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import { searchIndex } from "../../utils/chromadb/SearchChromaCollection.js";
import { AuthRequest } from "../../middleware/auth/authMiddleware.js";

export const getPlayerController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<any> => {
    const { search } = req.body;
    if (!search) {
      res.json(404).json({ message: "Please Provide Search" });
    }

    const userId = req.user?._id as string;
    try {
      const results = await searchIndex(search, userId);
      res.status(200).json({ message: results });
    } catch (error) {
      res.json(500).json({ message: "Internel Server Error" });
    }
  }
);
