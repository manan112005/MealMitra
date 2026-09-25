import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { updateUserProfileSchema } from "../validators/user.validator.js";

const router = Router();

// Protected User Profile Endpoints
router.get("/me", authenticate, UserController.getMe);
router.patch("/me", authenticate, validateBody(updateUserProfileSchema), UserController.updateMe);

export default router;
