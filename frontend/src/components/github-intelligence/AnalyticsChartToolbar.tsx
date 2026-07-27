import React from 'react'
import { Calendar, RefreshCw, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnalyticsChartToolbarProps {
  onRefresh?: () => void
  onExport?: () => void
  dateRange?: string
  onDateRangeChange?: (val: string) => void
  className?: string
}

export const AnalyticsChartToolbar: React.FC<AnalyticsChartToolbarProps> = ({
  onRefresh,
  onExport,
  dateRange = '30d',
  onDateRangeChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[var(--surface-hover)] text-[var(--muted)] border border-[var(--border)]">
        <Calendar size={12} />
        <span>Last 30 Days</span>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        aria-label="Refresh Chart Data"
        className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <RefreshCw size={13} />
      </button>

      <button
        type="button"
        onClick={onExport}
        aria-label="Export Chart Data"
        className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <Download size={13} />
      </button>
    </div>
  )
}
