import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/composeStyles';

interface BreadCrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface RNBreadCrumbProps {
  items: BreadCrumbItem[];
  className?: string;
}

export function RNBreadCrumb({ items, className }: RNBreadCrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm text-[var(--text-muted)]", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
           <a href="/" className="hover:text-[var(--color-primary-500)] transition-colors flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
           </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-[var(--text-muted)]/50" />
            {item.href && !item.active ? (
              <a
                href={item.href}
                className="hover:text-[var(--color-primary-500)] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "font-medium",
                  item.active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                )}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
