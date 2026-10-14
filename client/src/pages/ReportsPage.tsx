import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { PageSpinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { formatCurrency } from '../utils/currency';
import { cn } from '../utils/cn';
import * as reportsApi from '../api/reports.api';
import type { Summary, MonthlyData, CategorySpending } from '../types';

function MetricCard({ label, value, icon: Icon, colorClass }: {
  label: string; value: string; icon: LucideIcon; colorClass: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', colorClass)}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="mt-0.5 text-lg font-bold font-tabular text-white">{value}</p>
      </div>
    </Card>
  );
}

export function ReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly12, setMonthly12] = useState<MonthlyData[]>([]);
  const [catSpending, setCatSpending] = useState<CategorySpending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      reportsApi.getSummary(),
      reportsApi.getMonthlyData(12),
      reportsApi.getCategorySpending(),
    ])
      .then(([sum, mon, cat]) => { setSummary(sum); setMonthly12(mon); setCatSpending(cat); })
      .catch((err) => setError(err?.response?.data?.message ?? 'Failed to load reports'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Analyse your financial trends and patterns" />

      <div className="p-4 lg:p-6 space-y-5">
        {error && <Alert message={error} onClose={() => setError(null)} />}

        {/* Summary metrics */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <MetricCard label="Net Balance"    value={formatCurrency(summary.balancePaise)}      icon={Wallet}     colorClass="bg-blue-500/15 text-blue-400"    />
            <MetricCard label="Total Income"   value={formatCurrency(summary.totalIncomePaise)}  icon={TrendingUp}  colorClass="bg-emerald-500/15 text-emerald-400" />
            <MetricCard label="Total Expenses" value={formatCurrency(summary.totalExpensePaise)} icon={TrendingDown} colorClass="bg-red-500/15 text-red-400"       />
            <MetricCard label="Savings Rate"   value={`${summary.savingsRate}%`}                  icon={PiggyBank}  colorClass="bg-amber-500/15 text-amber-400"   />
          </div>
        )}

        {/* 12-month bar chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Income vs Expenses</h3>
            <span className="text-[11px] text-slate-600">Last 12 months</span>
          </div>
          {monthly12.length > 0
            ? <MonthlyChart data={monthly12} />
            : <p className="py-14 text-center text-sm text-slate-600">No data available yet</p>
          }
        </Card>

        {/* Category breakdown */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Spending by Category</h3>
              <span className="text-[11px] text-slate-600">This month</span>
            </div>
            <CategoryChart data={catSpending} />
          </Card>

          <Card padding="none">
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Category Breakdown</h3>
            </div>
            {catSpending.length === 0 ? (
              <p className="px-5 py-10 text-sm text-slate-600 text-center">No expense data for this period</p>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {catSpending.map((item, i) => {
                  const total = catSpending.reduce((s, x) => s + x.totalPaise, 0);
                  const pct = total > 0 ? ((item.totalPaise / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={item.categoryId} className="flex items-center gap-3 px-5 py-3">
                      <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{item.category?.name ?? 'Unknown'}</p>
                        <div className="mt-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold font-tabular text-slate-100">{formatCurrency(item.totalPaise)}</p>
                        <p className="text-[11px] text-slate-600">{pct}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Monthly summary table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Monthly Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-widest text-slate-600">
                  <th className="px-5 py-3 text-left">Month</th>
                  <th className="px-5 py-3 text-right">Income</th>
                  <th className="px-5 py-3 text-right">Expenses</th>
                  <th className="px-5 py-3 text-right">Net</th>
                  <th className="px-5 py-3 text-right hidden sm:table-cell">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[...monthly12].reverse().map((row) => {
                  const net = row.incomePaise - row.expensePaise;
                  const rate = row.incomePaise > 0 ? ((net / row.incomePaise) * 100).toFixed(1) : '0';
                  return (
                    <tr key={`${row.year}-${row.month}`} className="hover:bg-slate-800/30 transition-colors duration-100">
                      <td className="px-5 py-3 text-sm text-slate-400">{row.label}</td>
                      <td className="px-5 py-3 text-sm font-tabular text-emerald-400 text-right">{formatCurrency(row.incomePaise)}</td>
                      <td className="px-5 py-3 text-sm font-tabular text-red-400 text-right">{formatCurrency(row.expensePaise)}</td>
                      <td className={cn('px-5 py-3 text-sm font-semibold font-tabular text-right', net >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {net >= 0 ? '+' : '−'}{formatCurrency(Math.abs(net))}
                      </td>
                      <td className="px-5 py-3 text-sm font-tabular text-slate-500 text-right hidden sm:table-cell">{rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
