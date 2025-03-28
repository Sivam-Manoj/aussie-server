import { Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import Player from "../../model/playerModel/playerModel.js";
import { playerRequiredFields } from "./required/playerRequiredFields.js";
import { upsertEmbedding } from "../../utils/chromadb/upsertChromaCollection.js";
import { convertPlayerDataToText } from "./convertPlayerDataToText/convertPlayerDataToText.js";
import { AuthRequest } from "../../middleware/auth/authMiddleware.js";
import { uploadToR2 } from "../../utils/r2Storage/r2Upload.js";
import User from "../../model/userModel/userModel.js";
import { createJwtToken } from "../../utils/jwt/createToken.js";

export const createPlayerController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      // Validate required fields
      const missingFields = playerRequiredFields.filter(
        (field) => !req.body[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Validation Error: Missing fields - ${missingFields.join(
            ", "
          )}`,
        });
      }
      const { email, fullName } = req.body;
      const userId = req.user?._id as string;

      // Check if the player already exists
      const existingPlayer = await Player.findOne({ email });
      if (existingPlayer) {
        return res.status(409).json({
          message: "Player with this email already exists",
        });
      }

      // Handle file upload safely
      let fileUrl = null;
      if (req.file) {
        try {
          const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
          await uploadToR2(req.file, process.env.R2_BUCKET_NAME!, fileName);
          fileUrl = `https://pub-9240903e216140d297b5e291c5c39732.r2.dev/${fileName}`;
        } catch (uploadError: any) {
          console.error("File upload failed:", uploadError);
          return res.status(500).json({
            message: "File upload failed",
            error: uploadError.message,
          });
        }
      }

      // Create new player document
      const newPlayer = new Player({
        photo: fileUrl,
        user: userId,
        ...req.body, // Spread all remaining fields from req.body
      });

      // Save the player to the database
      const savedPlayer = await newPlayer.save();

      // Convert player data to text for embedding
      const playerTextData = convertPlayerDataToText(savedPlayer);

      // Upsert full player text data into ChromaDB for AI analysis
      await upsertEmbedding(
        playerTextData,
        { userId, email, fullName },
        userId
      );

      // Mark user profile as complete
      const user = await User.findById(userId);
      if (user) {
        user.isProfileDone = true;
        await user.save(); // Save user after updating
        createJwtToken(res, {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isProfileDone: user.isProfileDone,
        });
      }

      res.status(201).json({
        message: "Player created successfully",
        player: savedPlayer,
      });
    } catch (error: any) {
      console.error("Error creating player:", error);
      res.status(500).json({
        message: "Internal Server Error When Creating a Player",
        error: error.message,
      });
    }
  }
);
