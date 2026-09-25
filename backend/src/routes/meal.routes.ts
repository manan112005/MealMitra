import { Router } from "express";
import { MealController } from "../controllers/meal.controller.js";

const router = Router();

router.get("/", MealController.getAllMeals);
router.get("/today", MealController.getTodaysMeals);
router.get("/:id", MealController.getMealById);
router.post("/", MealController.createMeal);
router.put("/:id", MealController.updateMeal);
router.delete("/:id", MealController.deleteMeal);

export default router;
