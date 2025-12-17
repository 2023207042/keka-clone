import { cn } from '@/utils/composeStyles';

export interface RNSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    circle?: boolean;
}

export function RNSkeleton({ className, circle, ...props }: RNSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--color-surface-200)]",
        circle ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  );
}
