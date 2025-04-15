import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PreSeason from '../../../model/Seasons/pre-seasonModel/pre-seasonModel.js'; // Adjust the path if needed

// Get all PreSeason records
export const getAllPreSeasons = async (req: Request, res: Response) => {
  try {
    const records = await PreSeason.find().populate('playerId');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch PreSeason records', error });
  }
};

// Get a specific PreSeason record by ID
export const getPreSeasonById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const record = await PreSeason.findById(id).populate('playerId');
    if (!record) return res.status(404).json({ message: 'PreSeason record not found' });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving PreSeason record', error });
  }
};

// Create a new PreSeason record
export const createPreSeason = async (req: Request, res: Response) => {
  try {
    const { userId, playerId } = req.body;
    
    if (!userId || !playerId) {
      return res.status(400).json({ message: 'User ID and Player ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: 'Invalid User ID or Player ID format' });
    }

    const newRecord = new PreSeason(req.body);
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create PreSeason record', error });
  }
};

// Update a PreSeason record by ID
export const updatePreSeason = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const updated = await PreSeason.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'PreSeason record not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update PreSeason record', error });
  }
};

// Delete a PreSeason record by ID
export const deletePreSeason = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deleted = await PreSeason.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'PreSeason record not found' });

    res.status(200).json({ message: 'PreSeason record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete PreSeason record', error });
  }
};
