import { Role, CustomerProfile, ChefProfile, DeliveryPartnerProfile } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  customerProfile?: CustomerProfile | null;
  chefProfile?: ChefProfile | null;
  deliveryProfile?: DeliveryPartnerProfile | null;
}

export interface JWTAccessPayload {
  sub: string;
  email: string;
  role: Role;
  type: "access";
  iat?: number;
  exp?: number;
}

export interface JWTRefreshPayload {
  sub: string;
  tokenId: string;
  type: "refresh";
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface AuthResponseData {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: Role;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    customerProfile?: CustomerProfile | null;
    chefProfile?: ChefProfile | null;
    deliveryProfile?: DeliveryPartnerProfile | null;
  };
  tokens: AuthTokens;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
