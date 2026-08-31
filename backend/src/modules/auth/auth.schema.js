import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(100),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').transform(e => e.toLowerCase()),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').transform(e => e.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
  sessionType: z.enum(['customer', 'admin']).default('customer'),
});
