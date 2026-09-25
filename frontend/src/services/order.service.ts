import { api } from './api';
import { Order, WaitlistEntry } from '../types';

class OrderService {
  async placeOrder(orderData: {
    mealId: string;
    quantity: number;
    address: string;
    phone: string;
    timeSlot: string;
    specialNotes?: string;
    bookingDate?: string;
    mealPeriod?: 'Lunch' | 'Dinner';
    fulfillmentType?: 'Delivery' | 'Pickup';
    bookingType?: 'one_time' | 'subscription';
    paymentMethod?: string;
    paymentId?: string;
  }): Promise<Order> {
    const res = await api.post<Order>('/orders', orderData);
    return res.data!;
  }

  async getCustomerOrders(phone?: string): Promise<Order[]> {
    const query = phone ? `?phone=${encodeURIComponent(phone)}` : '';
    const res = await api.get<Order[]>(`/orders/customer${query}`);
    return res.data || [];
  }

  async getCookOrders(cookId: string): Promise<Order[]> {
    const res = await api.get<Order[]>(`/orders/cook/${cookId}`);
    return res.data || [];
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const res = await api.patch<Order>(`/orders/${orderId}/status`, { status });
    return res.data!;
  }

  async joinWaitlist(entry: {
    cookId: string;
    cookName: string;
    mealId: string;
    mealName: string;
    customerName: string;
    customerPhone: string;
    date: string;
    mealPeriod: 'Lunch' | 'Dinner';
  }): Promise<WaitlistEntry> {
    const res = await api.post<WaitlistEntry>('/orders/waitlist', entry);
    return res.data!;
  }

  async getWaitlist(cookId?: string): Promise<WaitlistEntry[]> {
    const query = cookId ? `?cookId=${encodeURIComponent(cookId)}` : '';
    const res = await api.get<WaitlistEntry[]>(`/orders/waitlist${query}`);
    return res.data || [];
  }
}

export const orderService = new OrderService();
