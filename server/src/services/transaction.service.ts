import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination';
import type { CreateTransactionInput, UpdateTransactionInput } from '../schemas/transaction.schemas';

export async function getTransactions(
  userId: number,
  query: {
    page?: string;
    limit?: string;
    type?: 'INCOME' | 'EXPENSE';
    categoryId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  },
) {
  const pagination = parsePagination(query.page, query.limit);

  const where: Parameters<typeof prisma.transaction.findMany>[0]['where'] = {
    userId,
    ...(query.type ? { type: query.type } : {}),
    ...(query.categoryId ? { categoryId: parseInt(query.categoryId, 10) } : {}),
    ...(query.search
      ? { description: { contains: query.search } }
      : {}),
    ...(query.startDate || query.endDate
      ? {
          date: {
            ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
            ...(query.endDate ? { lte: new Date(query.endDate + 'T23:59:59.999Z') } : {}),
          },
        }
      : {}),
  };

  const [total, transactions] = await prisma.$transaction([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: pagination.skip,
      take: pagination.limit,
    }),
  ]);

  return buildPaginatedResponse(transactions, total, pagination);
}

export async function getTransactionById(userId: number, id: number) {
  const tx = await prisma.transaction.findFirst({
    where: { id, userId },
    include: { category: true },
  });
  if (!tx) throw ApiError.notFound('Transaction not found');
  return tx;
}

export async function createTransaction(userId: number, input: CreateTransactionInput) {
  // Validate category exists
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw ApiError.badRequest('Category not found');
  if (category.type !== input.type) {
    throw ApiError.badRequest(`Category "${category.name}" is a ${category.type} category but transaction type is ${input.type}`);
  }

  const tx = await prisma.transaction.create({
    data: {
      userId,
      categoryId: input.categoryId,
      type: input.type,
      amountPaise: input.amountPaise,
      description: input.description,
      date: new Date(input.date),
    },
    include: { category: true },
  });
  return tx;
}

export async function updateTransaction(
  userId: number,
  id: number,
  input: UpdateTransactionInput,
) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Transaction not found');

  // If category or type changes, validate consistency
  const newCategoryId = input.categoryId ?? existing.categoryId;
  const newType = input.type ?? existing.type;
  const category = await prisma.category.findUnique({ where: { id: newCategoryId } });
  if (!category) throw ApiError.badRequest('Category not found');
  if (category.type !== newType) {
    throw ApiError.badRequest(`Category "${category.name}" type mismatch`);
  }

  const tx = await prisma.transaction.update({
    where: { id },
    data: {
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.amountPaise !== undefined ? { amountPaise: input.amountPaise } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.date !== undefined ? { date: new Date(input.date) } : {}),
    },
    include: { category: true },
  });
  return tx;
}

export async function deleteTransaction(userId: number, id: number) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Transaction not found');
  await prisma.transaction.delete({ where: { id } });
}
