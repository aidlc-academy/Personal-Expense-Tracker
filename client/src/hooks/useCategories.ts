import { useState, useEffect } from 'react';
import * as api from '../api/categories.api';
import type { Category } from '../types';

export function useCategories(type?: 'INCOME' | 'EXPENSE') {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .getCategories(type)
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load categories');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [type]);

  return { categories, isLoading, error };
}
