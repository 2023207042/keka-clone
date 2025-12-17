import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { ChevronDown, AlertCircle } from 'lucide-react';

const selectVariants = cva(
  'flex w-full appearance-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-app)] px-3 py-2 text-sm ring-offset-[var(--bg-app)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-[var(--color-primary-200)]',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-[var(--color-surface-50)] border-transparent hover:bg-[var(--color-surface-100)] focus-visible:bg-[var(--bg-app)]',
        error: 'border-red-500 focus-visible:ring-red-500 text-red-900',
      },
      selectSize: {
        default: 'h-10',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'default',
    },
  }
);

export interface RNSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const RNSelect = forwardRef<HTMLSelectElement, RNSelectProps>(
  (
    {
      className,
      variant,
      selectSize,
      error,
      label,
      helperText,
      options,
      placeholder,
      id,
      children,
      ...props
    },
    ref
  ) => {
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
        
        <div className="relative">
          <select
            id={generatedId}
            className={cn(selectVariants({ variant: currentVariant, selectSize, className }))}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          >
             {placeholder && (
                <option value="" disabled selected>
                  {placeholder}
                </option>
              )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
          
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </div>

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

RNSelect.displayName = 'RNSelect';
