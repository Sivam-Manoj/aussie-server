import { Router } from "express";
import { signupController } from "../../controller/userControllers/signup.controller.js";
import { signinController } from "../../controller/userControllers/signin.controller.js";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);

export default router;
