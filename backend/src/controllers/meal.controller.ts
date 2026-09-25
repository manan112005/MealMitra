import { Request, Response, NextFunction } from "express";
import { MealService } from "../services/meal.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class MealController {
  public static getAllMeals(req: Request, res: Response, next: NextFunction) {
    try {
      const { cookId, dietary, mealType } = req.query;
      const meals = MealService.getAllMeals({
        cookId: cookId as string,
        dietary: dietary as string,
        mealType: mealType as string,
      });
      return ResponseFormatter.success(res, meals, "Meals retrieved successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static getTodaysMeals(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = MealService.getTodaysMeals();
      return ResponseFormatter.success(res, data, "Today's slot meals retrieved successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static getMealById(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const meal = MealService.getMealById(id);
      return ResponseFormatter.success(res, meal, "Meal retrieved successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Meal not found", 404);
    }
  }

  public static createMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const meal = MealService.createMeal(req.body);
      return ResponseFormatter.success(res, meal, "Meal created successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  public static updateMeal(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = MealService.updateMeal(id, req.body);
      return ResponseFormatter.success(res, updated, "Meal updated successfully");
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update meal", 400);
    }
  }

  public static deleteMeal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const success = MealService.deleteMeal(id);
      return ResponseFormatter.success(res, { success }, "Meal deleted successfully");
    } catch (error) {
      return next(error);
    }
  }
}
