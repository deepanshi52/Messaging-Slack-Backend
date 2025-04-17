import express from 'express';

import { getMessages } from '../../controller/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/messages/:channelId', isAuthenticated , getMessages);

export default router;
