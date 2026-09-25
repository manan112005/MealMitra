import { memoryStore, INITIAL_WEEKLY_MENU, getDefaultCookSubscriptionPlans } from "./store.service.js";
import { CookProfile, SubscriptionPlan, MealSlotItem } from "../types/app.types.js";

export class CookService {
  public static getAllCooks() {
    return memoryStore.getCooks();
  }

  public static getCookById(id: string) {
    const cook = memoryStore.getCookById(id);
    if (!cook) {
      throw new Error(`Cook with id ${id} not found`);
    }
    return cook;
  }

  public static addCook(data: Partial<CookProfile>) {
    return memoryStore.addCook(data);
  }

  public static updateCookProfile(id: string, updated: Partial<CookProfile>) {
    const cook = memoryStore.updateCook(id, updated);
    if (!cook) {
      throw new Error(`Cook with id ${id} not found`);
    }
    return cook;
  }

  public static updateKitchenStatus(id: string, isOpen: boolean) {
    return this.updateCookProfile(id, { isOpen });
  }

  public static updateKitchenQuantities(
    id: string,
    lunchAvail: number,
    lunchTotal: number,
    dinnerAvail: number,
    dinnerTotal: number
  ) {
    return this.updateCookProfile(id, {
      lunchAvailable: lunchAvail,
      lunchTotal: lunchTotal,
      dinnerAvailable: dinnerAvail,
      dinnerTotal: dinnerTotal,
    });
  }

  public static updateWeeklyMenu(cookId: string, day: string, mealType: "lunch" | "dinner", menuData: MealSlotItem) {
    const cook = this.getCookById(cookId);
    const weeklyMenu = cook.weeklyMenu ? [...cook.weeklyMenu] : [...INITIAL_WEEKLY_MENU];
    const dayIndex = weeklyMenu.findIndex((d) => d.day.toLowerCase() === day.toLowerCase());

    if (dayIndex !== -1) {
      weeklyMenu[dayIndex] = {
        ...weeklyMenu[dayIndex],
        [mealType]: menuData,
      };
    } else {
      weeklyMenu.push({
        day,
        lunch: mealType === "lunch" ? menuData : INITIAL_WEEKLY_MENU[0].lunch,
        dinner: mealType === "dinner" ? menuData : INITIAL_WEEKLY_MENU[0].dinner,
      });
    }

    return this.updateCookProfile(cookId, { weeklyMenu });
  }

  public static updateWeeklyMenuSlot(
    cookId: string,
    days: string[],
    mealType: "lunch" | "dinner",
    mealData: MealSlotItem
  ) {
    const cook = this.getCookById(cookId);
    let weeklyMenu = cook.weeklyMenu ? [...cook.weeklyMenu] : [...INITIAL_WEEKLY_MENU];

    days.forEach((targetDay) => {
      const dayIndex = weeklyMenu.findIndex((d) => d.day.toLowerCase() === targetDay.toLowerCase());
      if (dayIndex !== -1) {
        weeklyMenu[dayIndex] = {
          ...weeklyMenu[dayIndex],
          [mealType]: mealData,
        };
      }
    });

    return this.updateCookProfile(cookId, { weeklyMenu });
  }

  public static removeWeeklyMealSlot(cookId: string, day: string, mealType: "lunch" | "dinner") {
    const cook = this.getCookById(cookId);
    let weeklyMenu = cook.weeklyMenu ? [...cook.weeklyMenu] : [...INITIAL_WEEKLY_MENU];
    const dayIndex = weeklyMenu.findIndex((d) => d.day.toLowerCase() === day.toLowerCase());

    if (dayIndex !== -1) {
      const emptySlot: MealSlotItem = {
        mealTitle: "No Meal Scheduled",
        recipeTag: "Closed",
        special: "Not taking orders",
        mainDish: "Kitchen Closed for this slot",
        dal: "-",
        bread: "-",
        breadQty: 0,
        breadType: "-",
        breadGhee: false,
        rice: "-",
        sides: [],
        price: 0,
        dietary: "Vegetarian",
        timeSlot: mealType === "lunch" ? "12:30 PM - 2:00 PM" : "7:30 PM - 9:00 PM",
        maxOrders: 0,
        availableFor: mealType === "lunch" ? "Lunch" : "Dinner",
        image: "",
      };

      weeklyMenu[dayIndex] = {
        ...weeklyMenu[dayIndex],
        [mealType]: emptySlot,
      };
    }

    return this.updateCookProfile(cookId, { weeklyMenu });
  }

  public static autofillWeeklyMenu(cookId: string) {
    return this.updateCookProfile(cookId, { weeklyMenu: INITIAL_WEEKLY_MENU });
  }

  public static getSubscriptionPlans(cookId: string): SubscriptionPlan[] {
    const cook = memoryStore.getCookById(cookId);
    if (!cook) {
      return getDefaultCookSubscriptionPlans("Home Cook", cookId);
    }
    return cook.subscriptionPlans && cook.subscriptionPlans.length > 0
      ? cook.subscriptionPlans
      : getDefaultCookSubscriptionPlans(cook.name, cook.id);
  }

  public static updateSubscriptionPlans(cookId: string, plans: SubscriptionPlan[]) {
    return this.updateCookProfile(cookId, { subscriptionPlans: plans });
  }

  public static getSubscribers(cookId: string) {
    const allSubs = memoryStore.getSubscriptions();
    return allSubs.filter((s) => s.cookId === cookId || s.cookName === memoryStore.getCookById(cookId)?.name);
  }

  public static getCookEarnings(cookId: string) {
    const orders = memoryStore.getOrders({ cookId });
    const subscribers = this.getSubscribers(cookId);

    const oneTimeRevenue = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const subscriptionRevenue = subscribers
      .filter((s) => s.status === "Active")
      .reduce((sum, s) => sum + (s.pricePerMonth || 0), 0);

    const totalGrossRevenue = oneTimeRevenue + subscriptionRevenue;
    const platformCommission = Math.round(totalGrossRevenue * 0.08); // 8% platform fee
    const netEarnings = totalGrossRevenue - platformCommission;

    return {
      cookId,
      totalOrders: orders.length,
      activeSubscribersCount: subscribers.length,
      oneTimeRevenue,
      subscriptionRevenue,
      totalGrossRevenue,
      platformCommission,
      netEarnings,
      payoutAvailable: netEarnings,
      currency: "INR",
    };
  }

  public static deleteCook(cookId: string) {
    return memoryStore.deleteCook(cookId);
  }
}
