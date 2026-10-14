import { Request, Response } from 'express';
import * as budgetService from '../services/budget.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateBudgetInput, UpdateBudgetInput } from '../schemas/budget.schemas';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.query as { month?: string; year?: string };
  const budgets = await budgetService.getBudgets(
    req.userId!,
    month ? parseInt(month, 10) : undefined,
    year ? parseInt(year, 10) : undefined,
  );
  res.json({ success: true, data: budgets });
});

export const getUtilization = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const month = parseInt((req.query['month'] as string) ?? String(now.getMonth() + 1), 10);
  const year = parseInt((req.query['year'] as string) ?? String(now.getFullYear()), 10);
  const utilization = await budgetService.getBudgetUtilization(req.userId!, month, year);
  res.json({ success: true, data: utilization });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.createBudget(req.userId!, req.body as CreateBudgetInput);
  res.status(201).json({ success: true, data: budget });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']!, 10);
  const budget = await budgetService.updateBudget(req.userId!, id, req.body as UpdateBudgetInput);
  res.json({ success: true, data: budget });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']!, 10);
  await budgetService.deleteBudget(req.userId!, id);
  res.json({ success: true, message: 'Budget deleted' });
});
