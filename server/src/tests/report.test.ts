import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';

const app = createApp();

const testUser = {
  name: 'Report Test',
  email: 'reporttest@example.com',
  password: 'Report1234',
};

let token: string;

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  const res = await request(app).post('/api/auth/register').send(testUser);
  token = res.body.data.token as string;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

describe('Reports', () => {
  it('returns summary with zero values for new user', async () => {
    const res = await request(app)
      .get('/api/reports/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalIncomePaise).toBe(0);
    expect(res.body.data.totalExpensePaise).toBe(0);
    expect(res.body.data.balancePaise).toBe(0);
    expect(res.body.data.savingsRate).toBe(0);
  });

  it('returns monthly data array', async () => {
    const res = await request(app)
      .get('/api/reports/monthly?months=6')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(6);
    expect(res.body.data[0]).toHaveProperty('year');
    expect(res.body.data[0]).toHaveProperty('month');
    expect(res.body.data[0]).toHaveProperty('incomePaise');
    expect(res.body.data[0]).toHaveProperty('expensePaise');
  });

  it('returns category spending', async () => {
    const res = await request(app)
      .get('/api/reports/category-spending')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
