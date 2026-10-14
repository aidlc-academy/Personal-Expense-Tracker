import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';

const app = createApp();

const testUser = {
  name: 'Budget Test',
  email: 'budgettest@example.com',
  password: 'Budget1234',
};

let token: string;
let categoryId: number;

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  const res = await request(app).post('/api/auth/register').send(testUser);
  token = res.body.data.token as string;

  const catRes = await request(app)
    .get('/api/categories?type=EXPENSE')
    .set('Authorization', `Bearer ${token}`);
  categoryId = catRes.body.data[0].id as number;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

describe('Budget CRUD', () => {
  let budgetId: number;
  const now = new Date();

  it('creates a budget', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        limitPaise: 500000,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.limitPaise).toBe(500000);
    budgetId = res.body.data.id as number;
  });

  it('updates a budget', async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ limitPaise: 750000 });
    expect(res.status).toBe(200);
    expect(res.body.data.limitPaise).toBe(750000);
  });

  it('gets budget utilization', async () => {
    const res = await request(app)
      .get(`/api/budgets/utilization?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('deletes a budget', async () => {
    const res = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
