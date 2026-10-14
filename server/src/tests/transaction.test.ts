import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';

const app = createApp();

const testUser = {
  name: 'TX Test User',
  email: 'txtest@example.com',
  password: 'TxTest1234',
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

describe('Transaction CRUD', () => {
  let txId: number;

  it('creates a transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryId,
        type: 'EXPENSE',
        amountPaise: 50000,
        description: 'Test expense',
        date: '2024-01-15',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.amountPaise).toBe(50000);
    txId = res.body.data.id as number;
  });

  it('lists transactions with pagination', async () => {
    const res = await request(app)
      .get('/api/transactions?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  it('gets a single transaction', async () => {
    const res = await request(app)
      .get(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(txId);
  });

  it('updates a transaction', async () => {
    const res = await request(app)
      .put(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amountPaise: 75000 });
    expect(res.status).toBe(200);
    expect(res.body.data.amountPaise).toBe(75000);
  });

  it('rejects negative amount', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryId,
        type: 'EXPENSE',
        amountPaise: -100,
        date: '2024-01-15',
      });
    expect(res.status).toBe(400);
  });

  it('prevents accessing another user\'s transaction', async () => {
    const otherUser = { name: 'Other', email: 'other_tx@example.com', password: 'Other1234' };
    const otherRes = await request(app).post('/api/auth/register').send(otherUser);
    const otherToken = otherRes.body.data.token as string;

    const res = await request(app)
      .get(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404); // appears not found to other user

    await prisma.user.deleteMany({ where: { email: otherUser.email } });
  });

  it('deletes a transaction', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('returns 404 for deleted transaction', async () => {
    const res = await request(app)
      .get(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
