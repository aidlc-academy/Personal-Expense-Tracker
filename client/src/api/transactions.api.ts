import { apiClient } from './client';
import type {
  Transaction,
  TransactionFilters,
  CreateTransactionData,
  PaginatedResponse,
} from '../types';

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<PaginatedResponse<Transaction>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.type) params.set('type', filters.type);
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
  if (filters.search) params.set('search', filters.search);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);

  const res = await apiClient.get<PaginatedResponse<Transaction>>(
    `/api/transactions?${params.toString()}`,
  );
  return res.data;
}

export async function getTransaction(id: number): Promise<Transaction> {
  const res = await apiClient.get<{ data: Transaction }>(`/api/transactions/${id}`);
  return res.data.data;
}

export async function createTransaction(data: CreateTransactionData): Promise<Transaction> {
  const res = await apiClient.post<{ data: Transaction }>('/api/transactions', data);
  return res.data.data;
}

export async function updateTransaction(
  id: number,
  data: Partial<CreateTransactionData>,
): Promise<Transaction> {
  const res = await apiClient.put<{ data: Transaction }>(`/api/transactions/${id}`, data);
  return res.data.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`/api/transactions/${id}`);
}
