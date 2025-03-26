import { Router } from "express";
import { createPlayerController } from "../../controller/playerControllers/createPlayerController.js";
import { getPlayerController } from "../../controller/playerControllers/getPlayerController.js";
import { deletePlayerController } from "../../controller/playerControllers/deletePlayerController.js";
import { updatePlayerController } from "../../controller/playerControllers/updatePlayerController.js";
import { getOnePlayer } from "../../controller/playerControllers/getOneplayerController.js";
import { authMiddleware } from "../../middleware/auth/authMiddleware.js";

const router = Router();

router.post("/create", authMiddleware, createPlayerController);
router.post("/chat", authMiddleware, getPlayerController);
router.post("/delete", authMiddleware, deletePlayerController);
router.post("/update", authMiddleware, updatePlayerController);
router.get("/get", authMiddleware, getOnePlayer);
export default router;
