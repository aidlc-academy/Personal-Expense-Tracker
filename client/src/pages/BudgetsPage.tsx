import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, TrendingDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { BudgetProgressBar } from '../features/budgets/BudgetProgressBar';
import { useBudgetUtilization } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { useApiError } from '../hooks/useApiError';
import { rupeesToPaise, paiseToRupees, formatCurrency } from '../utils/currency';
import { currentMonthYear, monthName } from '../utils/date';
import * as budgetApi from '../api/budgets.api';
import type { BudgetUtilization } from '../types';

const schema = z.object({
  categoryId: z.coerce.number().int().positive('Select a category'),
  limitAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000),
});
type FormValues = z.infer<typeof schema>;

export function BudgetsPage() {
  const { month, year } = currentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BudgetUtilization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetUtilization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: budgets, isLoading, error: loadError, refetch } = useBudgetUtilization(selectedMonth, selectedYear);
  const { categories } = useCategories('EXPENSE');
  const { error: actionError, clearError, handleError } = useApiError();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { month: selectedMonth, year: selectedYear },
  });

  const openCreate = useCallback(() => {
    setEditTarget(null);
    reset({ month: selectedMonth, year: selectedYear, limitAmount: '', categoryId: 0 });
    setIsModalOpen(true);
  }, [selectedMonth, selectedYear, reset]);

  const openEdit = useCallback((b: BudgetUtilization) => {
    setEditTarget(b);
    reset({
      categoryId: b.budget.categoryId,
      limitAmount: paiseToRupees(b.budget.limitPaise),
      month: b.budget.month,
      year: b.budget.year,
    });
    setIsModalOpen(true);
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    clearError();
    try {
      if (editTarget) {
        await budgetApi.updateBudget(editTarget.budget.id, rupeesToPaise(data.limitAmount));
      } else {
        await budgetApi.createBudget({
          categoryId: data.categoryId,
          month: data.month,
          year: data.year,
          limitPaise: rupeesToPaise(data.limitAmount),
        });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) { handleError(err); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await budgetApi.deleteBudget(deleteTarget.budget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) { handleError(err); }
    finally { setIsDeleting(false); }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: monthName(i + 1) }));
  const years = Array.from({ length: 5 }, (_, i) => year - 2 + i);

  // Overview totals derived from real API data
  const totalBudget = budgets.reduce((s, b) => s + b.budget.limitPaise, 0);
  const totalSpent  = budgets.reduce((s, b) => s + b.spentPaise, 0);
  const totalLeft   = Math.max(0, totalBudget - totalSpent);

  return (
    <div>
      <PageHeader
        title="Budgets"
        subtitle="Set and track monthly spending limits"
        action={<Button size="sm" onClick={openCreate}><Plus size={15} /> Add Budget</Button>}
      />

      <div className="p-4 lg:p-6 space-y-5">
        {(loadError || actionError) && (
          <Alert message={loadError ?? actionError ?? ''} onClose={clearError} />
        )}

        {/* Month / Year selector */}
        <div className="flex items-center gap-2">
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-32"
            aria-label="Select month"
          >
            {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-24"
            aria-label="Select year"
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>

        {/* Overview summary — only shown when budgets exist */}
        {!isLoading && budgets.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Budget', value: formatCurrency(totalBudget), color: 'text-slate-200'   },
              { label: 'Total Spent',  value: formatCurrency(totalSpent),  color: 'text-red-400'     },
              { label: 'Remaining',    value: formatCurrency(totalLeft),   color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <Card key={label} padding="sm" className="text-center">
                <p className="text-[11px] uppercase tracking-widest text-slate-600 mb-1">{label}</p>
                <p className={`text-base font-bold font-tabular ${color}`}>{value}</p>
              </Card>
            ))}
          </div>
        )}

        {isLoading ? (
          <PageSpinner />
        ) : budgets.length === 0 ? (
          <EmptyState
            icon={<TrendingDown size={36} className="text-slate-700" />}
            title="No budgets for this month"
            description="Set spending limits to stay on track with your financial goals."
            action={<Button size="sm" onClick={openCreate}><Plus size={15} /> Add your first budget</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {budgets.map((b) => (
              <Card key={b.budget.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{b.budget.category.name}</p>
                    <p className="text-[11px] text-slate-600">{monthName(b.budget.month)} {b.budget.year}</p>
                  </div>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => openEdit(b)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                      aria-label="Edit budget"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(b)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      aria-label="Delete budget"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <BudgetProgressBar utilization={b} />

                {b.isExceeded && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
                    <AlertTriangle size={12} aria-hidden="true" />
                    Over by {formatCurrency(b.spentPaise - b.budget.limitPaise)}
                  </div>
                )}
                {b.isNearLimit && !b.isExceeded && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-400">
                    <AlertTriangle size={12} aria-hidden="true" />
                    {b.utilizationPercent.toFixed(0)}% used — approaching limit
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editTarget ? 'Edit Budget' : 'Add Budget'}
        size="sm"
      >
        {actionError && <Alert message={actionError} onClose={clearError} className="mb-4" />}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {!editTarget && (
            <Select label="Category" error={errors.categoryId?.message} {...register('categoryId')}>
              <option value="">Select an expense category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          )}
          <Input
            label="Budget limit (₹)"
            type="number"
            step="0.01"
            min="1"
            placeholder="e.g. 5000.00"
            error={errors.limitAmount?.message}
            {...register('limitAmount')}
          />
          {!editTarget && (
            <div className="flex gap-3">
              <Select label="Month" error={errors.month?.message} {...register('month')}>
                {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </Select>
              <Select label="Year" error={errors.year?.message} {...register('year')}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {editTarget ? 'Update' : 'Create'} Budget
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Budget" size="sm">
        <p className="text-sm text-slate-300 mb-6">
          Delete budget for{' '}
          <strong className="text-white">{deleteTarget?.budget.category.name}</strong>?
          {' '}Existing transactions are not affected.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={isDeleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
