import { cn } from '@/utils/composeStyles';

export interface RNSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function RNSeparator({ className, orientation = 'horizontal', ...props }: RNSeparatorProps) {
  return (
    <div
      className={cn(
        "shrink-0 bg-[var(--border-default)]",
        orientation === 'horizontal' ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}
