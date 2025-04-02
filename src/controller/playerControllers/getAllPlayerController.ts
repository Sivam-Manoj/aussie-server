import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asynchandler/asyncHandler.js";
import Player from "../../model/playerModel/playerModel.js";

export const getAllPlayers = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const players = await Player.find({ playerProfile: "Public" });
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ message: "error while get all players" });
    }
  }
);
