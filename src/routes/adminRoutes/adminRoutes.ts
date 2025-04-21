import express from "express";
import { 
  getUsers, 
  getUserById, 
  getUserStats,
  getVerifiedUsers,
  getUnverifiedUsers,
  getAdminVerifiedUsers,
  approveUser,
  rejectUser,
  registerFirstAdmin,
  loginAdmin
} from "../../controller/adminControllers/admincontroller.js";
import { protect, admin } from "../../middleware/auth/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register-first", registerFirstAdmin);  // POST /api/admin/register-first
router.post("/login", loginAdmin);  // POST /api/admin/login

// Protected routes (require authentication)
router.use(protect);
router.use(admin);

// User management routes
router.route("/users")
  .get(getUsers);  // GET /api/admin/users

router.route("/users/verified")
  .get(getVerifiedUsers);  // GET /api/admin/users/verified

router.route("/users/unverified")
  .get(getUnverifiedUsers);  // GET /api/admin/users/unverified

router.route("/users/admin-verified")
  .get(getAdminVerifiedUsers);  // GET /api/admin/users/admin-verified

router.route("/users/:id")
  .get(getUserById);  // GET /api/admin/users/:id

router.route("/users/:id/approve")
  .put(approveUser);  // PUT /api/admin/users/:id/approve

router.route("/users/:id/reject")
  .put(rejectUser);  // PUT /api/admin/users/:id/reject

router.route("/users/stats")
  .get(getUserStats);  // GET /api/admin/users/stats

export default router; 