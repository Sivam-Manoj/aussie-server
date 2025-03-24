import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asynchandler/asyncHandler.js';
import Player from '../../model/playerModel/playerModel.js';
import { upsertEmbedding } from '../../utils/chromadb/upsertChromaCollection.js';
import { convertPlayerDataToText } from './convertPlayerDataToText/convertPlayerDataToText.js';
import { playerRequiredFields } from './required/playerRequiredFields.js';

export const updatePlayerController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { playerId } = req.params;

      // Check if the player exists
      const existingPlayer = await Player.findById(playerId);

      if (!existingPlayer) {
        return res.status(404).json({ message: 'Player not found' });
      }

      // Validate required fields (ensure at least one field is provided)
      const hasValidFields = playerRequiredFields.some((field) => req.body[field]);

      if (!hasValidFields) {
        throw new Error('Validation Error: No valid fields provided for update');
      }

      // Update the player data
      Object.assign(existingPlayer, req.body);
      const updatedPlayer = await existingPlayer.save();

      const playerTextData = convertPlayerDataToText(updatedPlayer);
      const updatedPlayerId = String(updatedPlayer._id).toString();

      // 🔹 Upsert updated player data into ChromaDB for AI analysis
      await upsertEmbedding(playerTextData, { playerId: updatedPlayerId }, updatedPlayerId);

      res.status(200).json({
        message: 'Player updated successfully',
        player: updatedPlayer,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Internal Server Error When Updating a Player',
        error: error.message,
      });
    }
  }
);
