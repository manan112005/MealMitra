import { memoryStore, getDefaultCookSubscriptionPlans } from "./store.service.js";
import { UserSubscription, SubscriptionPlan } from "../types/app.types.js";

export class SubscriptionService {
  public static getAllPlans(cookId?: string): SubscriptionPlan[] {
    if (cookId) {
      const cook = memoryStore.getCookById(cookId);
      return cook?.subscriptionPlans || getDefaultCookSubscriptionPlans("Home Cook", cookId);
    }
    const cooks = memoryStore.getCooks();
    const plans: SubscriptionPlan[] = [];
    cooks.forEach((c) => {
      if (c.subscriptionPlans) {
        plans.push(...c.subscriptionPlans);
      }
    });
    return plans;
  }

  public static getUserSubscription(): UserSubscription | null {
    return memoryStore.getUserSubscription();
  }

  public static createSubscription(data: Partial<UserSubscription>): UserSubscription {
    return memoryStore.createSubscription(data);
  }

  public static updateSubscription(id: string, updated: Partial<UserSubscription>): UserSubscription {
    const sub = memoryStore.updateSubscription(id, updated);
    if (!sub) {
      throw new Error(`Subscription with id ${id} not found`);
    }
    return sub;
  }

  public static skipMealSlot(subId: string, slotId: string, date: string, mealPeriod: "Lunch" | "Dinner") {
    const sub = subId ? (memoryStore.getSubscriptions().find((s) => s.id === subId) || memoryStore.getUserSubscription()) : memoryStore.getUserSubscription();
    if (!sub) {
      throw new Error("No active subscription found");
    }

    const skippedDates = sub.skippedDates ? [...sub.skippedDates] : [];
    if (!skippedDates.includes(date)) {
      skippedDates.push(date);
    }

    let upcomingMeals = sub.upcomingMeals ? [...sub.upcomingMeals] : [];
    const slotIdx = upcomingMeals.findIndex((m) => m.id === slotId || (m.date === date && m.mealPeriod === mealPeriod));

    if (slotIdx !== -1) {
      upcomingMeals[slotIdx] = {
        ...upcomingMeals[slotIdx],
        isSkipped: true,
      };
    }

    const updated = memoryStore.updateSubscription(sub.id, {
      skippedMealsCount: (sub.skippedMealsCount || 0) + 1,
      skippedDates,
      upcomingMeals,
    });

    return {
      success: true,
      message: `Meal for ${date} (${mealPeriod}) skipped successfully. Meal credit extended.`,
      subscription: updated,
    };
  }

  public static getCookSubscribers(cookId: string): UserSubscription[] {
    return memoryStore.getSubscriptions({ cookId });
  }
}
