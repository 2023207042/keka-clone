import { useState, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/composeStyles';
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { RNButton } from './RNButton';
import { RNSelect } from './RNSelect';

// --- Types ---

export type SortDirection = 'asc' | 'desc';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string; // For specific column alignment/width
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationProps {
  pageCount?: number; // Total pages (for server-side)
  onPaginationChange?: (pagination: PaginationState) => void;
  manualPagination?: boolean; // If true, disable client-side slicing
}

export interface SortingProps {
  sortBy?: string;
  sortDir?: SortDirection;
  onSortingChange?: (sortBy: string, sortDir: SortDirection) => void;
  manualSorting?: boolean; // If true, disable client-side sorting
}

const tableVariants = cva('w-full caption-bottom text-sm', {
  variants: {
    variant: {
      default: '',
      bordered: '[&_td]:border [&_th]:border border-collapse',
      striped: '[&_tbody_tr:nth-child(even)]:bg-[var(--color-surface-50)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface RNTableProps<T> extends VariantProps<typeof tableVariants> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  caption?: string;
  pagination?: PaginationProps;
  sorting?: SortingProps;
  // Simple props for basic use cases
  pageSize?: number;
}

export function RNTable<T extends { id?: string | number } | any>({
  data,
  columns,
  className,
  variant,
  caption,
  pagination,
  sorting,
  pageSize: initialPageSize = 10,
}: RNTableProps<T>) {
  // --- State Management (Client-Side Fallbacks) ---
  
  // Pagination State
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);
  
  const isManualPagination = pagination?.manualPagination;
  // pageIndex variable removed as it was unused in logic below (we use internalPageIndex or props directly)
  
  const pageSize = internalPageSize;

  // Sorting State
  const [internalSortBy, setInternalSortBy] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDirection>('asc');

  const isManualSorting = sorting?.manualSorting;
  const activeSortBy = isManualSorting ? sorting?.sortBy : internalSortBy;
  const activeSortDir = isManualSorting ? sorting?.sortDir : internalSortDir;

  // --- Logic ---

  // 1. Sort Data (Client-Side)
  const sortedData = useMemo(() => {
    if (isManualSorting || !activeSortBy) return data;

    return [...data].sort((a, b) => {
      const aVal = a[activeSortBy as keyof T];
      const bVal = b[activeSortBy as keyof T];

      if (aVal < bVal) return activeSortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return activeSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, activeSortBy, activeSortDir, isManualSorting]);

  // 2. Paginate Data (Client-Side)
  const paginatedData = useMemo(() => {
    if (isManualPagination) return sortedData;
    const start = internalPageIndex * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, internalPageIndex, pageSize, isManualPagination]);

  const totalItems = data.length;
  const pageCount = isManualPagination ? (pagination?.pageCount || 1) : Math.ceil(totalItems / pageSize);

  // --- Handlers ---

  const handleSort = (key: string) => {
    const newDir = activeSortBy === key && activeSortDir === 'asc' ? 'desc' : 'asc';
    
    if (isManualSorting && sorting?.onSortingChange) {
      sorting.onSortingChange(key, newDir);
    } else {
      setInternalSortBy(key);
      setInternalSortDir(newDir);
    }
  };

  const handlePageChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= pageCount) return;

    if (isManualPagination && pagination?.onPaginationChange) {
       pagination.onPaginationChange({ pageIndex: newIndex, pageSize });
    } else {
      setInternalPageIndex(newIndex);
    }
  };

  const handlePageSizeChange = (newSize: string) => {
     const size = parseInt(newSize);
     setInternalPageSize(size);
     setInternalPageIndex(0); // Reset to first page
     if(isManualPagination && pagination?.onPaginationChange) {
        pagination.onPaginationChange({ pageIndex: 0, pageSize: size });
     }
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-xl border border-[var(--border-default)] shadow-sm bg-[var(--bg-card)]">
        <div className="overflow-x-auto">
          <table className={cn(tableVariants({ variant, className }))}>
            {caption && (
              <caption className="mt-4 text-sm text-[var(--text-muted)] p-2">{caption}</caption>
            )}
            <thead className="bg-[var(--color-surface-50)] [&_tr]:border-b [&_tr]:border-[var(--border-default)]">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-[var(--text-secondary)] whitespace-nowrap",
                      col.sortable && "cursor-pointer hover:bg-[var(--color-surface-100)] select-none",
                      col.className
                    )}
                    onClick={() => col.sortable && col.accessorKey && handleSort(String(col.accessorKey))}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && activeSortBy === String(col.accessorKey) && (
                        activeSortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--color-surface-50)] data-[state=selected]:bg-[var(--color-surface-100)]"
                  >
                    {columns.map((col, j) => (
                      <td key={j} className={cn("p-4 align-middle text-[var(--text-primary)]", col.className)}>
                        {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey]) : '')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={columns.length} className="h-24 text-center text-[var(--text-muted)]">
                      No results.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Pagination Controls */}
       {(pageCount > 1 || isManualPagination) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
           <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
               <span>Rows per page</span>
               <div className="w-16">
                  <RNSelect 
                    selectSize="sm"
                    value={String(pageSize)}
                    options={[
                        { label: '5', value: '5' },
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '50', value: '50' }
                    ]}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                  />
               </div>
           </div>

           <div className="flex items-center gap-6 lg:gap-8">
             <div className="flex w-[100px] items-center justify-center text-sm font-medium text-[var(--text-primary)]">
               Page {internalPageIndex + 1} of {pageCount}
             </div>
             <div className="flex items-center gap-2">
                <RNButton 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handlePageChange(0)}
                  disabled={internalPageIndex === 0}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </RNButton>
                <RNButton 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handlePageChange(internalPageIndex - 1)}
                  disabled={internalPageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </RNButton>
                <RNButton 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handlePageChange(internalPageIndex + 1)}
                  disabled={internalPageIndex === pageCount - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </RNButton>
                <RNButton 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handlePageChange(pageCount - 1)}
                  disabled={internalPageIndex === pageCount - 1}
                >
                  <ChevronsRight className="h-4 w-4" />
                </RNButton>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
