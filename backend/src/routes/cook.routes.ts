import { Router } from "express";
import { CookController } from "../controllers/cook.controller.js";

const router = Router();

router.get("/", CookController.getAllCooks);
router.post("/", CookController.addCook);
router.get("/:id", CookController.getCookById);
router.put("/:id", CookController.updateCook);
router.patch("/:id/kitchen-status", CookController.updateKitchenStatus);
router.patch("/:id/kitchen-quantities", CookController.updateKitchenQuantities);
router.patch("/:id/weekly-menu", CookController.updateWeeklyMenu);
router.delete("/:id/weekly-menu", CookController.removeWeeklyMealSlot);
router.post("/:id/weekly-menu/autofill", CookController.autofillWeeklyMenu);
router.get("/:id/subscription-plans", CookController.getSubscriptionPlans);
router.put("/:id/subscription-plans", CookController.updateSubscriptionPlans);
router.get("/:id/subscribers", CookController.getSubscribers);
router.get("/:id/earnings", CookController.getEarnings);
router.delete("/:id", CookController.deleteCook);

export default router;
