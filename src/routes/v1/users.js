import express from "express";

import { signIn, signUp } from "../../controller/userController.js";
import { 
    userSignInSchema, 
    userSignUpSchema,  
    } from "../../validators/userSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post('/signUp', validate(userSignUpSchema), signUp);
router.post('/signIn', validate(userSignInSchema), signIn);

export default router;