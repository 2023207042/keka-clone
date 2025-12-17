import { useState, useRef, forwardRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';

const batchInputVariants = cva(
  'flex w-full flex-wrap gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-app)] px-2 py-2 text-sm ring-offset-[var(--bg-app)] focus-within:ring-2 focus-within:ring-[var(--color-primary-500)] focus-within:ring-offset-1 transition-all duration-200',
  {
    variants: {
      error: {
        true: 'border-red-500 focus-within:ring-red-500',
        false: 'hover:border-[var(--color-primary-200)]',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed bg-[var(--color-surface-50)]',
        false: '',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

export interface RNBatchInputProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string | boolean;
  helperText?: string;
  disabled?: boolean;
  maxTags?: number;
  className?: string;
}

export const RNBatchInput = forwardRef<HTMLInputElement, RNBatchInputProps>(
  (
    {
      value = [],
      onChange,
      placeholder = 'Type and press Enter...',
      label,
      error,
      helperText,
      disabled = false,
      maxTags,
      className,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag();
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value.length - 1);
      }
    };

    const addTag = () => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      if (maxTags && value.length >= maxTags) return;
      if (value.includes(trimmed)) {
        setInputValue(''); // Clear duplicate entry attempt
        return;
      }

      const newValues = [...value, trimmed];
      onChange?.(newValues);
      setInputValue('');
    };

    const removeTag = (index: number) => {
      if (disabled) return;
      const newValues = value.filter((_, i) => i !== index);
      onChange?.(newValues);
    };

    return (
      <div className={cn("w-full space-y-1.5", className)}>
         {label && (
          <label className={cn(
            "text-sm font-medium leading-none text-[var(--text-primary)]",
            error && "text-red-500"
          )}>
            {label}
          </label>
        )}

        <div
          className={batchInputVariants({ error: !!error, disabled })}
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-primary-100)] px-2 py-1 text-xs font-medium text-[var(--color-primary-700)] ring-1 ring-inset ring-[var(--color-primary-200)]"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-[var(--color-primary-200)]/70 flex items-center justify-center transition-colors"
                disabled={disabled}
              >
                <span className="sr-only">Remove {tag}</span>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          
          <input
            ref={(node) => {
                // Handle both internal ref and forwarded ref
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
                // @ts-ignore
                inputRef.current = node;
            }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag()} 
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-secondary)] min-w-[120px]"
            disabled={disabled}
          />
        </div>

        {error && typeof error === 'string' && (
           <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
        )}
        
        {!error && helperText && (
          <p className="text-xs text-[var(--text-secondary)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
RNBatchInput.displayName = 'RNBatchInput';
