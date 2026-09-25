import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(150, "Full name must not exceed 150 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address format")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9+]+$/, "Phone number must contain only numbers and optional leading +")
    .optional()
    .nullable(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must not exceed 128 characters"),
  role: z
    .enum(["CUSTOMER", "CHEF", "DELIVERY"])
    .default("CUSTOMER"),
  // Optional profile attributes at registration
  dietaryPreferences: z.string().max(255).optional(),
  kitchenName: z.string().min(2).max(150).optional(),
  cuisine: z.string().max(255).optional(),
  foodType: z.string().optional(),
  vehicleType: z.string().max(50).optional(),
  vehicleNumber: z.string().max(50).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email format").toLowerCase().trim().optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(1, "Password cannot be empty"),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone number must be provided for login",
    path: ["email"],
  });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token cannot be empty"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password cannot be empty"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(128, "New password must not exceed 128 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address format").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token cannot be empty"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(128, "New password must not exceed 128 characters"),
});

export const checkPhoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CheckPhoneInput = z.infer<typeof checkPhoneSchema>;
