import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = Router();

router.post("/", OrderController.placeOrder);
router.get("/customer", OrderController.getCustomerOrders);
router.get("/cook/:cookId", OrderController.getCookOrders);
router.patch("/:id/status", OrderController.updateOrderStatus);
router.post("/waitlist", OrderController.joinWaitlist);
router.get("/waitlist", OrderController.getWaitlist);

export default router;
