import { api } from './api';
import { SubscriptionPlan, UserSubscription } from '../types';

class SubscriptionService {
  async getPlans(cookId?: string): Promise<SubscriptionPlan[]> {
    const query = cookId ? `?cookId=${encodeURIComponent(cookId)}` : '';
    const res = await api.get<SubscriptionPlan[]>(`/subscriptions/plans${query}`);
    return res.data || [];
  }

  async getUserSubscription(): Promise<UserSubscription | null> {
    const res = await api.get<UserSubscription>('/subscriptions/user');
    return res.data || null;
  }

  async createSubscription(subData: Partial<UserSubscription>): Promise<UserSubscription> {
    const res = await api.post<UserSubscription>('/subscriptions/subscribe', subData);
    return res.data!;
  }

  async updateSubscription(id: string, updated: Partial<UserSubscription>): Promise<UserSubscription> {
    const res = await api.put<UserSubscription>(`/subscriptions/${id}`, updated);
    return res.data!;
  }

  async skipMealSlot(subId: string, slotId: string, date: string, mealPeriod: 'Lunch' | 'Dinner') {
    const res = await api.post('/subscriptions/skip-slot', {
      subId,
      slotId,
      date,
      mealPeriod,
    });
    return res.data;
  }

  async getCookSubscribers(cookId: string): Promise<UserSubscription[]> {
    const res = await api.get<UserSubscription[]>(`/subscriptions/cook/${cookId}`);
    return res.data || [];
  }
}

export const subscriptionService = new SubscriptionService();
