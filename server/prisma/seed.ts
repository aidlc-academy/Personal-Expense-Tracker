import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

const expenseCategories = [
  { name: 'Food & Dining', description: 'Groceries, restaurants, and food delivery', icon: 'UtensilsCrossed', type: 'EXPENSE' },
  { name: 'Transport', description: 'Fuel, public transport, and ride-sharing', icon: 'Car', type: 'EXPENSE' },
  { name: 'Housing', description: 'Rent, utilities, and home maintenance', icon: 'Home', type: 'EXPENSE' },
  { name: 'Entertainment', description: 'Movies, subscriptions, and hobbies', icon: 'Tv', type: 'EXPENSE' },
  { name: 'Health', description: 'Medical expenses, gym, and wellness', icon: 'Heart', type: 'EXPENSE' },
  { name: 'Shopping', description: 'Clothing, electronics, and general shopping', icon: 'ShoppingBag', type: 'EXPENSE' },
  { name: 'Education', description: 'Courses, books, and learning materials', icon: 'BookOpen', type: 'EXPENSE' },
  { name: 'Utilities', description: 'Electricity, water, internet, and phone bills', icon: 'Zap', type: 'EXPENSE' },
];

const incomeCategories = [
  { name: 'Salary', description: 'Monthly salary and wages', icon: 'Briefcase', type: 'INCOME' },
  { name: 'Freelance', description: 'Freelance and consulting income', icon: 'Laptop', type: 'INCOME' },
  { name: 'Investment', description: 'Dividends, interest, and investment returns', icon: 'TrendingUp', type: 'INCOME' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert categories
  for (const cat of [...expenseCategories, ...incomeCategories]) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // Demo user
  const existingDemo = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (existingDemo) {
    console.log('ℹ️  Demo user already exists — skipping user seed');
    return;
  }

  const passwordHash = await bcrypt.hash('Demo@1234', BCRYPT_ROUNDS);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash,
      currency: 'INR',
    },
  });
  console.log('✅ Demo user created:', demoUser.email);

  // Fetch category IDs
  const categories = await prisma.category.findMany();
  const catId = (name: string) => categories.find((c) => c.name === name)!.id;

  // Generate 6 months of demo transactions
  const now = new Date();
  const transactions: Parameters<typeof prisma.transaction.create>[0]['data'][] = [];

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const year = now.getMonth() - monthOffset < 0
      ? now.getFullYear() - 1
      : now.getFullYear();
    const month = ((now.getMonth() - monthOffset) % 12 + 12) % 12;

    // Salary income (1st of each month)
    transactions.push({
      userId: demoUser.id,
      categoryId: catId('Salary'),
      type: 'INCOME',
      amountPaise: 8500000 + Math.floor(Math.random() * 50000), // ~₹85,000
      description: 'Monthly salary',
      date: new Date(year, month, 1),
    });

    // Freelance income (random)
    if (Math.random() > 0.4) {
      transactions.push({
        userId: demoUser.id,
        categoryId: catId('Freelance'),
        type: 'INCOME',
        amountPaise: 1500000 + Math.floor(Math.random() * 1000000), // ₹15,000–₹25,000
        description: 'Freelance project payment',
        date: new Date(year, month, Math.floor(Math.random() * 20) + 1),
      });
    }

    // Regular expenses
    const expenseTemplates = [
      { cat: 'Housing', min: 2500000, max: 2500000, desc: 'Monthly rent' }, // ₹25,000 flat
      { cat: 'Food & Dining', min: 600000, max: 1200000, desc: 'Groceries & dining' },
      { cat: 'Transport', min: 200000, max: 600000, desc: 'Transport expenses' },
      { cat: 'Utilities', min: 250000, max: 400000, desc: 'Electricity & internet' },
      { cat: 'Health', min: 50000, max: 300000, desc: 'Medical & wellness' },
      { cat: 'Entertainment', min: 100000, max: 400000, desc: 'Movies & subscriptions' },
      { cat: 'Shopping', min: 200000, max: 800000, desc: 'General shopping' },
    ];

    for (const tmpl of expenseTemplates) {
      const amount = tmpl.min + Math.floor(Math.random() * (tmpl.max - tmpl.min));
      transactions.push({
        userId: demoUser.id,
        categoryId: catId(tmpl.cat),
        type: 'EXPENSE',
        amountPaise: amount,
        description: tmpl.desc,
        date: new Date(year, month, Math.floor(Math.random() * 25) + 1),
      });
    }
  }

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }
  console.log(`✅ ${transactions.length} demo transactions created`);

  // Demo budgets for current month
  const budgets = [
    { cat: 'Food & Dining', limit: 1500000 },
    { cat: 'Transport', limit: 600000 },
    { cat: 'Entertainment', limit: 500000 },
    { cat: 'Shopping', limit: 1000000 },
    { cat: 'Health', limit: 300000 },
  ];

  for (const b of budgets) {
    await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: demoUser.id,
          categoryId: catId(b.cat),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      },
      update: { limitPaise: b.limit },
      create: {
        userId: demoUser.id,
        categoryId: catId(b.cat),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        limitPaise: b.limit,
      },
    });
  }
  console.log('✅ Demo budgets created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
