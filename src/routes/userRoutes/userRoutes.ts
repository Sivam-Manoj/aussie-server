import { Router } from "express";
import { signupController } from "../../controller/userControllers/signup.controller.js";
import { signinController } from "../../controller/userControllers/signin.controller.js";
import { logoutController } from "../../controller/userControllers/logout.controller.js";
const router = Router();

// Public routes
router.post("/register", signupController); // Signup route
router.post("/login", signinController); // Signin route
router.delete("/logout", logoutController); // Logout route (protected)

export default router;
