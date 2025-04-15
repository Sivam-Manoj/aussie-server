import { Request, Response } from "express";
import InSeason from "../../../model/Seasons/in-seasonModel/in-seasonModel.js";
import mongoose from "mongoose";

// GET all InSeason records
export const getAllInSeason = async (req: Request, res: Response) => {
  try {
    const data = await InSeason.find().populate("playerId");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET one InSeason record by ID
export const getInSeasonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const data = await InSeason.findById(id).populate("playerId");

    if (!data) return res.status(404).json({ message: "Not found" });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST create new InSeason record
export const createInSeason = async (req: Request, res: Response) => {
  try {
    const { userId, playerId } = req.body;
    
    if (!userId || !playerId) {
      return res.status(400).json({ message: 'User ID and Player ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: 'Invalid User ID or Player ID format' });
    }

    const newEntry = new InSeason(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(400).json({ message: "Creation failed", error: err });
  }
};

// PUT update InSeason by ID
export const updateInSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const updated = await InSeason.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err });
  }
};

// DELETE InSeason by ID
export const deleteInSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const deleted = await InSeason.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err });
  }
};
