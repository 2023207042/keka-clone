import { cn } from '@/utils/composeStyles';

export interface RNScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
}

export function RNScroll({ className, orientation = 'vertical', children, ...props }: RNScrollProps) {
  return (
    <div
      className={cn(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-surface-300)] hover:scrollbar-thumb-[var(--color-surface-400)]",
        orientation === 'vertical' ? "overflow-y-auto h-full w-full" : "overflow-x-auto w-full flex",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
