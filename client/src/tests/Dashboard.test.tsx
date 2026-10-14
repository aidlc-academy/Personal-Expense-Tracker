import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { AuthContext } from '../stores/AuthContext';
import type { User } from '../types';

// Mock all API modules
vi.mock('../api/reports.api', () => ({
  getSummary: vi.fn().mockResolvedValue({
    totalIncomePaise: 10000000,
    totalExpensePaise: 6000000,
    balancePaise: 4000000,
    savingsRate: 40,
  }),
  getMonthlyData: vi.fn().mockResolvedValue([]),
  getCategorySpending: vi.fn().mockResolvedValue([]),
}));

vi.mock('../api/transactions.api', () => ({
  getTransactions: vi.fn().mockResolvedValue({ data: [], pagination: { total: 0, page: 1, limit: 5, totalPages: 0, hasNextPage: false, hasPrevPage: false } }),
}));

vi.mock('../api/budgets.api', () => ({
  getBudgetUtilization: vi.fn().mockResolvedValue([]),
}));

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  currency: 'INR',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function renderDashboard() {
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: mockUser,
          token: 'test-token',
          isLoading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          refreshUser: vi.fn(),
        }}
      >
        <DashboardPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders greeting with user name', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/hello, test/i)).toBeInTheDocument();
    });
  });

  it('displays summary stat cards', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/net balance/i)).toBeInTheDocument();
      expect(screen.getByText(/total income/i)).toBeInTheDocument();
      expect(screen.getByText(/total expenses/i)).toBeInTheDocument();
      expect(screen.getByText(/savings rate/i)).toBeInTheDocument();
    });
  });

  it('shows correct balance amount', async () => {
    renderDashboard();
    await waitFor(() => {
      // ₹40,000.00 (4000000 paise)
      expect(screen.getByText(/40,000/)).toBeInTheDocument();
    });
  });
});
