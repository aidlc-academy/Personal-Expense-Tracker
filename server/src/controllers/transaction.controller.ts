import { Request, Response } from 'express';
import * as txService from '../services/transaction.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateTransactionInput, UpdateTransactionInput } from '../schemas/transaction.schemas';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await txService.getTransactions(req.userId!, req.query as Record<string, string>);
  res.json({ success: true, ...result });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']!, 10);
  const tx = await txService.getTransactionById(req.userId!, id);
  res.json({ success: true, data: tx });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const tx = await txService.createTransaction(req.userId!, req.body as CreateTransactionInput);
  res.status(201).json({ success: true, data: tx });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']!, 10);
  const tx = await txService.updateTransaction(req.userId!, id, req.body as UpdateTransactionInput);
  res.json({ success: true, data: tx });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']!, 10);
  await txService.deleteTransaction(req.userId!, id);
  res.json({ success: true, message: 'Transaction deleted' });
});
