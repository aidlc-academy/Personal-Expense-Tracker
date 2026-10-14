import { apiClient } from './client';
import type { User, ApiResponse } from '../types';

export interface AuthData {
  user: User;
  token: string;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthData> {
  const res = await apiClient.post<ApiResponse<AuthData>>('/api/auth/register', data);
  return res.data.data;
}

export async function login(data: { email: string; password: string }): Promise<AuthData> {
  const res = await apiClient.post<ApiResponse<AuthData>>('/api/auth/login', data);
  return res.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout');
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<ApiResponse<{ user: User }>>('/api/auth/me');
  return res.data.data.user;
}
