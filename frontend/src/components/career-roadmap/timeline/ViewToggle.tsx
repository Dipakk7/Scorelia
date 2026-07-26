import React from 'react'
import { Calendar, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TimelineViewMode } from '@/types/careerRoadmap'

export interface ViewToggleProps {
  viewMode: TimelineViewMode
  onViewChange: (mode: TimelineViewMode) => void
  className?: string
}

export function ViewToggle({ viewMode, onViewChange, className }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Roadmap View Mode Switcher"
      className={cn(
        'inline-flex items-center gap-1.5 p-1 bg-[#0b0c14] border border-white/10 rounded-xl select-none',
        className
      )}
    >
      <span className="text-[11px] font-semibold text-slate-400 px-2 hidden sm:inline">
        View as
      </span>

      {/* Timeline Toggle Button */}
      <button
        type="button"
        aria-pressed={viewMode === 'timeline'}
        onClick={() => onViewChange('timeline')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] sm:min-h-[32px] text-xs font-semibold rounded-lg transition-all cursor-pointer border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
          viewMode === 'timeline'
            ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40 font-bold'
            : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
        )}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Timeline</span>
      </button>

      {/* Board Toggle Button */}
      <button
        type="button"
        aria-pressed={viewMode === 'board'}
        onClick={() => onViewChange('board')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] sm:min-h-[32px] text-xs font-semibold rounded-lg transition-all cursor-pointer border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
          viewMode === 'board'
            ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40 font-bold'
            : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Board</span>
      </button>
    </div>
  )
}
export default ViewToggle
