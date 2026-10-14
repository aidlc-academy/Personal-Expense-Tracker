import { z } from 'zod';

export const createBudgetSchema = z.object({
  categoryId: z.number().int().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  limitPaise: z.number().int().positive('Budget limit must be a positive integer in paise'),
});

export const updateBudgetSchema = z.object({
  limitPaise: z.number().int().positive(),
});

export const budgetQuerySchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export const budgetParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
