import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/composeStyles';

type Item = { title: string; content: React.ReactNode };

export interface RNAccordionProps {
  items: Item[];
  className?: string;
}

export function RNAccordion({ items, className }: RNAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <div className={cn("w-full divide-y divide-[var(--border-default)] rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const panelId = `rn-accordion-panel-${i}`;
        const btnId = `rn-accordion-button-${i}`;
        return (
          <div key={i}>
            <button
              id={btnId}
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between p-4 font-medium transition-all hover:bg-[var(--color-surface-50)] text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-inset"
            >
              <span>{it.title}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform duration-200 text-[var(--text-muted)]", isOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn(
                "overflow-hidden text-sm transition-all duration-200 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
               <div className="p-4 pt-0 text-[var(--text-secondary)] leading-relaxed">
                  {it.content}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
