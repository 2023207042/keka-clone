import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const cardVariants = cva(
  'rounded-2xl transition-all duration-300 bg-[var(--bg-card)] text-[var(--text-primary)]',
  {
    variants: {
      variant: {
        default: 'border border-[var(--border-default)] shadow-sm',
        elevated: 'shadow-xl border-none',
        outlined: 'bg-transparent border-2 border-[var(--border-default)] shadow-none',
        filled: 'bg-[var(--color-surface-50)] border-none shadow-sm',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8',
        xl: 'p-10',
      },
      hoverable: {
        true: 'hover:shadow-lg hover:-translate-y-1 hover:border-[var(--color-primary-200)] cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hoverable: false,
    },
  }
);

export interface RNCardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const RNCard = forwardRef<HTMLDivElement, RNCardProps>(
  ({ className, variant, padding, hoverable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hoverable, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RNCard.displayName = 'RNCard';
