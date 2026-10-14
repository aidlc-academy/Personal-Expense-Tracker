import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useApiError } from '../hooks/useApiError';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { cn } from '../utils/cn';
import * as txApi from '../api/transactions.api';
import type { TransactionFilters, Transaction } from '../types';

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 20 });
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { result, isLoading, error: loadError, refetch } = useTransactions(filters);
  const { categories } = useCategories();
  const { error: actionError, clearError, handleError } = useApiError();

  const updateFilter = useCallback(
    <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }, [],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await txApi.deleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      handleError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasFilters = !!(filters.type || filters.categoryId || filters.search || filters.startDate || filters.endDate);

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Your complete financial history"
        action={
          <Link to="/transactions/new">
            <Button size="sm"><Plus size={15} /> Add</Button>
          </Link>
        }
      />

      <div className="p-4 lg:p-6 space-y-4">
        {(loadError || actionError) && (
          <Alert message={loadError ?? actionError ?? ''} onClose={clearError} />
        )}

        {/* Filters */}
        <Card padding="sm">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <Input
                placeholder="Search…"
                className="pl-8"
                value={filters.search ?? ''}
                onChange={(e) => updateFilter('search', e.target.value || undefined)}
              />
            </div>
            <Select
              value={filters.type ?? ''}
              onChange={(e) => updateFilter('type', (e.target.value || undefined) as TransactionFilters['type'])}
              className="w-32"
            >
              <option value="">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </Select>
            <Select
              value={filters.categoryId ?? ''}
              onChange={(e) => updateFilter('categoryId', e.target.value ? Number(e.target.value) : undefined)}
              className="w-40"
            >
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Input
              type="date"
              value={filters.startDate ?? ''}
              onChange={(e) => updateFilter('startDate', e.target.value || undefined)}
              className="w-36"
              aria-label="Start date"
            />
            <Input
              type="date"
              value={filters.endDate ?? ''}
              onChange={(e) => updateFilter('endDate', e.target.value || undefined)}
              className="w-36"
              aria-label="End date"
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => setFilters({ page: 1, limit: 20 })}>
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          {isLoading ? (
            <PageSpinner />
          ) : !result?.data.length ? (
            <EmptyState
              icon={<Filter size={36} className="text-slate-700" />}
              title="No transactions found"
              description={hasFilters ? 'Try adjusting your filters.' : 'Add your first transaction to get started.'}
              action={
                <Link to="/transactions/new">
                  <Button size="sm"><Plus size={15} /> Add Transaction</Button>
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-widest text-slate-600">
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Description</th>
                      <th className="px-5 py-3 text-left hidden sm:table-cell">Category</th>
                      <th className="px-5 py-3 text-left hidden md:table-cell">Type</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.data.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors duration-100">
                        <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-200 max-w-[180px] truncate">
                          {tx.description || <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-500 hidden sm:table-cell">
                          {tx.category.name}
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <Badge variant={tx.type === 'INCOME' ? 'income' : 'expense'}>
                            {tx.type === 'INCOME' ? 'Income' : 'Expense'}
                          </Badge>
                        </td>
                        <td className={cn(
                          'px-5 py-3 text-sm font-semibold font-tabular text-right whitespace-nowrap',
                          tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400',
                        )}>
                          {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amountPaise)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={`/transactions/${tx.id}/edit`}>
                              <button
                                className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                                aria-label="Edit transaction"
                              >
                                <Pencil size={13} />
                              </button>
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(tx)}
                              className="rounded-lg p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              aria-label="Delete transaction"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.pagination.totalPages > 1 && (
                <div className="border-t border-slate-800 px-5 py-3">
                  <Pagination
                    pagination={result.pagination}
                    onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Transaction" size="sm">
        <p className="text-sm text-slate-300 mb-6">
          Delete{' '}
          <strong className="text-white">{deleteTarget?.description || deleteTarget?.category.name}</strong>
          {' '}for{' '}
          <strong className="text-white">{deleteTarget ? formatCurrency(deleteTarget.amountPaise) : ''}</strong>?
          {' '}This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={isDeleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
