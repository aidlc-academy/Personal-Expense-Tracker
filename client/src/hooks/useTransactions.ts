import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/transactions.api';
import type { Transaction, TransactionFilters, PaginatedResponse } from '../types';

interface UseTransactionsReturn {
  result: PaginatedResponse<Transaction> | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTransactions(filters: TransactionFilters = {}): UseTransactionsReturn {
  const [result, setResult] = useState<PaginatedResponse<Transaction> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api
      .getTransactions(filters)
      .then((data) => { if (!cancelled) setResult(data); })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load transactions');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, filters.page, filters.limit, filters.type, filters.categoryId, filters.search, filters.startDate, filters.endDate]);

  return { result, isLoading, error, refetch };
}
