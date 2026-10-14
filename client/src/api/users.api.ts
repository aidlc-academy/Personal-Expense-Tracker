import { apiClient } from './client';
import type { User, ApiResponse } from '../types';

export async function getProfile(): Promise<User> {
  const res = await apiClient.get<ApiResponse<User>>('/api/users/profile');
  return res.data.data;
}

export async function updateProfile(data: { name?: string; currency?: string }): Promise<User> {
  const res = await apiClient.put<ApiResponse<User>>('/api/users/profile', data);
  return res.data.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiClient.put('/api/users/password', data);
}
