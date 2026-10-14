import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-slate-600">{icon}</div>
      )}
      <h3 className="mb-1 text-base font-semibold text-slate-300">{title}</h3>
      {description && <p className="mb-6 text-sm text-slate-500">{description}</p>}
      {action && action}
    </div>
  );
}
