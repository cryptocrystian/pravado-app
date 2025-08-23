import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeRangeSelectorProps {
  value: '7d' | '30d' | '90d' | '1y'
  onChange: (range: '7d' | '30d' | '90d' | '1y') => void
  className?: string
}

const timeRangeOptions = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
] as const

export default function TimeRangeSelector({
  value,
  onChange,
  className
}: TimeRangeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} data-testid="time-range-selector">
      <Calendar className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 mr-2">Time Range:</span>
      
      <div className="flex rounded-lg border border-gray-200 bg-white p-1">
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-md transition-all',
              value === option.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
            data-testid={`time-range-${option.value}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}