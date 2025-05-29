import { Request, Response, NextFunction } from 'express';
import { IPlayer } from '../../model/playerModel/playerModel.js';
import PlayerModel from '../../model/playerModel/playerModel.js';
import { AuthRequest } from '../../middleware/auth/authMiddleware.js';
import path from 'path';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';

// Type definitions for player search query
type PlayerSearchQuery = {
  query: string;
  limit?: string;
};

// Type for player update data
type PlayerUpdateData = Partial<Omit<IPlayer, 'user' | 'createdAt' | 'updatedAt'>>;

// Helper function to handle file operations
const deleteFileIfExists = async (filePath: string): Promise<void> => {
  try {
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

/**
 * @desc    Get current player's profile
 * @route   GET /api/players/me
 * @access  Private
 */
export const getPlayerProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const player = await PlayerModel.findOne({ user: req.user._id })
      .select('-__v')
      .populate('user', ['firstName', 'lastName', 'email', 'role']);

    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Get Player Profile Error:', error);
    next(error);
  }
};

/**
 * @desc    Create or update player profile
 * @route   PUT /api/players/me
 * @access  Private
 */
export const updatePlayerProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  if (!req.user?._id) {
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized' 
    });
  }

  try {
    const updateData: Partial<IPlayer> = {
      fullName: req.body.fullName,
      email: req.body.email,
      mobilePhone: req.body.mobilePhone,
      ...(req.body.dob && { dob: new Date(req.body.dob) }),
      ...(req.body.height !== undefined && { height: Number(req.body.height) }),
      ...(req.body.weight !== undefined && { weight: Number(req.body.weight) }),
      playerProfile: req.body.playerProfile,
      primaryPosition: req.body.primaryPosition,
      secondaryPosition: req.body.secondaryPosition,
      biography: req.body.biography,
      nickname: req.body.nickname,
      preferredFoot: req.body.preferredFoot,
      preferredHandball: req.body.preferredHandball,
      preferredTap: req.body.preferredTap,
      preferredPosition: req.body.preferredPosition,
      playingStyle: req.body.playingStyle,
      currentClub: req.body.currentClub,
      ...(req.body.yearsOfExperience !== undefined && { yearsOfExperience: Number(req.body.yearsOfExperience) }),
      ...(req.body.gamesPlayed !== undefined && { gamesPlayed: Number(req.body.gamesPlayed) }),
      ...(req.body.goalsKicked !== undefined && { goalsKicked: Number(req.body.goalsKicked) }),
      aspirations: req.body.aspirations,
      injuryHistory: req.body.injuryHistory,
      socialMediaLinks: req.body.socialMediaLinks || {},
      updatedAt: new Date()
    } as const;

    // Build profile object using the updateData we already prepared
    const profileFields: Partial<IPlayer> = {
      ...updateData,
      user: new Types.ObjectId(req.user._id),
      photo: req.body.photo || ''
    };

    try {
      // Try to find and update existing player, or create new one if not found
      const player = await PlayerModel.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { 
          new: true, 
          upsert: true, 
          runValidators: true, 
          setDefaultsOnInsert: true 
        }
      );

      res.status(200).json({
        success: true,
        data: player
      });
    } catch (error: unknown) {
      console.error('Update Player Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        success: false,
        message: 'Error updating player profile',
        error: errorMessage
      });
    }
  } catch (error: any) {
    console.error('Update Player Profile Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate field value entered',
        field: Object.keys(error.keyPattern)[0]
      });
    }
    next(error);
  }
};

export const uploadProfilePicture = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?._id) {
    if (req.file?.path) {
      await deleteFileIfExists(req.file.path);
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const player = await PlayerModel.findOne({ user: req.user._id });
    if (!player) {
      // Clean up the uploaded file if player not found
      await deleteFileIfExists(req.file.path);
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Delete old photo if exists
    if (player.photo) {
      const oldPhotoPath = path.join(process.cwd(), player.photo);
      await deleteFileIfExists(oldPhotoPath);
    }

    // Update player's photo path (relative to server root)
    const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
    player.photo = `/${relativePath}`;
    await player.save();

    res.json({ 
      message: 'Profile picture uploaded successfully',
      photo: player.photo 
    });
  } catch (error) {
    console.error('Upload Profile Picture Error:', error);
    // Clean up the uploaded file in case of error
    if (req.file?.path) {
      await deleteFileIfExists(req.file.path);
    }
    next(error);
  }
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const player = await PlayerModel.findById(req.params.id)
      .select('-__v')
      .populate('user', ['firstName', 'lastName', 'email', 'role']);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const authReq = req as AuthRequest;
    const isOwner = authReq.user?._id && player.user._id.toString() === authReq.user._id.toString();
    
    // Only return public profile if not the owner
    if (player.playerProfile === 'Private' && !isOwner) {
      return res.status(403).json({ message: 'This profile is private' });
    }

    res.json(player);
  } catch (error: any) {
    console.error('Get Player By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Player not found' });
    }
    next(error);
  }
};

export const deletePlayerProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const player = await PlayerModel.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Delete profile photo if exists
    if (player.photo) {
      const photoPath = path.join(process.cwd(), player.photo);
      await deleteFileIfExists(photoPath);
    }

    res.json({ message: 'Player profile deleted successfully' });
  } catch (error) {
    console.error('Delete Player Profile Error:', error);
    next(error);
  }
};

export const searchPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query as { query: string };
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery: any = {
      $and: [
        {
          $or: [
            { fullName: { $regex: query, $options: 'i' } },
            { nickname: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { currentClub: { $regex: query, $options: 'i' } },
            { primaryPosition: { $regex: query, $options: 'i' } },
            { secondaryPosition: { $regex: query, $options: 'i' } },
            { playingStyle: { $regex: query, $options: 'i' } },
            { aspirations: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    // If user is authenticated, allow searching private profiles they own
    if ('user' in req && req.user) {
      const authReq = req as AuthRequest;
      if (authReq.user && authReq.user._id) {
        searchQuery.$and.push({
          $or: [
            { playerProfile: 'Public' },
            { user: authReq.user._id } // Allow users to search their own private profiles
          ]
        });
        return;
      }
    }
    // Only search public profiles for unauthenticated users or if user ID is missing
    searchQuery.$and.push({ playerProfile: 'Public' });

    const players = await PlayerModel.find(searchQuery)
      .select('-__v')
      .limit(limit)
      .populate('user', ['firstName', 'lastName', 'email']);

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    console.error('Search Players Error:', error);
    next(error);
  }
};
