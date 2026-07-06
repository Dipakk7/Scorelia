import { Calendar, Download, RefreshCw } from 'lucide-react'

interface AnalyticsFilterBarProps {
  dateRange: string
  setDateRange: (range: string) => void
  onExportClick: () => void
  onRefreshClick?: () => void
  refreshing?: boolean
}

export function AnalyticsFilterBar({
  dateRange,
  setDateRange,
  onExportClick,
  onRefreshClick,
  refreshing = false,
}: AnalyticsFilterBarProps) {
  const ranges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs font-sans text-xs">
      {/* Date Range Selector Buttons */}
      <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-xl self-start sm:self-auto">
        <span className="p-1 text-slate-400 dark:text-slate-500 mr-1 flex items-center">
          <Calendar size={14} />
        </span>
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => setDateRange(range.value)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              dateRange === range.value
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onRefreshClick && (
          <button
            onClick={onRefreshClick}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold text-slate-650 dark:text-slate-300 transition-all cursor-pointer text-[11px]"
            title="Refresh analytics data cache"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        )}
        <button
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-xs hover:shadow-md transition-all cursor-pointer text-[11px]"
        >
          <Download size={12} />
          <span>Export Reports</span>
        </button>
      </div>
    </div>
  )
}
