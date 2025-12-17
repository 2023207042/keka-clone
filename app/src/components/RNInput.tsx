import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-app)] px-3 py-2 text-sm ring-offset-[var(--bg-app)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-[var(--color-primary-200)]',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-[var(--color-surface-50)] border-transparent hover:bg-[var(--color-surface-100)] focus-visible:bg-[var(--bg-app)]',
        error: 'border-red-500 focus-visible:ring-red-500 text-red-900 placeholder:text-red-300',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface RNInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const RNInput = forwardRef<HTMLInputElement, RNInputProps>(
  (
    {
      className,
      variant,
      inputSize,
      error,
      label,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      type,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = id || props.name || Math.random().toString(36).slice(2);
    
    // Determine the actual input type
    const isPasswordType = type === 'password';
    const currentType = isPasswordType && showPasswordToggle 
      ? (showPassword ? 'text' : 'password') 
      : type;

    // Determine variant based on error state
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
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            id={generatedId}
            type={currentType}
            className={cn(
              inputVariants({ variant: currentVariant, inputSize, className }),
              leftIcon && "pl-10",
              (rightIcon || (showPasswordToggle && isPasswordType)) && "pr-10"
            )}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          />

          {(showPasswordToggle && isPasswordType) ? (
             <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
               {rightIcon}
            </div>
          ) : null}
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
RNInput.displayName = 'RNInput';

export { RNInput };
