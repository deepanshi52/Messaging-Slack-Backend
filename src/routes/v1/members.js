import express from 'express';

import { getChannelByIdController } from '../../controller/channelController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/workspace/:workspaceId', isAuthenticated , getChannelByIdController);

export default router;
