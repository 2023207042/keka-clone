import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const tabsListVariants = cva(
  'inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-surface-100)] p-1 text-[var(--text-muted)]',
  {
    variants: {
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--bg-app)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-sm',
  {
    variants: {
       fullWidth: {
        true: 'flex-1',
        false: '',
      },
    }
  }
);

export interface RNTabsProps extends VariantProps<typeof tabsListVariants> {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultActive?: string;
  className?: string;
}

export function RNTabs({ tabs, defaultActive, className, fullWidth }: RNTabsProps) {
  const [active, setActive] = useState(defaultActive || tabs[0]?.id);

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className={cn(tabsListVariants({ fullWidth }))}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            data-state={active === t.id ? 'active' : 'inactive'}
            className={cn(tabsTriggerVariants({ fullWidth }))}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2">
         {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
