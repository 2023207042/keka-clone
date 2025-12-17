import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { AlertCircle } from 'lucide-react';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-app)] px-3 py-2 text-sm ring-offset-[var(--bg-app)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-[var(--color-primary-200)]',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-[var(--color-surface-50)] border-transparent hover:bg-[var(--color-surface-100)] focus-visible:bg-[var(--bg-app)]',
        error: 'border-red-500 focus-visible:ring-red-500 text-red-900 placeholder:text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface RNTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
}

export const RNTextarea = forwardRef<HTMLTextAreaElement, RNTextareaProps>(
  ({ className, variant, error, label, helperText, id, ...props }, ref) => {
    const generatedId = id || props.name || Math.random().toString(36).slice(2);
    const currentVariant = error ? 'error' : variant;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={generatedId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--text-primary)]",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        
        <textarea
          id={generatedId}
          className={cn(textareaVariants({ variant: currentVariant, className }))}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />

        {error && typeof error === 'string' && (
          <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">
             <AlertCircle className="h-3 w-3" /> {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-[var(--text-secondary)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
RNTextarea.displayName = 'RNTextarea';
