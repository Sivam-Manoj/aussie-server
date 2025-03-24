import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asynchandler/asyncHandler.js';
import Player from '../../model/playerModel/playerModel.js';
import { deleteEmbeddingById } from '../../utils/chromadb/deleteChromaCollectionById.js';

export const deletePlayerController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { playerId } = req.params;

      // Check if the player exists
      const existingPlayer = await Player.findById(playerId);

      if (!existingPlayer) {
        return res.status(404).json({ message: 'Player not found' });
      }

      // Delete the player from the database
      await Player.findByIdAndDelete(playerId);

      // 🔹 Remove player embedding from ChromaDB
      await deleteEmbeddingById(playerId);

      res.status(200).json({
        message: 'Player deleted successfully',
        playerId,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Internal Server Error When Deleting a Player',
        error: error.message,
      });
    }
  }
);
