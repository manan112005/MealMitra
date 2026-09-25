import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class PaymentController {
  public static getKey(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = PaymentService.getKey();
      return ResponseFormatter.success(res, data, "Razorpay Key retrieved successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, currency, receipt, notes } = req.body;
      if (!amount || amount <= 0) {
        return ResponseFormatter.error(res, "Invalid amount specified for payment order", 400);
      }

      const order = await PaymentService.createOrder({
        amount: Number(amount),
        currency,
        receipt,
        notes,
      });

      return ResponseFormatter.success(res, order, "Razorpay order generated successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  public static async verifyPayment(req: Request, res: Response, _next: NextFunction) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData, subscriptionData } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return ResponseFormatter.error(res, "Missing required Razorpay verification parameters", 400);
      }

      const result = PaymentService.verifyPayment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData,
        subscriptionData,
      });

      return ResponseFormatter.success(res, result, "Payment signature verified and processed successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Payment verification failed", 400);
    }
  }
}
