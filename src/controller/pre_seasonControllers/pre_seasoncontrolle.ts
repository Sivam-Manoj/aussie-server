import { Request, Response } from "express";
import PreSeason from "../../model/pre_seasonModel/pre_seasonModel.js"; // Adjust the path as needed

// Create a new Pre-Season entry
export const createPreSeason = async (req: Request, res: Response) => {
  try {
    const newEntry = new PreSeason(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};

// Get all Pre-Season entries
export const getAllPreSeason = async (req: Request, res: Response) => {
  try {
    const entries = await PreSeason.find().populate("playerId");
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
