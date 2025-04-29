import { Router } from "express";
import { createPlayerController } from "../../controller/playerControllers/createPlayerController.js";
import { getPlayerController } from "../../controller/playerControllers/getPlayerController.js";
import { deletePlayerController } from "../../controller/playerControllers/deletePlayerController.js";
import { updatePlayerController } from "../../controller/playerControllers/updatePlayerController.js";
import { getOnePlayer } from "../../controller/playerControllers/getOneplayerController.js";
import { upload } from "../../utils/multer/multerStorage.js";
import { getAllPlayers } from "../../controller/playerControllers/getAllPlayerController.js";
import { protect } from "../../middleware/auth/authMiddleware.js";

const router = Router();
// Route for creating a player, with file upload and authentication middleware
router.post("/create", protect, upload.single("file"), createPlayerController);

// Route for getting all players
router.get("/players", protect, getPlayerController);

// Route for deleting a player
router.delete("/player", protect, deletePlayerController);

// Route for updating a player
router.put("/update", protect, updatePlayerController);

// Route for getting a single player
router.get("/me", protect, getOnePlayer);

router.get("/all", protect, getAllPlayers);

export default router;
