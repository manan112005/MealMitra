import { api } from './api';
import { Meal } from '../types';

class MealService {
  async getMeals(filters?: { cookId?: string; dietary?: string; mealType?: string }): Promise<Meal[]> {
    const params = new URLSearchParams();
    if (filters?.cookId) params.append('cookId', filters.cookId);
    if (filters?.dietary) params.append('dietary', filters.dietary);
    if (filters?.mealType) params.append('mealType', filters.mealType);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get<Meal[]>(`/meals${query}`);
    return res.data || [];
  }

  async getTodaysMeals() {
    const res = await api.get('/meals/today');
    return res.data;
  }

  async getMealById(id: string): Promise<Meal | null> {
    const res = await api.get<Meal>(`/meals/${id}`);
    return res.data || null;
  }

  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const res = await api.post<Meal>('/meals', meal);
    return res.data!;
  }

  async updateMeal(id: string, updated: Partial<Meal>): Promise<Meal> {
    const res = await api.put<Meal>(`/meals/${id}`, updated);
    return res.data!;
  }

  async deleteMeal(id: string): Promise<boolean> {
    const res = await api.delete(`/meals/${id}`);
    return res.data?.success ?? true;
  }
}

export const mealService = new MealService();
