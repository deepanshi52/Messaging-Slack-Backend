import express from "express";

import { createWorkspaceController } from "../../controller/workspaceController.js";
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createworkspaceSchema } from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post('/',  isAuthenticated,
    validate(createworkspaceSchema),
     createWorkspaceController);

export default router;