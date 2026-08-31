import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255).optional(),
  lastName: z.string().min(1, 'Last name is required').max(255).optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,20}$/, 'Invalid phone number format').optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other']).optional().or(z.literal('')),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional().or(z.literal('')),
});
