import React from 'react'
import { GripVertical, Pin, Eye, EyeOff } from 'lucide-react'
import type { WidgetItemPreference, WidgetSize } from '@/features/analytics/preferences/analyticsPreferencesTypes'
import { WidgetVisibilityToggle } from './WidgetVisibilityToggle'

interface WidgetCardProps {
  widget: WidgetItemPreference
  onToggleVisibility: (id: string, visible: boolean) => void
  onTogglePin: (id: string, pinned: boolean) => void
  onChangeSize?: (id: string, size: WidgetSize) => void
  className?: string
}

export function WidgetCard({
  widget,
  onToggleVisibility,
  onTogglePin,
  onChangeSize,
  className = '',
}: WidgetCardProps) {
  return (
    <div
      tabIndex={0}
      className={`flex items-center justify-between p-3 rounded-xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
        !widget.visible ? 'opacity-60 bg-white/[0.02]' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <GripVertical size={14} className="text-slate-500 cursor-grab shrink-0" aria-hidden="true" />

        <div className="min-w-0 text-left space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 truncate">{widget.name}</span>
            {widget.pinned && (
              <span title="Pinned to Top" className="inline-flex items-center">
                <Pin size={11} className="text-purple-400 fill-current shrink-0" />
              </span>
            )}
          </div>

          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-slate-400 inline-block">
            {widget.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Size Selector Pill */}
        {onChangeSize && widget.visible && (
          <select
            value={widget.size}
            onChange={(e) => onChangeSize(widget.id, e.target.value as WidgetSize)}
            className="px-2 py-1 rounded-lg bg-[#121320] border border-white/10 text-[10px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="full">Full Width</option>
          </select>
        )}

        {/* Pin Button */}
        <button
          type="button"
          onClick={() => onTogglePin(widget.id, !widget.pinned)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            widget.pinned
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
          }`}
          title={widget.pinned ? 'Unpin widget' : 'Pin widget to top'}
        >
          <Pin size={12} className={widget.pinned ? 'fill-current' : ''} />
        </button>

        {/* Visibility Toggle */}
        <WidgetVisibilityToggle
          checked={widget.visible}
          onChange={(checked) => onToggleVisibility(widget.id, checked)}
          label={`Toggle ${widget.name} visibility`}
        />
      </div>
    </div>
  )
}

export default WidgetCard
