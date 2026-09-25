import { memoryStore } from "./store.service.js";
import { Meal } from "../types/app.types.js";

export class MealService {
  public static getAllMeals(filters?: { cookId?: string; dietary?: string; mealType?: string }) {
    return memoryStore.getMeals(filters);
  }

  public static getMealById(id: string) {
    const meal = memoryStore.getMealById(id);
    if (!meal) {
      throw new Error(`Meal with id ${id} not found`);
    }
    return meal;
  }

  public static createMeal(meal: Omit<Meal, "id"> & { id?: string }) {
    return memoryStore.addMeal(meal);
  }

  public static updateMeal(id: string, updated: Partial<Meal>) {
    const meal = memoryStore.updateMeal(id, updated);
    if (!meal) {
      throw new Error(`Meal with id ${id} not found`);
    }
    return meal;
  }

  public static deleteMeal(id: string) {
    return memoryStore.deleteMeal(id);
  }

  public static getTodaysMeals() {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = dayNames[new Date().getDay()];

    const cooks = memoryStore.getCooks();
    const todaysMeals: Array<{
      cookId: string;
      cookName: string;
      cookAvatar: string;
      day: string;
      lunch?: any;
      dinner?: any;
      lunchAvailable: number;
      lunchTotal: number;
      dinnerAvailable: number;
      dinnerTotal: number;
    }> = [];

    cooks.forEach((cook) => {
      const daySchedule = cook.weeklyMenu?.find((d) => d.day.toLowerCase() === currentDay.toLowerCase());
      if (daySchedule) {
        todaysMeals.push({
          cookId: cook.id,
          cookName: cook.name,
          cookAvatar: cook.image,
          day: currentDay,
          lunch: daySchedule.lunch,
          dinner: daySchedule.dinner,
          lunchAvailable: cook.lunchAvailable,
          lunchTotal: cook.lunchTotal,
          dinnerAvailable: cook.dinnerAvailable,
          dinnerTotal: cook.dinnerTotal,
        });
      }
    });

    return {
      currentDay,
      meals: todaysMeals,
      standaloneMeals: memoryStore.getMeals(),
    };
  }
}
