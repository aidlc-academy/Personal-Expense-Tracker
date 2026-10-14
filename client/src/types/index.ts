export type TransactionType = 'INCOME' | 'EXPENSE';
export type CategoryType = 'INCOME' | 'EXPENSE';

export interface User {
  id: number;
  name: string;
  email: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  type: CategoryType;
}

export interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  type: TransactionType;
  amountPaise: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  month: number;
  year: number;
  limitPaise: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface BudgetUtilization {
  budget: Budget;
  spentPaise: number;
  remainingPaise: number;
  utilizationPercent: number;
  isExceeded: boolean;
  isNearLimit: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Summary {
  totalIncomePaise: number;
  totalExpensePaise: number;
  balancePaise: number;
  savingsRate: number;
}

export interface MonthlyData {
  year: number;
  month: number;
  label: string;
  incomePaise: number;
  expensePaise: number;
}

export interface CategorySpending {
  categoryId: number;
  category: Category;
  totalPaise: number;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  categoryId?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTransactionData {
  categoryId: number;
  type: TransactionType;
  amountPaise: number;
  description?: string;
  date: string;
}

export interface CreateBudgetData {
  categoryId: number;
  month: number;
  year: number;
  limitPaise: number;
}
