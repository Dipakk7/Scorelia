import React from 'react'
import { motion } from 'framer-motion'
import { Layout, Check, Sparkles } from 'lucide-react'
import type { DashboardPresetItem } from '@/features/analytics/preferences/analyticsPreferencesTypes'

interface DashboardPresetCardProps {
  preset: DashboardPresetItem
  isSelected: boolean
  onSelect: (preset: DashboardPresetItem) => void
  className?: string
}

export function DashboardPresetCard({
  preset,
  isSelected,
  onSelect,
  className = '',
}: DashboardPresetCardProps) {
  return (
    <div
      tabIndex={0}
      onClick={() => onSelect(preset)}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Preset: ${preset.name}`}
      className={`p-3.5 rounded-2xl border transition-all text-left space-y-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
        isSelected
          ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/40'
          : 'bg-[#0f101c] border-white/10 hover:border-purple-500/30'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Layout size={15} className={isSelected ? 'text-purple-400' : 'text-slate-400'} />
          <span className="text-xs font-bold text-slate-100 truncate">{preset.name}</span>
        </div>

        {isSelected ? (
          <span className="p-1 rounded-full bg-purple-500 text-white shrink-0">
            <Check size={11} className="stroke-[3]" />
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-slate-400 border border-white/10 shrink-0">
            {preset.widgetIds.length} Widgets
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-medium leading-relaxed m-0 line-clamp-2">
        {preset.description}
      </p>
    </div>
  )
}

export default DashboardPresetCard
