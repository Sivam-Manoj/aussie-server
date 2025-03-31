import express from "express";
import { createPreSeason, getAllPreSeason,} from "../../controller/pre_seasonControllers/pre_seasoncontrolle.js";

const router = express.Router();

// Create a new PreSeason entry
router.post("/preseason", createPreSeason);

// Get all PreSeason recordsgetAllPreSeasons
router.get("/preseason",getAllPreSeason  );

export default router;
