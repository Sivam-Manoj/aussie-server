import express from 'express';
import {
  getAllInSeason,
  getInSeasonById,
  createInSeason,
  updateInSeason,
  deleteInSeason
} from '../../controller/seasonsControllers/in-seasoncontrollers/in-seasoncontrollers.js';

const router = express.Router();

// Get all in-season records
router.get('/', getAllInSeason);

// Get a specific in-season record by ID
router.get('/:id', getInSeasonById);

// Create a new in-season record
router.post('/', createInSeason);

// Update an in-season record
router.put('/:id', updateInSeason);

// Delete an in-season record
router.delete('/:id', deleteInSeason);

export default router; 