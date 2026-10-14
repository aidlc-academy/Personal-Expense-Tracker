import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/budgets.api';
import type { BudgetUtilization } from '../types';

export function useBudgetUtilization(month?: number, year?: number) {
  const [data, setData] = useState<BudgetUtilization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api
      .getBudgetUtilization(month, year)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load budgets');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [tick, month, year]);

  return { data, isLoading, error, refetch };
}
