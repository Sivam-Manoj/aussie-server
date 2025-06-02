import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { body, query, ValidationChain } from 'express-validator';
import { protect, optionalAuth } from '../../middleware/auth/authMiddleware.js';
import { uploadSingle } from '../../middleware/upload/uploadMiddleware.js';
import {
  getPlayerProfile,
  updatePlayerProfile,
  uploadProfilePicture,
  getPlayerById,
  deletePlayerProfile,
  searchPlayers
} from '../../controller/playerControllers/playerController.js';
import { createPlayerController } from '../../controller/playerControllers/createPlayerController.js';

const router = Router();

// Error handling wrapper with proper typing
const asyncHandler = <T extends RequestHandler>(fn: T) => 
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(fn(req, res, next));
    } catch (error) {
      console.error('Route Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }) as RequestHandler;

/**
 * @route   GET /api/players/search
 * @desc    Search for players
 * @access  Public
 */
router.get(
  '/search',
  [
    query('query', 'Search query is required').notEmpty().trim(),
    query('limit', 'Limit must be a number between 1 and 100')
      .optional()
      .isInt({ min: 1, max: 100 })
  ],
  searchPlayers
);

/**
 * @route   GET /api/players/:id
 * @desc    Get player by ID
 * @access  Public (but private profiles are protected)
 */
router.get('/:id', optionalAuth, getPlayerById);

// Apply authentication middleware to protected routes
router.use(protect);

// Player creation validation
const playerCreationValidation = [
  body('fullName', 'Full name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('mobilePhone', 'Please include a valid phone number')
    .trim()
    .isMobilePhone('any'),
  body('dob', 'Please include a valid date of birth')
    .isISO8601()
    .toDate(),
  body('height', 'Height must be a positive number')
    .optional()
    .isFloat({ min: 0 }),
  body('weight', 'Weight must be a positive number')
    .optional()
    .isFloat({ min: 0 }),
  body('playerProfile', 'Player profile must be either Public or Private')
    .optional()
    .isIn(['Public', 'Private']),
  body('primaryPosition', 'Primary position is required')
    .isString()
    .trim(),
  body('secondaryPosition', 'Secondary position must be a string')
    .optional()
    .isString()
    .trim(),
  body('biography', 'Biography must be a string')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
];

// Public route for creating player profile (protected by auth)
router.post('/create', protect, playerCreationValidation, asyncHandler(createPlayerController));

// Update player profile validation
const updateProfileValidation = [
  body('fullName', 'Full name is required').optional().trim().notEmpty(),
  body('email', 'Please include a valid email').optional().isEmail().normalizeEmail(),
  body('mobilePhone', 'Please include a valid phone number')
    .optional()
    .trim()
    .isMobilePhone('any'),
  body('dob', 'Please include a valid date of birth')
    .optional()
    .isISO8601()
    .toDate(),
  body('height', 'Height must be a positive number')
    .optional()
    .isFloat({ min: 0 }),
  body('weight', 'Weight must be a positive number')
    .optional()
    .isFloat({ min: 0 }),
  body('playerProfile', 'Player profile must be either Public or Private')
    .optional()
    .isIn(['Public', 'Private']),
  body('primaryPosition', 'Primary position is required for players')
    .optional()
    .isString()
    .trim(),
  body('secondaryPosition', 'Secondary position must be a string')
    .optional()
    .isString()
    .trim(),
  body('biography', 'Biography must be a string')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
];

/**
 * @route   PUT /api/players/me
 * @desc    Update player profile
 * @access  Private
 */
router.put('/me', updateProfileValidation, asyncHandler(updatePlayerProfile));

/**
 * @route   GET /api/players/me
 * @desc    Get current player's profile
 * @access  Private
 */
router.get('/me', asyncHandler(getPlayerProfile));

/**
 * @route   PATCH /api/players/me/picture
 * @desc    Upload or update player's profile picture
 * @access  Private
 */
router.patch(
  '/me/picture',
  uploadSingle('profilePicture'),
  asyncHandler(uploadProfilePicture)
);

/**
 * @route   DELETE /api/players/me
 * @desc    Delete player profile and associated data
 * @access  Private
 */
router.delete('/me', asyncHandler(deletePlayerProfile));

export default router;
