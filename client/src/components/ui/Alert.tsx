import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

const config = {
  error: { icon: AlertCircle, classes: 'bg-red-500/10 border-red-500/30 text-red-300' },
  success: { icon: CheckCircle, classes: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
  warning: { icon: AlertTriangle, classes: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
  info: { icon: Info, classes: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
};

interface AlertProps {
  variant?: AlertVariant;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({ variant = 'error', message, onClose, className }: AlertProps) {
  const { icon: Icon, classes } = config[variant];
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
        classes,
        className,
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
