import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { X } from 'lucide-react';

const modalVariants = cva(
  'relative z-50 flex w-full flex-col gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in-0 duration-200 outline-none', // Removed backdrop-blur-xl
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] h-[95vh]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const modalOverlayVariants = cva(
  'fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300', // Solid dark overlay
  {
    variants: {
      blur: {
        none: '',
        sm: '', // Removed blur
        md: '', // Removed blur
      },
    },
    defaultVariants: {
      blur: 'none', // Default to no blur for the overlay
    },
  }
);

export interface RNModalProps extends VariantProps<typeof modalVariants>, VariantProps<typeof modalOverlayVariants> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
  className?: string;
}

export function RNModal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
}: RNModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
        onClick={() => closeOnOverlayClick && onClose()}
        aria-hidden="true"
      />
      
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={cn(modalVariants({ size, className }))}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between">
            {title && <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-[var(--color-surface-100)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto text-sm leading-relaxed text-[var(--text-secondary)]">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 mt-auto border-t border-[var(--border-default)]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
