import { Router } from "express";
import { createPlayerController } from "../../controller/playerControllers/createPlayerController.js";
import { getPlayerController } from "../../controller/playerControllers/getPlayerController.js";
import { authMiddleware } from "../../middleware/auth/authMiddleware.js";
import { getOnePlayer } from "../../controller/playerControllers/getOneplayerController.js";
import { deletePlayersController } from "../../controller/playerControllers/deletePlayerController.js";

const router = Router();

router.post("/create", authMiddleware, createPlayerController);
router.post("/get", authMiddleware, getPlayerController);
router.get("/me", authMiddleware, getOnePlayer);
router.delete("/delete", authMiddleware, deletePlayersController);
export default router;
