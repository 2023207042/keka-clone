import React, { forwardRef } from 'react';
import { cn } from '@/utils/composeStyles';

export interface RNSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

const RNSlider = forwardRef<HTMLInputElement, RNSliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, label, showValue = false, ...props }, ref) => {
    // Calculate percentage for background gradient if needed, but simple CSS accent-color or range styling is easier for v1.
    // Tailwind v4 supports `accent-*` utilities for range inputs seamlessly.

    return (
      <div className={cn("grid gap-2", className)}>
        {label && (
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--text-primary)]">
                    {label}
                </label>
                {showValue && (
                    <span className="text-xs text-[var(--text-secondary)] font-mono">
                        {value}
                    </span>
                )}
            </div>
        )}
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          className={cn(
            "w-full h-2 bg-[var(--color-surface-200)] rounded-lg appearance-none cursor-pointer",
            "accent-[var(--color-primary-600)] hover:accent-[var(--color-primary-700)] transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]"
          )}
          {...props}
        />
      </div>
    );
  }
);
RNSlider.displayName = 'RNSlider';

export { RNSlider };
