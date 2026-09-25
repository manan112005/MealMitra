import { api } from './api';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'CUSTOMER' | 'CHEF' | 'DELIVERY';
  dietaryPreferences?: string;
  kitchenName?: string;
  cuisine?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  address?: string;
  city?: string;
}

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthUserResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'CHEF' | 'DELIVERY' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  customerProfile?: any;
  chefProfile?: any;
  deliveryProfile?: any;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export class AuthService {
  static async register(payload: RegisterPayload) {
    const res = await api.post<{ user: AuthUserResponse; tokens: AuthTokens }>('/auth/register', payload);
    if (res.success && res.data?.tokens) {
      api.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  }

  static async login(payload: LoginPayload) {
    const res = await api.post<{ user: AuthUserResponse; tokens: AuthTokens }>('/auth/login', payload);
    if (res.success && res.data?.tokens) {
      api.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  }

  static async checkPhone(phone: string) {
    return api.post<{ exists: boolean; user?: AuthUserResponse }>('/auth/check-phone', { phone });
  }

  static async getMe() {
    return api.get<AuthUserResponse>('/auth/me');
  }

  static async logout() {
    const refreshToken = api.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      api.clearTokens();
    }
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  }

  static async forgotPassword(email: string) {
    return api.post('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, newPassword: string) {
    return api.post('/auth/reset-password', { token, newPassword });
  }
}
