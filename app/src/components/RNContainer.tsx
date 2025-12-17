import { cn } from '@/utils/composeStyles';

// --- RNContainer ---
export function RNContainer({ 
  className, 
  children, 
  fluid = false 
}: { className?: string; children: React.ReactNode; fluid?: boolean }) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", fluid ? "max-w-full" : "max-w-7xl", className)}>
      {children}
    </div>
  );
}

// --- RNFooter ---
export function RNFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <footer className={cn("border-t border-[var(--border-default)] bg-[var(--bg-card)] py-8 mt-auto", className)}>
      <RNContainer>
         {children}
      </RNContainer>
    </footer>
  );
}

// --- RNView ---
export function RNView({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props}>{children}</div>;
}
