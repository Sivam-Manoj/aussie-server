import { Router } from 'express';
import { createPlayerController } from '../../controller/playerControllers/createPlayerController.js';
import { getPlayerController } from '../../controller/playerControllers/getPlayerController.js';
import { deletePlayerController } from '../../controller/playerControllers/deletePlayerController.js';
import { updatePlayerController } from '../../controller/playerControllers/updatePlayerController.js';

const router = Router();

router.post('/create', createPlayerController);
router.post('/get', getPlayerController);
router.post('/delete',deletePlayerController);
router.post('/update',updatePlayerController)
export default router;
