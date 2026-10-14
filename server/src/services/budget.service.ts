import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import type { CreateBudgetInput, UpdateBudgetInput } from '../schemas/budget.schemas';

export async function getBudgets(userId: number, month?: number, year?: number) {
  return prisma.budget.findMany({
    where: {
      userId,
      ...(month ? { month } : {}),
      ...(year ? { year } : {}),
    },
    include: { category: true },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
}

export async function getBudgetUtilization(userId: number, month: number, year: number) {
  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
  });

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const results = await Promise.all(
    budgets.map(async (budget) => {
      const agg = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: 'EXPENSE',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amountPaise: true },
      });
      const spentPaise = agg._sum.amountPaise ?? 0;
      const utilization = budget.limitPaise > 0 ? (spentPaise / budget.limitPaise) * 100 : 0;
      return {
        budget,
        spentPaise,
        remainingPaise: Math.max(0, budget.limitPaise - spentPaise),
        utilizationPercent: Math.round(utilization * 10) / 10,
        isExceeded: spentPaise > budget.limitPaise,
        isNearLimit: utilization >= 80 && utilization <= 100,
      };
    }),
  );

  return results;
}

export async function createBudget(userId: number, input: CreateBudgetInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw ApiError.badRequest('Category not found');
  if (category.type !== 'EXPENSE') throw ApiError.badRequest('Budgets can only be set for expense categories');

  // Upsert: update if exists for same userId/categoryId/month/year
  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId: input.categoryId,
        month: input.month,
        year: input.year,
      },
    },
    update: { limitPaise: input.limitPaise },
    create: { userId, ...input },
    include: { category: true },
  });
  return budget;
}

export async function updateBudget(userId: number, id: number, input: UpdateBudgetInput) {
  const existing = await prisma.budget.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Budget not found');

  return prisma.budget.update({
    where: { id },
    data: { limitPaise: input.limitPaise },
    include: { category: true },
  });
}

export async function deleteBudget(userId: number, id: number) {
  const existing = await prisma.budget.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Budget not found');
  await prisma.budget.delete({ where: { id } });
}
