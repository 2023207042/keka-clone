import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const tagVariants = cva(
  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface-100)] text-[var(--text-secondary)] ring-[var(--color-surface-200)]',
        primary: 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] ring-[var(--color-primary-200)]',
        secondary: 'bg-[var(--color-surface-100)] text-[var(--text-secondary)] ring-[var(--border-default)]',
        outline: 'text-[var(--text-primary)] ring-[var(--border-default)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface RNTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

export function RNTag({ className, variant, ...props }: RNTagProps) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />;
}
