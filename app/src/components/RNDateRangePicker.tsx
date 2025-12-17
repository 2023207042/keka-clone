import { useState, useRef, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/composeStyles';
import { RNButton } from './RNButton';
import 'react-day-picker/dist/style.css';
import '../styles/rn-datepicker.css';

export interface RNDateRangePickerProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function RNDateRangePicker({ selected, onSelect, placeholder = "Pick a date range", className }: RNDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (range: DateRange | undefined, selectedDay: Date) => {
      // If we already have a full range selected, and the user clicks again, 
      // we want to start a NEW range selection from that clicked day.
      if (selected?.from && selected?.to) {
          onSelect?.({ from: selectedDay, to: undefined });
          return;
      }
      
      onSelect?.(range);
  }

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <RNButton
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-start text-left font-normal min-w-[300px]",
          !selected && "text-[var(--text-secondary)]"
        )}
        leftIcon={<CalendarIcon className="mr-2 h-4 w-4" />}
      >
        {selected?.from ? (
          selected.to ? (
            <>
              {format(selected.from, "LLL dd, y")} - {format(selected.to, "LLL dd, y")}
            </>
          ) : (
            format(selected.from, "LLL dd, y")
          )
        ) : (
          <span>{placeholder}</span>
        )}
      </RNButton>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] shadow-lg animate-in fade-in zoom-in-95">
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            showOutsideDays
            numberOfMonths={2}
            className="p-3"
            classNames={{
                root: 'bg-[var(--bg-card)]',
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                month_caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                button_previous: 'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md hover:bg-[var(--color-surface-100)] flex items-center justify-center border border-[var(--border-default)]',
                button_next: 'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md hover:bg-[var(--color-surface-100)] flex items-center justify-center border border-[var(--border-default)]',
                month_grid: 'w-full border-collapse space-y-1',
                weekdays: 'flex',
                weekday: 'text-[var(--text-secondary)] rounded-md w-9 font-normal text-[0.8rem]',
                week: 'flex w-full mt-2',
                day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[var(--color-surface-100)]/50 [&:has([aria-selected])]:bg-[var(--color-surface-100)] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day_button: 'rn-day-button h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-colors',
                selected: 'rn-selected bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-600)] hover:text-white focus:bg-[var(--color-primary-600)] focus:text-white',
                range_middle: 'rn-range-middle !bg-[var(--color-primary-100)] !text-[var(--color-primary-900)] rounded-none first:rounded-l-md last:rounded-r-md',
                range_start: 'rn-range-start !bg-[var(--color-primary-600)] !text-white rounded-l-md',
                range_end: 'rn-range-end !bg-[var(--color-primary-600)] !text-white rounded-r-md',
                today: 'bg-[var(--color-surface-100)] text-[var(--text-primary)] font-bold',
                outside: 'day-outside text-[var(--text-muted)] opacity-50 aria-selected:bg-[var(--color-surface-100)]/50 aria-selected:text-[var(--text-muted)] aria-selected:opacity-30',
                disabled: 'text-[var(--text-secondary)] opacity-50',
                hidden: 'invisible',
            }}
          />
        </div>
      )}
    </div>
  );
}
