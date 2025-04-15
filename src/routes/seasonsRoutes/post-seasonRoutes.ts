import express from 'express';
import {
  getAllPostSeasons,
  getPostSeasonById,
  createPostSeason,
  updatePostSeason,
  deletePostSeason
} from '../../controller/seasonsControllers/post-seasoncontrollers/post-seasoncontrollers.js';

const router = express.Router();

// Get all post-season records
router.get('/', getAllPostSeasons);

// Get a specific post-season record by ID
router.get('/:id', getPostSeasonById);

// Create a new post-season record
router.post('/', createPostSeason);

// Update a post-season record
router.put('/:id', updatePostSeason);

// Delete a post-season record
router.delete('/:id', deletePostSeason);

export default router; 