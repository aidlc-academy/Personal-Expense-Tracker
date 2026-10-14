import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { PageSpinner } from '../components/ui/Spinner';
import { useCategories } from '../hooks/useCategories';
import { useApiError } from '../hooks/useApiError';
import { rupeesToPaise, paiseToRupees } from '../utils/currency';
import { toInputDateValue } from '../utils/date';
import * as txApi from '../api/transactions.api';

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.coerce.number().int().positive('Select a category'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount (e.g. 1500.00)'),
  description: z.string().max(500).optional(),
  date: z.string().min(1, 'Date is required'),
});
type FormValues = z.infer<typeof schema>;

export function TransactionFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const { categories } = useCategories(txType);
  const { error, clearError, handleError } = useApiError();
  const [isLoadingTx, setIsLoadingTx] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'EXPENSE',
      date: toInputDateValue(),
    },
  });

  const watchedType = watch('type');

  useEffect(() => {
    setTxType(watchedType);
  }, [watchedType]);

  useEffect(() => {
    if (!isEdit || !id) return;
    txApi
      .getTransaction(Number(id))
      .then((tx) => {
        reset({
          type: tx.type,
          categoryId: tx.categoryId,
          amount: paiseToRupees(tx.amountPaise),
          description: tx.description ?? '',
          date: tx.date.split('T')[0] ?? toInputDateValue(),
        });
        setTxType(tx.type);
      })
      .catch(handleError)
      .finally(() => setIsLoadingTx(false));
  }, [id, isEdit, reset, handleError]);

  const onSubmit = async (data: FormValues) => {
    clearError();
    try {
      const payload = {
        categoryId: data.categoryId,
        type: data.type,
        amountPaise: rupeesToPaise(data.amount),
        description: data.description || undefined,
        date: data.date,
      };

      if (isEdit && id) {
        await txApi.updateTransaction(Number(id), payload);
      } else {
        await txApi.createTransaction(payload);
      }
      navigate('/transactions');
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoadingTx) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
        subtitle={isEdit ? 'Update the details below' : 'Record a new income or expense'}
        action={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />

      <div className="p-6">
        <Card className="max-w-lg">
          {error && <Alert message={error} onClose={clearError} className="mb-5" />}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Type toggle */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">Transaction type</p>
              <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                {(['EXPENSE', 'INCOME'] as const).map((t) => (
                  <label
                    key={t}
                    className={`flex-1 cursor-pointer py-2.5 text-center text-sm font-medium transition-colors ${
                      watchedType === t
                        ? t === 'EXPENSE'
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value={t}
                      className="sr-only"
                      {...register('type')}
                    />
                    {t === 'EXPENSE' ? 'Expense' : 'Income'}
                  </label>
                ))}
              </div>
            </div>

            <Select
              label="Category"
              error={errors.categoryId?.message}
              {...register('categoryId')}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Input
              label="Amount (₹)"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              helperText="Enter the amount in Rupees (e.g. 1500.00)"
              {...register('amount')}
            />

            <Input
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />

            <Input
              label="Description (optional)"
              type="text"
              placeholder="What was this for?"
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1">
                {isEdit ? 'Update' : 'Add'} Transaction
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
