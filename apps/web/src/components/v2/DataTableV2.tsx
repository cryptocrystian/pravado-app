import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Settings, MoreVertical } from 'lucide-react'
import { cn } from '../../lib/utils'
import { GlassCard } from './GlassCard'

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  numeric?: boolean;
}

interface DataTableV2Props<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  showDensityToggle?: boolean;
  title?: string;
  className?: string;
}

type SortConfig<T> = {
  key: keyof T | null;
  direction: 'asc' | 'desc';
};

function StatusChip({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    active: 'bg-ai text-ai border-ai',
    pending: 'bg-premium text-premium border-premium',
    inactive: 'bg-foreground/10 text-foreground/60 border-foreground/20',
    published: 'bg-ai text-ai border-ai',
    draft: 'bg-premium text-premium border-premium',
    archived: 'bg-foreground/10 text-foreground/60 border-foreground/20'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      statusStyles[status.toLowerCase()] || statusStyles.inactive
    )}>
      {status}
    </span>
  );
}

function SortableHeader<T>({ 
  column, 
  sortConfig, 
  onSort 
}: { 
  column: Column<T>;
  sortConfig: SortConfig<T>;
  onSort: (key: keyof T) => void;
}) {
  if (!column.sortable) {
    return <span>{column.label}</span>;
  }

  const isSorted = sortConfig.key === column.key;
  const direction = isSorted ? sortConfig.direction : null;

  return (
    <button
      onClick={() => onSort(column.key)}
      className="flex items-center gap-1 hover:text-ai transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2 rounded"
    >
      <span>{column.label}</span>
      <div className="flex flex-col">
        <ChevronUp className={cn(
          "h-3 w-3 -mb-1 transition-colors",
          direction === 'asc' ? "text-ai" : "text-foreground/30 group-hover:text-foreground/60"
        )} />
        <ChevronDown className={cn(
          "h-3 w-3 transition-colors",
          direction === 'desc' ? "text-ai" : "text-foreground/30 group-hover:text-foreground/60"
        )} />
      </div>
    </button>
  );
}

export function DataTableV2<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  showDensityToggle = true,
  title,
  className
}: DataTableV2Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: null, direction: 'asc' });

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, sortedData.length);

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <GlassCard className={cn("", className)}>
      {/* Header */}
      {(title || showDensityToggle) && (
        <div className="flex items-center justify-between p-6 pb-0">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          
          {/* Density toggle */}
          {showDensityToggle && (
            <div className="flex items-center gap-3" data-testid="density-toggle">
              <Settings className="h-4 w-4 text-foreground/60" />
              <div className="flex rounded-lg border border-white/10 overflow-hidden bg-surface/5">
                <button
                  onClick={() => setDensity('comfortable')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-all",
                    density === 'comfortable'
                      ? "bg-ai text-white shadow-sm"
                      : "text-foreground/80 hover:text-foreground hover:bg-surface/10"
                  )}
                >
                  Comfortable
                </button>
                <button
                  onClick={() => setDensity('compact')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-all",
                    density === 'compact'
                      ? "bg-ai text-white shadow-sm"
                      : "text-foreground/80 hover:text-foreground hover:bg-surface/10"
                  )}
                >
                  Compact
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table with sticky header glass effect */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "sticky top-0 z-20 px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider",
                    "bg-ai backdrop-blur-md border-b border-white/10",
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.numeric && 'font-mono',
                    density === 'compact' ? 'py-2' : 'py-4'
                  )}
                >
                  <SortableHeader 
                    column={column} 
                    sortConfig={sortConfig} 
                    onSort={handleSort} 
                  />
                </th>
              ))}
              <th className={cn(
                "sticky top-0 z-20 w-12 px-6 text-right",
                "bg-ai backdrop-blur-md border-b border-white/10",
                density === 'compact' ? 'py-2' : 'py-4'
              )}>
                <MoreVertical className="h-4 w-4 text-foreground/40" />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr 
                key={index}
                className="border-b border-white/5 hover:bg-surface/5 transition-colors group"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-6 text-sm text-foreground/90 transition-colors",
                      column.numeric && 'font-mono text-right',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      density === 'compact' ? 'py-3' : 'py-4'
                    )}
                  >
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key === 'status' ? (
                      <StatusChip status={String(row[column.key])} />
                    ) : (
                      String(row[column.key])
                    )}
                  </td>
                ))}
                <td className={cn(
                  "px-6 text-right",
                  density === 'compact' ? 'py-3' : 'py-4'
                )}>
                  <button className="p-1 rounded hover:bg-surface/10 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2">
                    <MoreVertical className="h-4 w-4 text-foreground/60" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-6 pt-4 border-t border-white/10">
        <div className="text-sm text-foreground/60">
          Showing {showingFrom} to {showingTo} of {sortedData.length} entries
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2",
                    isActive 
                      ? "bg-ai text-white" 
                      : "text-foreground/60 hover:text-foreground hover:bg-surface/10"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}