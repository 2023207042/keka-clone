import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { X } from 'lucide-react';
import { RNButton } from './RNButton';

const drawerVariants = cva(
  'fixed z-50 bg-[var(--color-surface-0)] shadow-2xl transition-all duration-300 ease-in-out p-6 flex flex-col',
  {
    variants: {
      side: {
        right: 'inset-y-0 right-0 h-full border-l border-[var(--border-default)] animate-in slide-in-from-right',
        left: 'inset-y-0 left-0 h-full border-r border-[var(--border-default)] animate-in slide-in-from-left',
        bottom: 'inset-x-0 bottom-0 border-t border-[var(--border-default)] animate-in slide-in-from-bottom',
        top: 'inset-x-0 top-0 border-b border-[var(--border-default)] animate-in slide-in-from-top',
      },
      size: {
        sm: 'w-64',
        md: 'w-80',
        lg: 'w-96',
        xl: 'w-[32rem]',
        full: 'w-screen h-screen',
        auto: 'w-auto'
      }
    },
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
    compoundVariants: [
        { side: 'bottom', class: 'w-full h-auto max-h-[90vh]' },
        { side: 'top', class: 'w-full h-auto max-h-[90vh]' }
    ]
  }
);

export interface RNDrawerProps extends VariantProps<typeof drawerVariants> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function RNDrawer({
  open,
  onClose,
  side,
  size,
  children,
  title,
  description,
  footer,
  closeOnOverlayClick = true,
  className,
}: RNDrawerProps) {

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity animate-in fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Drawer Content */}
      <div className={cn(drawerVariants({ side, size, className }))}>
         <div className="flex items-center justify-between mb-4">
             <div>
                {title && <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>}
                {description && <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>}
             </div>
             <RNButton variant="ghost" size="icon" onClick={onClose} className="-mr-2">
                 <X className="h-5 w-5" />
             </RNButton>
         </div>
         
         <div className="flex-1 overflow-y-auto">
             {children}
         </div>

         {footer && (
             <div className="mt-6 pt-4 border-t border-[var(--border-default)] flex justify-end gap-2">
                 {footer}
             </div>
         )}
      </div>
    </div>,
    document.body
  );
}
