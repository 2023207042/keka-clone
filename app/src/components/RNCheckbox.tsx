import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { Check } from 'lucide-react';
import { RNLabel } from './RNLabel';

const checkboxVariants = cva(
  'peer h-5 w-5 shrink-0 rounded border border-[var(--border-default)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-primary-600)] data-[state=checked]:border-[var(--color-primary-600)] data-[state=checked]:text-white transition-all duration-200 flex items-center justify-center',
  {
    variants: {
      color: {
        primary: 'data-[state=checked]:bg-[var(--color-primary-600)]',
        success: 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500',
        danger: 'data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500',
      }
    },
    defaultVariants: {
      color: 'primary',
    },
  }
);

export interface RNCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
}

const RNCheckbox = forwardRef<HTMLInputElement, RNCheckboxProps>(
  ({ className, color, label, id, ...props }, ref) => {
    const uniqueId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={uniqueId}
            ref={ref}
            className="peer sr-only "
            {...props}
          />
          <div
            className={cn(
              checkboxVariants({ color, className }),
              "flex items-center justify-center shrink-0", // Ensure flex centering and no shrink
              // Handle icon visibility: visible if checked (prop) or peer-checked (native)
              "[&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100 data-[state=checked]:[&_svg]:opacity-100"
            )}
            onClick={(e) => {
              // Trigger click on hidden input
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              input.click();
            }}
            data-state={props.checked ? 'checked' : 'unchecked'}
          >
           <Check strokeWidth={3} className="h-3.5 w-3.5 text-white transition-opacity duration-200 pointer-events-none" />
          </div>
        </div>
        {label && (
          <RNLabel
            htmlFor={uniqueId}
            label={label}
            variant="p2"
            className="cursor-pointer"
          />
        )}
      </div>
    );
  }
);
RNCheckbox.displayName = 'RNCheckbox';

export { RNCheckbox };
