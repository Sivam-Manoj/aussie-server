import { Router } from "express";
import { createPlayerController } from "../../controller/playerControllers/createPlayerController.js";
import { getPlayerController } from "../../controller/playerControllers/getPlayerController.js";
import { deletePlayerController } from "../../controller/playerControllers/deletePlayerController.js";
import { updatePlayerController } from "../../controller/playerControllers/updatePlayerController.js";
import { getOnePlayer } from "../../controller/playerControllers/getOneplayerController.js";
import { authMiddleware } from "../../middleware/auth/authMiddleware.js";
import { upload } from "../../utils/multer/multerStorage.js";
import { getAllPlayers } from "../../controller/playerControllers/getAllPlayerController.js";

const router = Router();

// Route for creating a player, with file upload and authentication middleware
router.post(
  "/create",
  authMiddleware,
  upload.single("file"),
  createPlayerController
);

// Route for getting all players (GET method should be used for data retrieval)
router.get("/get", authMiddleware, getPlayerController);

// Route for deleting a player
router.post("/delete", authMiddleware, deletePlayerController);

// Route for updating a player
router.put("/update", authMiddleware, updatePlayerController);

// Route for getting a single player
router.get("/me", authMiddleware, getOnePlayer);

router.get("/all", authMiddleware, getAllPlayers);

export default router;
