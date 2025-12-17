import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-[var(--color-surface-200)]',
  {
    variants: {
      size: {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
        xl: 'h-6',
      },
      variant: {
        default: '[&>div]:bg-[var(--color-primary-600)]',
        success: '[&>div]:bg-green-500',
        warning: '[&>div]:bg-amber-500',
        danger: '[&>div]:bg-red-500',
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface RNProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
}

const RNProgress = forwardRef<HTMLDivElement, RNProgressProps>(
  ({ className, value = 0, max = 100, size, variant, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(progressVariants({ size, variant, className }))}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
RNProgress.displayName = 'RNProgress';

export { RNProgress };
