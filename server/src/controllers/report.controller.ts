import { Request, Response } from 'express';
import * as reportService from '../services/report.service';
import { asyncHandler } from '../utils/asyncHandler';

export const summary = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getSummary(req.userId!);
  res.json({ success: true, data });
});

export const monthly = asyncHandler(async (req: Request, res: Response) => {
  const months = parseInt((req.query['months'] as string) ?? '12', 10);
  const data = await reportService.getMonthlySummary(req.userId!, Math.min(24, Math.max(1, months)));
  res.json({ success: true, data });
});

export const categorySpending = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
  const data = await reportService.getCategorySpending(req.userId!, startDate, endDate);
  res.json({ success: true, data });
});
