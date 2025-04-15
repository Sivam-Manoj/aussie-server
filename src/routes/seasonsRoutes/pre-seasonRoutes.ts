import express from 'express';
import {
  getAllPreSeasons,
  getPreSeasonById,
  createPreSeason,
  updatePreSeason,
  deletePreSeason
} from '../../controller/seasonsControllers/pre-seasoncontollers/pre-seasoncontroller.js';

const router = express.Router();

// Get all pre-season records
router.get('/', getAllPreSeasons);

// Get a specific pre-season record by ID
router.get('/:id', getPreSeasonById);

// Create a new pre-season record
router.post('/', createPreSeason);

// Update a pre-season record
router.put('/:id', updatePreSeason);

// Delete a pre-season record
router.delete('/:id', deletePreSeason);

export default router; 