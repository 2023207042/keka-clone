import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] shadow-md',
        secondary:
          'border-transparent bg-[var(--color-surface-200)] text-[var(--text-secondary)] hover:bg-[var(--color-surface-300)]',
        outline:
          'text-[var(--text-primary)] border border-[var(--border-default)]',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-600 shadow-md',
        warning:
          'border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-md',
        destructive:
          'border-transparent bg-red-500 text-white hover:bg-red-600 shadow-md',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: true,
    },
  }
);

export interface RNBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const RNBadge = forwardRef<HTMLSpanElement, RNBadgeProps>(
  ({ className, variant, size, rounded, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, rounded, className }))}
        {...props}
      >
        {children}
      </span>
    );
  }
);
RNBadge.displayName = 'RNBadge';
