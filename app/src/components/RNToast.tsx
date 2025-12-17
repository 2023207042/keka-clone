import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { Check, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

const toastVariants = cva(
  'fixed z-50 flex items-center gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full fade-in',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-card)] border-[var(--border-default)] text-[var(--text-primary)]',
        success: 'bg-[var(--bg-card)] border-green-200 text-green-700',
        error: 'bg-[var(--bg-card)] border-red-200 text-red-700',
        warning: 'bg-[var(--bg-card)] border-amber-200 text-amber-700',
      },
      position: {
        'bottom-right': 'bottom-4 right-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-left': 'top-4 left-4',
      }
    },
    defaultVariants: {
      variant: 'default',
      position: 'bottom-right',
    },
  }
);

export interface RNToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
}

const Icons = {
  default: <Info className="h-5 w-5 text-[var(--color-primary-500)]" />,
  success: <Check className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

export function RNToast({ message, isVisible, onClose, variant = 'default', position, duration = 3000 }: RNToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={cn(toastVariants({ variant, position }))}>
       <div className="shrink-0">{Icons[variant || 'default']}</div>
       <div className="text-sm font-medium">{message}</div>
    </div>
  );
}
