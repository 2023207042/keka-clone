import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/composeStyles';

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

export interface RNDropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  width?: string;
}

export function RNDropdownMenu({ trigger, items, align = 'left', className, width = 'w-56' }: RNDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 origin-top",
            align === 'right' ? 'right-0' : 'left-0',
            width,
            // Dark mode support via CSS variables
            "bg-[var(--color-surface-0)] border border-[var(--border-default)]"
          )}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center px-4 py-2 text-sm text-left transition-colors",
                  "hover:bg-[var(--color-surface-50)] text-[var(--text-primary)]",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  item.danger && "text-red-600 hover:text-red-700 hover:bg-red-50"
                )}
                role="menuitem"
              >
                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
