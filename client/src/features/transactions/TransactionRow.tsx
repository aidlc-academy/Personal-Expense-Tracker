import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { cn } from '../../utils/cn';
import type { Transaction } from '../../types';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  const isIncome = transaction.type === 'INCOME';

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-3 transition-colors duration-100',
        onClick ? 'cursor-pointer hover:bg-slate-800/50' : '',
      )}
      onClick={onClick}
    >
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        isIncome ? 'bg-emerald-500/15' : 'bg-red-500/15',
      )}>
        {isIncome
          ? <ArrowUpCircle size={16} className="text-emerald-400" />
          : <ArrowDownCircle size={16} className="text-red-400" />
        }
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">
          {transaction.description || transaction.category.name}
        </p>
        <p className="text-[11px] text-slate-600">
          {transaction.category.name} · {formatDate(transaction.date)}
        </p>
      </div>

      <span className={cn(
        'shrink-0 text-sm font-semibold font-tabular',
        isIncome ? 'text-emerald-400' : 'text-red-400',
      )}>
        {isIncome ? '+' : '−'}{formatCurrency(transaction.amountPaise)}
      </span>
    </div>
  );
}
