import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).transform(s => s.trim().toLowerCase()),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
  fabric: z.string().max(255).optional(),
  workType: z.string().max(255).optional(),
  occasion: z.string().max(255).optional(),
  careInstruction: z.string().optional(),
  hsnCode: z.string().max(20).optional(),
  gstRate: z.number().int().min(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  sku: z.string().min(1).max(100).transform(s => s.trim().toUpperCase()),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
  stockOnHand: z.number().int().min(0).default(0),
  weightGrams: z.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

export const updateVariantSchema = createVariantSchema.omit({ sku: true, stockOnHand: true }).partial();

export const updateStockSchema = z.object({
  stockOnHand: z.number().int().min(0),
});
