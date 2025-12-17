import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const switchRootVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      checked: {
        true: 'bg-[var(--color-primary-600)]',
        false: 'bg-[var(--color-surface-300)]',
      },
      size: {
        sm: 'h-5 w-9',
        default: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      checked: false,
      size: 'default',
    },
  }
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
  {
    variants: {
      checked: {
        true: 'translate-x-5',
        false: 'translate-x-0',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    compoundVariants: [
      {
         checked: true,
         size: 'sm',
         class: 'translate-x-4'
      },
      {
         checked: true,
         size: 'lg',
         class: 'translate-x-7'
      }
    ],
    defaultVariants: {
      checked: false,
      size: 'default',
    },
  }
);

export interface RNSwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'>,
    VariantProps<typeof switchRootVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export const RNSwitch = forwardRef<HTMLButtonElement, RNSwitchProps>(
  ({ className, checked = false, onCheckedChange, label, size, disabled, ...props }, ref) => {
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onCheckedChange?.(!checked);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          ref={ref}
          className={cn(switchRootVariants({ checked, size, className }))}
          onClick={() => onCheckedChange?.(!checked)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <span
            className={cn(switchThumbVariants({ checked, size }))}
          />
        </button>
        {label && (
           <span 
             className={cn(
               "text-sm font-medium text-[var(--text-primary)] cursor-pointer select-none",
               disabled && "opacity-50 cursor-not-allowed"
             )}
             onClick={() => !disabled && onCheckedChange?.(!checked)}
           >
             {label}
           </span>
        )}
      </div>
    );
  }
);
RNSwitch.displayName = 'RNSwitch';
