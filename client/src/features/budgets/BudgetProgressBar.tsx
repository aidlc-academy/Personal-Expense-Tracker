import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/currency';
import type { BudgetUtilization } from '../../types';

interface BudgetProgressBarProps {
  utilization: BudgetUtilization;
}

export function BudgetProgressBar({ utilization }: BudgetProgressBarProps) {
  const { budget, spentPaise, remainingPaise, utilizationPercent, isExceeded, isNearLimit } = utilization;

  const barColor = isExceeded ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-emerald-500';
  const pctColor = isExceeded ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{budget.category.name}</span>
        <span className={cn('text-xs font-semibold font-tabular', pctColor)}>
          {utilizationPercent.toFixed(0)}%
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn('h-full rounded-full transition-all duration-300', barColor)}
          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(utilizationPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${budget.category.name} budget ${Math.round(utilizationPercent)}% used`}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-600">
        <span>{formatCurrency(spentPaise)} spent</span>
        <span className={isExceeded ? 'text-red-500' : ''}>
          {isExceeded
            ? `${formatCurrency(spentPaise - budget.limitPaise)} over`
            : `${formatCurrency(remainingPaise)} left`
          }
        </span>
      </div>
    </div>
  );
}
