import { Calendar, Download, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-205 dark:border-slate-855 rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 font-sans text-xs text-left">
      {/* Date Range Selector Buttons */}
      <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/40 p-1 rounded-xl self-start sm:self-auto select-none border border-slate-200/40 dark:border-slate-800/40">
        <span className="p-1 text-slate-400 dark:text-slate-500 mr-1 flex items-center shrink-0">
          <Calendar size={14} />
        </span>
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => setDateRange(range.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none bg-transparent leading-none',
              dateRange === range.value
                ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-xs font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 select-none">
        {onRefreshClick && (
          <button
            onClick={onRefreshClick}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:border-brand-500/35 hover:bg-brand-500/5 bg-transparent rounded-xl font-bold text-slate-655 dark:text-slate-300 transition-all cursor-pointer text-[10px] uppercase tracking-wider h-9 select-none leading-none disabled:opacity-40 disabled:cursor-not-allowed"
            title="Refresh analytics data cache"
          >
            <RefreshCw size={12} className={cn(refreshing && 'animate-spin')} />
            <span>Sync</span>
          </button>
        )}
        <button
          onClick={onExportClick}
          className="flex items-center justify-center gap-1.5 px-4 py-2 font-bold cursor-pointer bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-700 hover:to-indigo-700 text-white shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-[10px] uppercase tracking-wider h-9 select-none leading-none"
        >
          <Download size={12} />
          <span>Export Reports</span>
        </button>
      </div>
    </div>
  )
}
export default AnalyticsFilterBar
