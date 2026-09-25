import { Router } from "express";
import { HealthController } from "../controllers/health.controller.js";

const router = Router();

// GET /api/v1/health
router.get("/health", HealthController.getHealth);

export default router;
