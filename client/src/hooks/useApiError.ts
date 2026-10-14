import { useState, useCallback } from 'react';
import axios from 'axios';

export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const extractError = useCallback((err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string } | undefined;
      return data?.message ?? err.message ?? 'An unexpected error occurred';
    }
    if (err instanceof Error) return err.message;
    return 'An unexpected error occurred';
  }, []);

  const handleError = useCallback(
    (err: unknown) => {
      setError(extractError(err));
    },
    [extractError],
  );

  return { error, clearError, handleError, extractError };
}
