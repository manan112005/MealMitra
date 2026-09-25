import { memoryStore } from "./store.service.js";
import { Order, CreateOrderPayload, WaitlistEntry } from "../types/app.types.js";

export class OrderService {
  public static placeOrder(payload: CreateOrderPayload, customerPhone?: string, customerName?: string): Order {
    const meal = memoryStore.getMealById(payload.mealId);
    const cook = meal ? memoryStore.getCookById(meal.cookId) : memoryStore.getCooks()[0];

    const totalPrice = (meal?.price || 180) * (payload.quantity || 1);

    return memoryStore.createOrder({
      mealId: payload.mealId,
      mealName: meal?.name || "Homestyle Meal",
      cookId: cook?.id || "cook-1",
      cookName: cook?.name || "Home Cook",
      cookAvatar: cook?.image,
      quantity: payload.quantity || 1,
      totalPrice,
      deliveryAddress: payload.address,
      customerPhone: customerPhone || payload.phone || "+91 98765 43210",
      customerName: customerName || "Customer",
      deliveryTime: payload.timeSlot,
      specialNotes: payload.specialNotes,
      bookingDate: payload.bookingDate || new Date().toISOString().split("T")[0],
      mealPeriod: payload.mealPeriod || "Lunch",
      fulfillmentType: payload.fulfillmentType || "Delivery",
      bookingType: payload.bookingType || "one_time",
      paymentMethod: payload.paymentMethod || "Razorpay UPI",
      paymentId: payload.paymentId,
    });
  }

  public static getCustomerOrders(phone?: string): Order[] {
    return memoryStore.getOrders({ customerPhone: phone });
  }

  public static getCookOrders(cookId: string): Order[] {
    return memoryStore.getOrders({ cookId });
  }

  public static updateOrderStatus(orderId: string, status: Order["status"]): Order {
    const updated = memoryStore.updateOrderStatus(orderId, status);
    if (!updated) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    return updated;
  }

  public static joinWaitlist(entry: Omit<WaitlistEntry, "id" | "position" | "joinedAt" | "status">): WaitlistEntry {
    return memoryStore.joinWaitlist(entry);
  }

  public static getWaitlist(cookId?: string): WaitlistEntry[] {
    const list = memoryStore.getWaitlist();
    if (cookId) {
      return list.filter((w) => w.cookId === cookId);
    }
    return list;
  }
}
