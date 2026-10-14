import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          {...props}
          className={cn(
            'h-10 w-full rounded-xl border bg-slate-950/60 px-3 text-sm text-slate-100',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50',
            'transition-all duration-150 appearance-none cursor-pointer',
            error
              ? 'border-red-500/60'
              : 'border-slate-800 hover:border-slate-700',
            className,
          )}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
