import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageSpinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { TransactionRow } from '../features/transactions/TransactionRow';
import { BudgetProgressBar } from '../features/budgets/BudgetProgressBar';
import * as reportsApi from '../api/reports.api';
import * as txApi from '../api/transactions.api';
import * as budgetApi from '../api/budgets.api';
import { formatCurrency } from '../utils/currency';
import { currentMonthYear } from '../utils/date';
import { cn } from '../utils/cn';
import type { Summary, MonthlyData, CategorySpending, Transaction, BudgetUtilization } from '../types';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

function StatCard({ label, value, icon: Icon, trend = 'neutral', subtitle }: StatCardProps) {
  const colors = {
    up:      { ring: 'bg-emerald-500/15', icon: 'text-emerald-400' },
    down:    { ring: 'bg-red-500/15',     icon: 'text-red-400'     },
    neutral: { ring: 'bg-blue-500/15',    icon: 'text-blue-400'    },
  }[trend];
  return (
    <Card className="flex items-center gap-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', colors.ring)}>
        <Icon size={20} className={colors.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="mt-0.5 text-xl font-bold font-tabular text-white truncate">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { month, year } = currentMonthYear();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [catSpending, setCatSpending] = useState<CategorySpending[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetUtilization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      reportsApi.getSummary(),
      reportsApi.getMonthlyData(6),
      reportsApi.getCategorySpending(),
      txApi.getTransactions({ limit: 5 }),
      budgetApi.getBudgetUtilization(month, year),
    ])
      .then(([sum, mon, cat, txRes, bud]) => {
        setSummary(sum);
        setMonthly(mon);
        setCatSpending(cat);
        setRecentTx(txRes.data);
        setBudgets(bud);
      })
      .catch((err) => setError(err?.response?.data?.message ?? 'Failed to load dashboard data'))
      .finally(() => setIsLoading(false));
  }, [month, year]);

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name.split(' ')[0] ?? 'there'} 👋`}
        subtitle={today}
        action={
          <Link to="/transactions/new">
            <Button size="sm">
              <Plus size={15} />
              Add Transaction
            </Button>
          </Link>
        }
      />

      <div className="p-4 lg:p-6 space-y-5">
        {error && <Alert message={error} onClose={() => setError(null)} />}

        {/* ── Summary cards ──────────────────────────── */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Net Balance"
              value={formatCurrency(summary.balancePaise)}
              icon={Wallet}
              trend={summary.balancePaise >= 0 ? 'up' : 'down'}
            />
            <StatCard
              label="Total Income"
              value={formatCurrency(summary.totalIncomePaise)}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(summary.totalExpensePaise)}
              icon={TrendingDown}
              trend="down"
            />
            <StatCard
              label="Savings Rate"
              value={`${summary.savingsRate}%`}
              icon={PiggyBank}
              trend={summary.savingsRate >= 20 ? 'up' : 'neutral'}
              subtitle="of total income"
            />
          </div>
        )}

        {/* ── Charts ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Income vs Expenses</h3>
              <span className="text-[11px] text-slate-600">Last 6 months</span>
            </div>
            {monthly.length > 0
              ? <MonthlyChart data={monthly} />
              : <p className="py-14 text-center text-sm text-slate-600">No data yet</p>
            }
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Spending by Category</h3>
              <span className="text-[11px] text-slate-600">This month</span>
            </div>
            <CategoryChart data={catSpending} />
          </Card>
        </div>

        {/* ── Bottom row ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent transactions */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Recent Transactions</h3>
              <Link to="/transactions" className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-800/60">
              {recentTx.length === 0
                ? <p className="px-5 py-10 text-center text-sm text-slate-600">No transactions yet</p>
                : recentTx.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
              }
            </div>
          </Card>

          {/* Budget status */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Budget Status</h3>
              <Link to="/budgets" className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {budgets.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-slate-600 mb-3">No budgets set for this month</p>
                  <Link to="/budgets">
                    <Button variant="secondary" size="sm"><Plus size={13} /> Set budgets</Button>
                  </Link>
                </div>
              )
              : (
                <div className="space-y-4">
                  {budgets.map((b) => <BudgetProgressBar key={b.budget.id} utilization={b} />)}
                </div>
              )
            }
          </Card>
        </div>
      </div>
    </div>
  );
}
