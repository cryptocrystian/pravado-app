import { useState } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { cn } from '../lib/utils'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  numeric?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  showDensityToggle?: boolean
}

function DifficultyChip({ value }: { value: number }) {
  const getChipStyles = () => {
    if (value <= 40) {
      return 'bg-ai-teal-600/20 text-ai-teal-300 border-ai-teal-600/30'
    } else if (value <= 70) {
      return 'bg-ai-gold-600/16 text-ai-gold-300 border-ai-gold-600/30'
    } else {
      return 'bg-danger/20 text-danger border-danger/30'
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      getChipStyles()
    )}>
      {value}
    </span>
  )
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  showDensityToggle = true
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = data.slice(startIndex, endIndex)

  const showingFrom = startIndex + 1
  const showingTo = Math.min(endIndex, data.length)

  return (
    <div className="space-y-4">
      {/* Table controls */}
      {showDensityToggle && (
        <div className="flex justify-end" data-testid="density-toggle">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-foreground/60" />
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setDensity('comfortable')}
                className={cn(
                  "px-3 py-1 text-xs font-medium transition-colors",
                  density === 'comfortable'
                    ? "bg-ai-teal-500 text-white"
                    : "bg-panel text-foreground hover:bg-panel-elevated"
                )}
              >
                Comfortable
              </button>
              <button
                onClick={() => setDensity('compact')}
                className={cn(
                  "px-3 py-1 text-xs font-medium transition-colors",
                  density === 'compact'
                    ? "bg-ai-teal-500 text-white"
                    : "bg-panel text-foreground hover:bg-panel-elevated"
                )}
              >
                Compact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50 shadow-sm">
        <table className={cn(
          "table-enterprise",
          density === 'compact' ? "table-compact" : "table-comfortable"
        )}>
          <thead>
            <tr className="border-b border-border/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "sticky top-0 z-10 bg-panel-elevated/80 backdrop-blur-sm",
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.numeric && 'font-mono'
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      column.numeric && 'numeric',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center'
                    )}
                  >
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key === 'difficulty' ? (
                      <DifficultyChip value={row[column.key] as number} />
                    ) : (
                      String(row[column.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Showing {showingFrom} to {showingTo} of {data.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium px-3 py-1">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}