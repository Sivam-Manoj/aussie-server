import { Router } from "express";
import { verifyController } from "../../controller/jwtVerifyControllers/verify.controller.js";

const router = Router();

router.post("/verify", verifyController);


export default router;
