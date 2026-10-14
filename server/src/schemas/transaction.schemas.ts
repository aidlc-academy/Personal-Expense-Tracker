import { z } from 'zod';

export const createTransactionSchema = z.object({
  categoryId: z.number().int().positive('Invalid category'),
  type: z.enum(['INCOME', 'EXPENSE']),
  amountPaise: z.number().int().positive('Amount must be a positive integer in paise'),
  description: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const transactionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
