import { apiClient } from './client';
import type { Category, ApiResponse } from '../types';

export async function getCategories(type?: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
  const params = type ? `?type=${type}` : '';
  const res = await apiClient.get<ApiResponse<Category[]>>(`/api/categories${params}`);
  return res.data.data;
}
