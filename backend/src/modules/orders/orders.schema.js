import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.string().uuid(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'COD']).default('RAZORPAY'),
});
