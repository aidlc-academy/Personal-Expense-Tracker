import { cn } from '../../utils/cn';

type BadgeVariant = 'income' | 'expense' | 'success' | 'warning' | 'danger' | 'default';

const variantClasses: Record<BadgeVariant, string> = {
  income: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  expense: 'bg-red-500/20 text-red-400 border-red-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  default: 'bg-slate-700 text-slate-300 border-slate-600',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
