import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/composeStyles';
import { ChevronDown, Check, Search } from 'lucide-react';
import { RNButton } from './RNButton';

export interface ComboboxItem {
  value: string;
  label: string;
}

export interface RNComboboxProps {
  items: ComboboxItem[];
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RNCombobox({ items, value, onSelect, placeholder="Select item...", searchPlaceholder="Search...", className, disabled }: RNComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedItem = items.find(item => item.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <RNButton
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full justify-between font-normal"
        disabled={disabled}
        rightIcon={<ChevronDown className="h-4 w-4 opacity-50" />}
      >
        {selectedItem ? selectedItem.label : placeholder}
      </RNButton>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-[var(--color-surface-0)] border border-[var(--border-default)] shadow-lg animate-in fade-in zoom-in-95 overflow-hidden">
          <div className="p-2 border-b border-[var(--border-default)]">
             <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                    className="w-full bg-transparent border-none focus:ring-0 text-sm pl-8 h-9 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
             </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
             {filteredItems.length === 0 ? (
                 <div className="py-6 text-center text-sm text-[var(--text-secondary)]">
                     No item found.
                 </div>
             ) : (
                 filteredItems.map(item => (
                    <div
                        key={item.value}
                        className={cn(
                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[var(--color-surface-100)]",
                            item.value === value && "bg-[var(--color-surface-50)] text-[var(--color-primary-600)]"
                        )}
                        onClick={() => {
                            onSelect?.(item.value);
                            setIsOpen(false);
                        }}
                    >
                        <span className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center", item.value === value ? "opacity-100" : "opacity-0")}>
                            <Check className="h-4 w-4" />
                        </span>
                        {item.label}
                    </div>
                 ))
             )}
          </div>
        </div>
      )}
    </div>
  );
}
