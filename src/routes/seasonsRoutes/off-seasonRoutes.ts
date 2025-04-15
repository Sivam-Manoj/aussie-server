import express from 'express';
import {
  getAllOffSeasonPlans,
  getOffSeasonPlanById,
  createOffSeasonPlan,
  updateOffSeasonPlan,
  deleteOffSeasonPlan
} from '../../controller/seasonsControllers/off-seasoncontrollers/off-seasoncontrollers.js';

const router = express.Router();

// Get all off-season plans
router.get('/', getAllOffSeasonPlans);

// Get a specific off-season plan by ID
router.get('/:id', getOffSeasonPlanById);

// Create a new off-season plan
router.post('/', createOffSeasonPlan);

// Update an off-season plan
router.put('/:id', updateOffSeasonPlan);

// Delete an off-season plan
router.delete('/:id', deleteOffSeasonPlan);

export default router; 