import { Quote } from 'lucide-react';
import { cn } from '@/utils/composeStyles';

export interface RNQuoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  cite?: string;
  author?: string;
  role?: string;
}

export function RNQuote({ className, children, author, role, ...props }: RNQuoteProps) {
  return (
    <figure className={cn("relative pl-8 border-l-4 border-[var(--color-primary-500)]", className)}>
      <Quote className="absolute -top-2 -left-3 h-6 w-6 text-[var(--color-primary-200)] bg-[var(--bg-app)]" />
      <blockquote className="text-lg font-medium italic text-[var(--text-primary)] leading-relaxed" {...props}>
        {children}
      </blockquote>
      {(author || role) && (
        <figcaption className="mt-4 flex items-center gap-2 text-sm">
          <div className="font-semibold text-[var(--text-primary)]">— {author}</div>
          {role && (
             <>
               <span className="text-[var(--text-muted)]">•</span>
               <div className="text-[var(--text-secondary)]">{role}</div>
             </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
