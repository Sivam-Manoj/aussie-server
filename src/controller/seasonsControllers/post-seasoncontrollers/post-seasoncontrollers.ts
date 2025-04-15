import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PostSeason from '../../../model/Seasons/post-seasonModel/post-seasonModel.js'; // adjust path if needed

// GET all PostSeason records
export const getAllPostSeasons = async (req: Request, res: Response) => {
  try {
    const records = await PostSeason.find().populate('playerId');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch PostSeason data', error });
  }
};

// GET a single PostSeason by ID
export const getPostSeasonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const record = await PostSeason.findById(id).populate('playerId');
    if (!record) return res.status(404).json({ message: 'PostSeason not found' });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving record', error });
  }
};

// POST create new PostSeason
export const createPostSeason = async (req: Request, res: Response) => {
  try {
    const { userId, playerId } = req.body;
    
    if (!userId || !playerId) {
      return res.status(400).json({ message: 'User ID and Player ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: 'Invalid User ID or Player ID format' });
    }

    const newRecord = new PostSeason(req.body);
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create record', error });
  }
};

// PUT update PostSeason by ID
export const updatePostSeason = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const updated = await PostSeason.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'PostSeason not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update record', error });
  }
};

// DELETE PostSeason by ID
export const deletePostSeason = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const deleted = await PostSeason.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'PostSeason not found' });
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete record', error });
  }
};
