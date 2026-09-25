import { api } from './api';
import { CookProfile, SubscriptionPlan, MealSlotItem } from '../types';

class CookService {
  async getCooks(): Promise<CookProfile[]> {
    const res = await api.get<CookProfile[]>('/cooks');
    return res.data || [];
  }

  async getCookById(id: string): Promise<CookProfile | null> {
    const res = await api.get<CookProfile>(`/cooks/${id}`);
    return res.data || null;
  }

  async addCook(cookData: Partial<CookProfile>): Promise<CookProfile> {
    const res = await api.post<CookProfile>('/cooks', cookData);
    return res.data!;
  }

  async updateCook(id: string, updated: Partial<CookProfile>): Promise<CookProfile> {
    const res = await api.put<CookProfile>(`/cooks/${id}`, updated);
    return res.data!;
  }

  async updateKitchenStatus(id: string, isOpen: boolean): Promise<CookProfile> {
    const res = await api.patch<CookProfile>(`/cooks/${id}/kitchen-status`, { isOpen });
    return res.data!;
  }

  async updateKitchenQuantities(
    id: string,
    lunchAvailable: number,
    lunchTotal: number,
    dinnerAvailable: number,
    dinnerTotal: number
  ): Promise<CookProfile> {
    const res = await api.patch<CookProfile>(`/cooks/${id}/kitchen-quantities`, {
      lunchAvailable,
      lunchTotal,
      dinnerAvailable,
      dinnerTotal,
    });
    return res.data!;
  }

  async updateWeeklyMenu(id: string, day: string, mealType: 'lunch' | 'dinner', menuData: MealSlotItem, days?: string[]): Promise<CookProfile> {
    const res = await api.patch<CookProfile>(`/cooks/${id}/weekly-menu`, {
      day,
      mealType,
      menuData,
      days,
    });
    return res.data!;
  }

  async removeWeeklyMealSlot(id: string, day: string, mealType: 'lunch' | 'dinner'): Promise<CookProfile> {
    const res = await api.delete<CookProfile>(`/cooks/${id}/weekly-menu`, {
      body: JSON.stringify({ day, mealType }),
    });
    return res.data!;
  }

  async autofillWeeklyMenu(id: string): Promise<CookProfile> {
    const res = await api.post<CookProfile>(`/cooks/${id}/weekly-menu/autofill`);
    return res.data!;
  }

  async getSubscriptionPlans(id: string): Promise<SubscriptionPlan[]> {
    const res = await api.get<SubscriptionPlan[]>(`/cooks/${id}/subscription-plans`);
    return res.data || [];
  }

  async updateSubscriptionPlans(id: string, plans: SubscriptionPlan[]): Promise<CookProfile> {
    const res = await api.put<CookProfile>(`/cooks/${id}/subscription-plans`, { plans });
    return res.data!;
  }

  async getSubscribers(id: string) {
    const res = await api.get(`/cooks/${id}/subscribers`);
    return res.data || [];
  }

  async getEarnings(id: string) {
    const res = await api.get(`/cooks/${id}/earnings`);
    return res.data;
  }

  async deleteCook(id: string): Promise<boolean> {
    const res = await api.delete(`/cooks/${id}`);
    return res.data?.success ?? true;
  }
}

export const cookService = new CookService();
