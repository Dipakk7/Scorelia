import React from 'react'

export interface ChartLegendItem {
  id: string
  label: string
  color: string
  value?: string | number
  percentage?: number | string
  active?: boolean
}

interface ChartLegendProps {
  items: ChartLegendItem[]
  onItemHover?: (item: ChartLegendItem | null) => void
  onItemClick?: (item: ChartLegendItem) => void
  layout?: 'horizontal' | 'vertical'
  className?: string
}

export function ChartLegend({
  items,
  onItemHover,
  onItemClick,
  layout = 'horizontal',
  className = '',
}: ChartLegendProps) {
  return (
    <div
      className={`flex ${
        layout === 'vertical' ? 'flex-col space-y-1.5' : 'flex-wrap items-center gap-3 sm:gap-4'
      } text-xs font-medium select-none ${className}`}
      role="list"
      aria-label="Chart Data Series Legend"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          tabIndex={0}
          onMouseEnter={() => onItemHover?.(item)}
          onMouseLeave={() => onItemHover?.(null)}
          onClick={() => onItemClick?.(item)}
          className="flex items-center justify-between gap-2 cursor-pointer transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded-lg p-1"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-slate-300 font-semibold truncate hover:text-slate-100 transition-colors">
              {item.label}
            </span>
          </div>

          {(item.value !== undefined || item.percentage !== undefined) && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
              {item.value !== undefined && (
                <span className="text-slate-200 font-bold">{item.value}</span>
              )}
              {item.percentage !== undefined && (
                <span className="text-slate-400 font-semibold">({item.percentage}%)</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ChartLegend
