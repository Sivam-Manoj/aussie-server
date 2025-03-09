import { Router } from 'express';
import { createPlayerController } from '../../controller/playerControllers/createPlayerController.js';
import { getPlayerController } from '../../controller/playerControllers/getPlayerController.js';

const router = Router();

router.post('/create', createPlayerController);
router.post('/get', getPlayerController);
export default router;
