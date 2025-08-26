import { useState } from 'react'
import { ChevronDown, Search, Filter, MoreHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Column {
  key: string
  header: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface DataTableV2Props {
  columns: Column[]
  data: Record<string, any>[]
  searchable?: boolean
  filterable?: boolean
  density?: 'compact' | 'comfortable' | 'spacious'
  stickyHeader?: boolean
  className?: string
  onRowClick?: (row: Record<string, any>) => void
}

type SortDirection = 'asc' | 'desc' | null

export function DataTableV2({
  columns,
  data,
  searchable = false,
  filterable = false,
  density = 'comfortable',
  stickyHeader = true,
  className,
  onRowClick
}: DataTableV2Props) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentDensity, setCurrentDensity] = useState(density)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const filteredData = data.filter(row =>
    searchTerm === '' || 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0
    
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (sortDirection === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
    }
  })

  const getCellValue = (row: Record<string, any>, column: Column) => {
    const value = row[column.key]
    
    // Special handling for status chips
    if (column.key === 'status' && typeof value === 'string') {
      const statusColors: Record<string, string> = {
        active: 'bg-ai-teal-300/10 text-ai-teal-300 border-ai-teal-300/30',
        pending: 'bg-ai-gold-500/10 text-ai-gold-500 border-ai-gold-500/30',
        inactive: 'bg-foreground/10 text-foreground/60 border-foreground/20',
        error: 'bg-red-400/10 text-red-400 border-red-400/30'
      }
      
      return (
        <span className={cn(
          'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
          statusColors[value.toLowerCase()] || statusColors.inactive
        )}>
          {value}
        </span>
      )
    }
    
    // Right-align numeric values
    if (typeof value === 'number' || (typeof value === 'string' && /^[\d,.-]+$/.test(value.replace(/[%$]/g, '')))) {
      return <span className="font-mono">{value}</span>
    }
    
    return value
  }

  const densityClasses = {
    compact: 'py-2',
    comfortable: 'py-3',
    spacious: 'py-4'
  }

  return (
    <div className={cn(
      "bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-glass overflow-hidden",
      className
    )}>
      {/* Table Controls */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-[hsl(var(--glass-stroke))]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              {searchable && (
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-transparent border border-[hsl(var(--glass-stroke))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ai-teal-500 focus:border-ai-teal-500"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {filterable && (
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[hsl(var(--glass-stroke))] rounded-lg hover:bg-white/5 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              )}
              
              {/* Density Toggle */}
              <div className="relative">
                <select
                  value={currentDensity}
                  onChange={(e) => setCurrentDensity(e.target.value as typeof density)}
                  className="appearance-none bg-transparent border border-[hsl(var(--glass-stroke))] rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ai-teal-500"
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(
            "bg-[hsl(var(--glass-fill-strong))] border-b border-[hsl(var(--glass-stroke))]",
            stickyHeader && "sticky top-0 z-10"
          )}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider",
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right",
                    column.sortable && "cursor-pointer hover:text-foreground/80 select-none",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        sortColumn === column.key && sortDirection === 'desc' && "rotate-180",
                        sortColumn !== column.key && "opacity-0"
                      )} />
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12"></th> {/* Actions column */}
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--glass-stroke))]">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "hover:bg-white/5 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 text-sm text-foreground",
                      densityClasses[currentDensity],
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right"
                    )}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
                <td className={cn("px-4", densityClasses[currentDensity])}>
                  <button className="p-1 hover:bg-white/5 rounded">
                    <MoreHorizontal className="h-4 w-4 text-foreground/40" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            {searchTerm ? 'No results found' : 'No data available'}
          </div>
        )}
      </div>
    </div>
  )
}