import { apiClient } from './client';
import type { Summary, MonthlyData, CategorySpending, ApiResponse } from '../types';

export async function getSummary(): Promise<Summary> {
  const res = await apiClient.get<ApiResponse<Summary>>('/api/reports/summary');
  return res.data.data;
}

export async function getMonthlyData(months = 12): Promise<MonthlyData[]> {
  const res = await apiClient.get<ApiResponse<MonthlyData[]>>(
    `/api/reports/monthly?months=${months}`,
  );
  return res.data.data;
}

export async function getCategorySpending(
  startDate?: string,
  endDate?: string,
): Promise<CategorySpending[]> {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const res = await apiClient.get<ApiResponse<CategorySpending[]>>(
    `/api/reports/category-spending?${params.toString()}`,
  );
  return res.data.data;
}
