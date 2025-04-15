import { Request, Response } from 'express';
import mongoose from 'mongoose';
import OffSeasonPlan from '../../../model/Seasons/off-seasonModel/off-seasonModel.js'; // adjust the path as necessary

// GET all OffSeasonPlans
export const getAllOffSeasonPlans = async (req: Request, res: Response) => {
  try {
    const plans = await OffSeasonPlan.find().populate('playerId');
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans', error });
  }
};

// GET OffSeasonPlan by ID
export const getOffSeasonPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid ID' });

    const plan = await OffSeasonPlan.findById(id).populate('playerId');

    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving plan', error });
  }
};

// POST create new OffSeasonPlan
export const createOffSeasonPlan = async (req: Request, res: Response) => {
  try {
    const { userId, playerId } = req.body;
    
    if (!userId || !playerId) {
      return res.status(400).json({ message: 'User ID and Player ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: 'Invalid User ID or Player ID format' });
    }

    const plan = new OffSeasonPlan(req.body);
    const saved = await plan.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating plan', error });
  }
};

// PUT update OffSeasonPlan by ID
export const updateOffSeasonPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid ID' });

    const updated = await OffSeasonPlan.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: 'Plan not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating plan', error });
  }
};

// DELETE OffSeasonPlan by ID
export const deleteOffSeasonPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid ID' });

    const deleted = await OffSeasonPlan.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Plan not found' });

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error });
  }
};
