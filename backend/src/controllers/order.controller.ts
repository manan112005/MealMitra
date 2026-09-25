import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class OrderController {
  public static placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { mealId, quantity, address, phone, timeSlot, specialNotes, bookingDate, mealPeriod, fulfillmentType, bookingType, paymentMethod, paymentId } = req.body;

      if (!mealId || !address) {
        return ResponseFormatter.error(res, "Meal and delivery address are required", 400);
      }

      const order = OrderService.placeOrder(
        {
          mealId,
          quantity: quantity || 1,
          address,
          phone,
          timeSlot,
          specialNotes,
          bookingDate,
          mealPeriod,
          fulfillmentType,
          bookingType,
          paymentMethod,
          paymentId,
        },
        phone,
        req.user?.fullName
      );

      return ResponseFormatter.success(res, order, "Order placed successfully", 201);
    } catch (error) {
      return next(error);
    }
  }

  public static getCustomerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const phone = (req.query.phone as string) || req.user?.phone || undefined;
      const orders = OrderService.getCustomerOrders(phone);
      return ResponseFormatter.success(res, orders, "Orders fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static getCookOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const cookId = req.params.cookId as string;
      const orders = OrderService.getCookOrders(cookId);
      return ResponseFormatter.success(res, orders, "Cook orders fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  public static updateOrderStatus(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = OrderService.updateOrderStatus(id, status);
      return ResponseFormatter.success(res, updated, `Order status updated to ${status}`);
    } catch (error: any) {
      return ResponseFormatter.error(res, error.message || "Failed to update order status", 400);
    }
  }

  public static joinWaitlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { cookId, cookName, mealId, mealName, customerName, customerPhone, date, mealPeriod } = req.body;
      if (!cookId || !mealId || !customerPhone) {
        return ResponseFormatter.error(res, "Missing waitlist parameters", 400);
      }

      const entry = OrderService.joinWaitlist({
        cookId,
        cookName: cookName || "Cook",
        mealId,
        mealName: mealName || "Meal",
        customerName: customerName || req.user?.fullName || "Valued Customer",
        customerPhone,
        date: date || new Date().toISOString().split("T")[0],
        mealPeriod: mealPeriod || "Lunch",
      });

      return ResponseFormatter.success(res, entry, "Successfully added to waitlist! We will notify you once a slot opens.", 201);
    } catch (error) {
      return next(error);
    }
  }

  public static getWaitlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { cookId } = req.query;
      const waitlist = OrderService.getWaitlist(cookId as string);
      return ResponseFormatter.success(res, waitlist, "Waitlist fetched successfully");
    } catch (error) {
      return next(error);
    }
  }
}
