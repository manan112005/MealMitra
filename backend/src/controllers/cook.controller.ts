import { Request, Response, NextFunction } from "express";
import { CookService } from "../services/cook.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class CookController {
  public static getAllCooks(_req: Request, res: Response, next: NextFunction) {
    try {
      const cooks = CookService.getAllCooks();
      return ResponseFormatter.success(res, cooks, "Cooks fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static getCookById(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const cook = CookService.getCookById(id);
      return ResponseFormatter.success(res, cook, "Cook details retrieved successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Cook not found", 404);
    }
  }

  public static addCook(req: Request, res: Response, next: NextFunction) {
    try {
      const newCook = CookService.addCook(req.body);
      return ResponseFormatter.success(res, newCook, "Cook created successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  public static updateCook(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = CookService.updateCookProfile(id, req.body);
      return ResponseFormatter.success(res, updated, "Cook updated successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update cook", 400);
    }
  }

  public static updateKitchenStatus(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { isOpen } = req.body;
      const updated = CookService.updateKitchenStatus(id, Boolean(isOpen));
      return ResponseFormatter.success(res, updated, `Kitchen status set to ${isOpen ? "OPEN" : "CLOSED"}`);
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update kitchen status", 400);
    }
  }

  public static updateKitchenQuantities(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { lunchAvailable, lunchTotal, dinnerAvailable, dinnerTotal } = req.body;
      const updated = CookService.updateKitchenQuantities(
        id,
        Number(lunchAvailable),
        Number(lunchTotal),
        Number(dinnerAvailable),
        Number(dinnerTotal)
      );
      return ResponseFormatter.success(res, updated, "Kitchen quantities updated successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update kitchen quantities", 400);
    }
  }

  public static updateWeeklyMenu(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { day, mealType, menuData, days } = req.body;

      let updated;
      if (days && Array.isArray(days) && days.length > 0) {
        updated = CookService.updateWeeklyMenuSlot(id, days, mealType, menuData);
      } else {
        updated = CookService.updateWeeklyMenu(id, day, mealType, menuData);
      }

      return ResponseFormatter.success(res, updated, "Weekly menu slot updated successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update weekly menu", 400);
    }
  }

  public static removeWeeklyMealSlot(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { day, mealType } = req.body;
      const updated = CookService.removeWeeklyMealSlot(id, day, mealType);
      return ResponseFormatter.success(res, updated, "Weekly menu slot removed successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to remove weekly menu slot", 400);
    }
  }

  public static autofillWeeklyMenu(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = CookService.autofillWeeklyMenu(id);
      return ResponseFormatter.success(res, updated, "Weekly menu autofilled with traditional presets");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to autofill menu", 400);
    }
  }

  public static getSubscriptionPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const plans = CookService.getSubscriptionPlans(id);
      return ResponseFormatter.success(res, plans, "Subscription plans retrieved");
    } catch (error) {
      return next(error);
    }
  }

  public static updateSubscriptionPlans(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { plans } = req.body;
      const updated = CookService.updateSubscriptionPlans(id, plans);
      return ResponseFormatter.success(res, updated, "Cook subscription plans updated successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update subscription plans", 400);
    }
  }

  public static getSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const subscribers = CookService.getSubscribers(id);
      return ResponseFormatter.success(res, subscribers, "Subscribers retrieved successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static getEarnings(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const earnings = CookService.getCookEarnings(id);
      return ResponseFormatter.success(res, earnings, "Cook earnings retrieved successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static deleteCook(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const success = CookService.deleteCook(id);
      return ResponseFormatter.success(res, { success }, "Cook deleted successfully");
    } catch (error) {
      return next(error);
    }
  }
}
