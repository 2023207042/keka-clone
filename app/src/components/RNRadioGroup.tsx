import React, { createContext, useContext, forwardRef } from 'react';
import { cn } from '@/utils/composeStyles';
import { RNLabel } from './RNLabel';

interface RadioGroupContextType {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType>({});

export interface RNRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RNRadioGroup = forwardRef<HTMLDivElement, RNRadioGroupProps>(
  ({ className, name, value, onValueChange, disabled, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider
        value={{ name, value, onChange: onValueChange, disabled }}
      >
        <div ref={ref} className={cn('grid gap-2', className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RNRadioGroup.displayName = 'RNRadioGroup';

export interface RNRadioItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  label?: string;
}

const RNRadioItem = forwardRef<HTMLInputElement, RNRadioItemProps>(
  ({ className, value, label, id, disabled, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    const uniqueId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const isChecked = context.value === value;
    const isDisabled = context.disabled || disabled;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            type="radio"
            ref={ref}
            id={uniqueId}
            name={context.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={() => context.onChange?.(value)}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-5 w-5 shrink-0 rounded-full border border-[var(--border-default)] text-[var(--color-primary-600)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              'flex items-center justify-center transition-all duration-200',
              isChecked ? 'border-[var(--color-primary-600)]' : 'hover:border-[var(--color-primary-400)]',
              className
            )}
            onClick={() => {
              if(!isDisabled) context.onChange?.(value);
            }}
          >
            <div
              className={cn(
                'h-2.5 w-2.5 rounded-full bg-current transition-transform duration-200',
                 isChecked ? 'scale-100' : 'scale-0'
              )}
            />
          </div>
        </div>
        {label && (
           <RNLabel
             htmlFor={uniqueId}
             label={label}
             variant="p2"
             className={cn("cursor-pointer", isDisabled && "opacity-50 cursor-not-allowed")}
           />
        )}
      </div>
    );
  }
);
RNRadioItem.displayName = 'RNRadioItem';

export { RNRadioGroup, RNRadioItem };
