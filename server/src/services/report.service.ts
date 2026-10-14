import { prisma } from '../config/prisma';

export async function getSummary(userId: number) {
  const [incomeAgg, expenseAgg] = await prisma.$transaction([
    prisma.transaction.aggregate({
      where: { userId, type: 'INCOME' },
      _sum: { amountPaise: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: 'EXPENSE' },
      _sum: { amountPaise: true },
    }),
  ]);

  const totalIncomePaise = incomeAgg._sum.amountPaise ?? 0;
  const totalExpensePaise = expenseAgg._sum.amountPaise ?? 0;
  const balancePaise = totalIncomePaise - totalExpensePaise;
  const savingsRate =
    totalIncomePaise > 0
      ? Math.round(((totalIncomePaise - totalExpensePaise) / totalIncomePaise) * 1000) / 10
      : 0;

  return { totalIncomePaise, totalExpensePaise, balancePaise, savingsRate };
}

export async function getMonthlySummary(userId: number, months = 12) {
  const now = new Date();
  const results = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [incomeAgg, expenseAgg] = await prisma.$transaction([
      prisma.transaction.aggregate({
        where: { userId, type: 'INCOME', date: { gte: startDate, lte: endDate } },
        _sum: { amountPaise: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE', date: { gte: startDate, lte: endDate } },
        _sum: { amountPaise: true },
      }),
    ]);

    results.push({
      year,
      month,
      label: date.toLocaleString('en-IN', { month: 'short', year: 'numeric' }),
      incomePaise: incomeAgg._sum.amountPaise ?? 0,
      expensePaise: expenseAgg._sum.amountPaise ?? 0,
    });
  }

  return results;
}

export async function getCategorySpending(
  userId: number,
  startDate?: string,
  endDate?: string,
) {
  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDate ? new Date(endDate + 'T23:59:59.999Z') : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

  const result = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, type: 'EXPENSE', date: { gte: start, lte: end } },
    _sum: { amountPaise: true },
    orderBy: { _sum: { amountPaise: 'desc' } },
  });

  const categoryIds = result.map((r) => r.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });
  const catMap = new Map(categories.map((c) => [c.id, c]));

  return result.map((r) => ({
    categoryId: r.categoryId,
    category: catMap.get(r.categoryId),
    totalPaise: r._sum.amountPaise ?? 0,
  }));
}
