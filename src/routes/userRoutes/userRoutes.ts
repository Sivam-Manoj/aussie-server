import { Router } from "express";
import { signupController } from "../../controller/userControllers/signup.controller.js";
import { signinController } from "../../controller/userControllers/signin.controller.js";
import { logoutController } from "../../controller/userControllers/logout.controller.js";
import { resendVerificationEmail } from "../../controller/userControllers/signup.controller.js";
import { forgotPasswordVerifyController, verifyForgotPasswordController } from "../../controller/userControllers/forgotPassword.controller.js"; 
import { updatePasswordController } from "../../controller/userControllers/password.controller.js";
const router = Router();

// Public routes
router.post("/register", signupController); // Signup route
router.post("/login", signinController); // Signin route
router.delete("/logout", logoutController); // Logout route (protected)
router.post('/send-password-verification', forgotPasswordVerifyController); 
router.post("/password-verify", verifyForgotPasswordController); // Verify forgot password route
router.post("/resend-verification-email", resendVerificationEmail); // Resend verification email route
router.post("/update-password", updatePasswordController); // Update password route
export default router;
 