import React from 'react'
import { cn } from '@/lib/utils'

export interface LegendItem {
  id: string
  label: string
  color: string
  visible: boolean
}

export interface ChartLegendProps {
  items: LegendItem[]
  onToggleItem: (id: string) => void
  className?: string
}

export function ChartLegend({ items, onToggleItem, className }: ChartLegendProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap text-xs select-none', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onToggleItem(item.id)}
          aria-label={`Toggle series ${item.label}`}
          aria-pressed={item.visible}
          className={cn(
            'flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
            item.visible
              ? 'bg-[#0b0c14] border-white/10 text-slate-200'
              : 'bg-transparent border-transparent text-slate-500 opacity-50 line-through'
          )}
        >
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-semibold">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ChartLegend
