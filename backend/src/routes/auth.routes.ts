import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  checkPhoneSchema,
} from "../validators/auth.validator.js";

const router = Router();

// Public Authentication Endpoints
router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/check-phone", validateBody(checkPhoneSchema), AuthController.checkPhone);
router.post("/refresh", validateBody(refreshTokenSchema), AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", validateBody(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), AuthController.resetPassword);

// Protected Authentication Endpoints
router.get("/me", authenticate, AuthController.getMe);
router.post("/change-password", authenticate, validateBody(changePasswordSchema), AuthController.changePassword);

export default router;
