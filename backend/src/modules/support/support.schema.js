import { z } from 'zod';

export const supportQuerySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is too short').max(20),
  orderNumber: z.string().max(50).optional().nullable(),
  queryType: z.enum(['Order Query', 'Shipping Query', 'Product Query', 'Cancellation Query', 'Other']),
  message: z.string().min(1, 'Message is required'),
});
