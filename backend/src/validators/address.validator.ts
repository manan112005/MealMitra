import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().min(1).max(50).default("HOME"),
  addressLine1: z.string().min(3, "Address line 1 must be at least 3 characters").max(255).trim(),
  addressLine2: z.string().max(255).optional().nullable(),
  city: z.string().min(2, "City is required").max(100).trim(),
  state: z.string().min(2, "State is required").max(100).trim(),
  postalCode: z.string().min(3, "Postal code is required").max(20).trim(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
