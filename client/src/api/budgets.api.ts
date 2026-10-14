import { apiClient } from './client';
import type { Budget, BudgetUtilization, CreateBudgetData, ApiResponse } from '../types';

export async function getBudgets(month?: number, year?: number): Promise<Budget[]> {
  const params = new URLSearchParams();
  if (month) params.set('month', String(month));
  if (year) params.set('year', String(year));
  const res = await apiClient.get<ApiResponse<Budget[]>>(`/api/budgets?${params.toString()}`);
  return res.data.data;
}

export async function getBudgetUtilization(
  month?: number,
  year?: number,
): Promise<BudgetUtilization[]> {
  const params = new URLSearchParams();
  if (month) params.set('month', String(month));
  if (year) params.set('year', String(year));
  const res = await apiClient.get<ApiResponse<BudgetUtilization[]>>(
    `/api/budgets/utilization?${params.toString()}`,
  );
  return res.data.data;
}

export async function createBudget(data: CreateBudgetData): Promise<Budget> {
  const res = await apiClient.post<ApiResponse<Budget>>('/api/budgets', data);
  return res.data.data;
}

export async function updateBudget(id: number, limitPaise: number): Promise<Budget> {
  const res = await apiClient.put<ApiResponse<Budget>>(`/api/budgets/${id}`, { limitPaise });
  return res.data.data;
}

export async function deleteBudget(id: number): Promise<void> {
  await apiClient.delete(`/api/budgets/${id}`);
}
