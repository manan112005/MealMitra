import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller.js";

const router = Router();

router.get("/plans", SubscriptionController.getAllPlans);
router.get("/user", SubscriptionController.getUserSubscription);
router.post("/subscribe", SubscriptionController.createSubscription);
router.put("/:id", SubscriptionController.updateSubscription);
router.post("/skip-slot", SubscriptionController.skipMealSlot);
router.get("/cook/:cookId", SubscriptionController.getCookSubscribers);

export default router;
