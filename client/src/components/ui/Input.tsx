import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={cn(
            'h-10 w-full rounded-xl border bg-slate-950/60 px-3 text-sm text-slate-100',
            'placeholder:text-slate-600 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50',
            props.disabled ? 'opacity-40 cursor-not-allowed' : '',
            error
              ? 'border-red-500/60 focus:ring-red-400/40'
              : 'border-slate-800 hover:border-slate-700',
            className,
          )}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-600">{helperText}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
