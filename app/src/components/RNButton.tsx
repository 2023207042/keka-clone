import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        solid:
          'bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white shadow-md hover:shadow-lg hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-600)] border border-transparent',
        outline:
          'border-2 border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--color-surface-100)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-700)]',
        ghost:
          'hover:bg-[var(--color-surface-100)] text-[var(--text-secondary)] hover:text-[var(--color-primary-700)]',
        link: 'text-[var(--color-primary-600)] underline-offset-4 hover:underline h-auto p-0',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-md px-2 text-xs',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-2xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface RNButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const RNButton = forwardRef<HTMLButtonElement, RNButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wait
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
RNButton.displayName = 'RNButton';

export { RNButton, buttonVariants };
