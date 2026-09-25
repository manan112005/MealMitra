import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";

const router = Router();

router.get("/key", PaymentController.getKey);
router.post("/create-order", PaymentController.createOrder);
router.post("/verify", PaymentController.verifyPayment);

export default router;
