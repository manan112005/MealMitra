import { z } from "zod";

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(2).max(150).trim().optional(),
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^[0-9+]+$/, "Phone number must contain only numbers and optional leading +")
    .optional()
    .nullable(),
  // Customer Profile fields
  dietaryPreferences: z.string().max(255).optional().nullable(),
  // Chef Profile fields
  bio: z.string().max(1000).optional().nullable(),
  cuisine: z.string().max(255).optional().nullable(),
  foodType: z.string().optional(),
  experienceYears: z.number().int().min(0).max(70).optional(),
  profileImage: z.string().url("Invalid image URL").optional().nullable(),
  fssaiLicense: z.string().max(100).optional().nullable(),
  isAvailable: z.boolean().optional(),
  // Kitchen details
  kitchenName: z.string().min(2).max(150).optional(),
  kitchenDescription: z.string().max(1000).optional().nullable(),
  kitchenAddress: z.string().optional(),
  serviceRadius: z.number().min(0.5).max(50).optional(),
  minimumOrder: z.number().min(0).optional(),
  openingTime: z.string().max(10).optional().nullable(),
  closingTime: z.string().max(10).optional().nullable(),
  // Delivery Profile fields
  vehicleType: z.string().max(50).optional().nullable(),
  vehicleNumber: z.string().max(50).optional().nullable(),
  licenseNumber: z.string().max(100).optional().nullable(),
  isOnline: z.boolean().optional(),
  currentLatitude: z.number().min(-90).max(90).optional().nullable(),
  currentLongitude: z.number().min(-180).max(180).optional().nullable(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
