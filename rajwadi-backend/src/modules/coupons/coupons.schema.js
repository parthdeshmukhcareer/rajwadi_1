import { z } from 'zod';

const baseCouponSchema = z.object({
  code: z.string().min(2).max(50).transform(s => s.trim().toUpperCase()),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().int().min(0),
  minimumOrderAmount: z.number().int().min(0).nullable().optional(),
  maximumDiscountAmount: z.number().int().min(0).nullable().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  isActive: z.boolean().default(true),
});

export const createCouponSchema = baseCouponSchema.refine(data => {
  if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) return false;
  return true;
}, {
  message: 'Percentage discount cannot exceed 100.',
  path: ['discountValue']
}).refine(data => {
  if (data.startsAt && data.expiresAt) {
    return new Date(data.expiresAt) > new Date(data.startsAt);
  }
  return true;
}, {
  message: 'expiresAt must be later than startsAt.',
  path: ['expiresAt']
});

export const updateCouponSchema = baseCouponSchema.partial().refine(data => {
  if (data.discountType === 'PERCENTAGE' && data.discountValue !== undefined && data.discountValue > 100) return false;
  return true;
}, {
  message: 'Percentage discount cannot exceed 100.',
  path: ['discountValue']
}).refine(data => {
  if (data.startsAt && data.expiresAt) {
    return new Date(data.expiresAt) > new Date(data.startsAt);
  }
  return true;
}, {
  message: 'expiresAt must be later than startsAt.',
  path: ['expiresAt']
});

export const updateCouponStatusSchema = z.object({ isActive: z.boolean() });
