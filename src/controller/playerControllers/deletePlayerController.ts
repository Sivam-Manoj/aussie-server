import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import { deleteCollection } from "../../utils/chromadb/deleteChromaCollection.js";

export const deletePlayersController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await deleteCollection("players");
      res.status(200).json({ message: "collection deleted succesfully" });
    } catch (error) {
      res.status(500).json({ message: "internel server error" });
    }
  }
);
