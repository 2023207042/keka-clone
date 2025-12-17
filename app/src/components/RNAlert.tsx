import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-xl border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground pl-12 transition-all duration-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-app)] text-[var(--text-primary)] border-[var(--border-default)]',
        success: 'border-green-200 text-green-800 bg-green-50 [&>svg]:text-green-600',
        warning: 'border-amber-200 text-amber-800 bg-amber-50 [&>svg]:text-amber-600',
        error: 'border-red-200 text-red-800 bg-red-50 [&>svg]:text-red-600',
        info: 'border-blue-200 text-blue-800 bg-blue-50 [&>svg]:text-blue-600',
      },
      dismissible: {
        true: 'pr-10',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'info',
      dismissible: false,
    },
  }
);

export interface RNAlertProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const DefaultIcons = {
  default: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

export const RNAlert = forwardRef<HTMLDivElement, RNAlertProps>(
  ({ className, variant = 'info', title, dismissible, onDismiss, icon, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    const IconToRender = icon || DefaultIcons[variant || 'default'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, dismissible, className }))}
        {...props}
      >
        {IconToRender}
        <div className="flex flex-col gap-1">
          {title && <h5 className="mb-1 font-semibold leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-90 leading-relaxed font-medium">
            {children}
          </div>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-md p-1 opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
RNAlert.displayName = 'RNAlert';
