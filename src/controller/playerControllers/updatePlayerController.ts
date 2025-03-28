import { Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import Player from "../../model/playerModel/playerModel.js";
import { upsertEmbedding } from "../../utils/chromadb/upsertChromaCollection.js";
import { convertPlayerDataToText } from "./convertPlayerDataToText/convertPlayerDataToText.js";
import { AuthRequest } from "../../middleware/auth/authMiddleware.js";

export const updatePlayerController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?._id;

      // Find and update the player by userId
      const updatedPlayer = await Player.findByIdAndUpdate(
        { user: userId }, // Find player by userId
        req.body, // Update player with request body
        { new: true } // Return the updated document
      );

      if (!updatedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }

      const playerTextData = convertPlayerDataToText(updatedPlayer);
      const updatedPlayerId = String(updatedPlayer._id).toString();

      // 🔹 Upsert updated player data into ChromaDB for AI analysis
      await upsertEmbedding(
        playerTextData,
        { playerId: updatedPlayerId },
        updatedPlayerId
      );

      res.status(200).json({
        message: "Player updated successfully",
        player: updatedPlayer,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal Server Error When Updating a Player",
        error: error.message,
      });
    }
  }
);
