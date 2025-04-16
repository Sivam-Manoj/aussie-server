import { Router } from "express";
import { signupController } from "../../controller/userControllers/signup.controller.js";
import { signinController } from "../../controller/userControllers/signin.controller.js";
import { logoutController } from "../../controller/userControllers/logout.controller.js";
import { forgotPasswordController } from "../../controller/userControllers/forgotPassword.controller.js";
const router = Router();

// Public routes
router.post("/register", signupController); // Signup route
router.post("/login", signinController); // Signin route
router.delete("/logout", logoutController); // Logout route (protected)
router.post("/forgot-password", forgotPasswordController); // Forgot password route

export default router;
