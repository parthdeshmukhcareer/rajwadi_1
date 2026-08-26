import { z } from 'zod';

export const addCartItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export const cartPreviewSchema = z.object({
  couponCode: z.string().min(1).max(50).transform(s => s.trim().toUpperCase()),
});
