import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscription.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class SubscriptionController {
  public static getAllPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { cookId } = req.query;
      const plans = SubscriptionService.getAllPlans(cookId as string);
      return ResponseFormatter.success(res, plans, "Subscription plans fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static getUserSubscription(_req: Request, res: Response, next: NextFunction) {
    try {
      const sub = SubscriptionService.getUserSubscription();
      return ResponseFormatter.success(res, sub, "Customer subscription retrieved");
    } catch (error) {
      return next(error);
    }
  }

  public static createSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const sub = SubscriptionService.createSubscription(req.body);
      return ResponseFormatter.success(res, sub, "Subscription activated successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  public static updateSubscription(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = SubscriptionService.updateSubscription(id, req.body);
      return ResponseFormatter.success(res, updated, "Subscription updated successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update subscription", 400);
    }
  }

  public static skipMealSlot(req: Request, res: Response, _next: NextFunction) {
    try {
      const { subId, slotId, date, mealPeriod } = req.body;
      const result = SubscriptionService.skipMealSlot(subId, slotId, date, mealPeriod);
      return ResponseFormatter.success(res, result, result.message);
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to skip meal slot", 400);
    }
  }

  public static getCookSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const cookId = req.params.cookId as string;
      const subscribers = SubscriptionService.getCookSubscribers(cookId);
      return ResponseFormatter.success(res, subscribers, "Cook subscribers retrieved successfully");
    } catch (error) {
      return next(error);
    }
  }
}
