import { cn } from '@/utils/composeStyles';

export interface RNTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const sideStyles = {
  top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2',
  bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-2',
  left: '-left-2 top-1/2 -translate-y-1/2 -translate-x-full mr-2',
  right: '-right-2 top-1/2 -translate-y-1/2 translate-x-full ml-2',
};

export function RNTooltip({ content, children, side = 'top', className }: RNTooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className={cn(
          "absolute z-50 scale-0 transition-all rounded-md bg-[var(--color-surface-900)] px-3 py-1.5 text-xs text-[var(--color-surface-50)] shadow-md group-hover:scale-100 whitespace-nowrap pointer-events-none",
          sideStyles[side],
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}
