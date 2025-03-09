import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asynchandler/asyncHandler.js';
import Player from '../../model/playerModel/playerModel.js';
import { playerRequiredFields } from './required/playerRequiredFields.js';
import { upsertEmbedding } from '../../utils/chromadb/upsertChromaCollection.js';
import { convertPlayerDataToText } from './convertPlayerDataToText/convertPlayerDataToText.js';

export const createPlayerController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Validate required fields
      const missingFields = playerRequiredFields.filter(
        (field) => !req.body[field]
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Validation Error: Missing fields - ${missingFields.join(', ')}`
        );
      }

      const {
        photo,
        fullName,
        nickname,
        email,
        mobilePhone,
        dob,
        height,
        weight,
        startedPlaying,
        preferredFoot,
        preferredHandball,
        preferredTap,
        primaryPosition,
        secondaryPosition,
        preferredPosition,
        playingStyle,
        currentClub,
        previousClubs,
        yearsOfExperience,
        gamesPlayed,
        goalsKicked,
        aspirations,
        achievements,
        injuryHistory,
        socialMediaLinks,
        playerProfile,
        biography,
      } = req.body;

      // Check if the player already exists
      const existingPlayer = await Player.findOne({ email });

      if (existingPlayer) {
        return res
          .status(409)
          .json({ message: 'Player with this email already exists' });
      }

      // Create a new player
      const newPlayer = new Player({
        photo,
        fullName,
        nickname,
        email,
        mobilePhone,
        dob,
        height,
        weight,
        startedPlaying,
        preferredFoot,
        preferredHandball,
        preferredTap,
        primaryPosition,
        secondaryPosition,
        preferredPosition,
        playingStyle,
        currentClub,
        previousClubs,
        yearsOfExperience,
        gamesPlayed,
        goalsKicked,
        aspirations,
        achievements,
        injuryHistory,
        socialMediaLinks,
        playerProfile,
        biography,
      });

      // Save the player to the database
      const savedPlayer = await newPlayer.save();

      const playerTextData = convertPlayerDataToText(savedPlayer);
      const playerId = String(savedPlayer._id).toString();

      // 🔹 Upsert full player text data into ChromaDB for AI analysis
      await upsertEmbedding(playerTextData, { playerId }, playerId);

      res.status(201).json({
        message: 'Player created successfully',
        player: savedPlayer,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Internal Server Error When Creating a Player',
        error: error.message,
      });
    }
  }
);
