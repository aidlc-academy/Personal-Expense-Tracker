import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query as { type?: string };
  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: categories });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params['id']!, 10);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw ApiError.notFound('Category not found');
  res.json({ success: true, data: category });
});
