import { z } from 'zod';

export const createAddressSchema = z.object({
  fullName: z.string().min(2).max(255),
  phone: z.string().min(10).max(20),
  addressLine1: z.string().min(5).max(255),
  addressLine2: z.string().max(255).optional(),
  landmark: z.string().max(255).optional(),
  city: z.string().min(2).max(255),
  district: z.string().max(255).optional(),
  state: z.string().min(2).max(255),
  postalCode: z.string().min(5).max(20),
  country: z.string().max(255).default('India'),
  addressType: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();
