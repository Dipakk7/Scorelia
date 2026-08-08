import React, { useState } from 'react'
import type { TimelineDayMetric } from '@/data/githubAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface ContributionHeatmapProps {
  timeline: TimelineDayMetric[]
  className?: string
}

const INTENSITY_CLASSES: Record<0 | 1 | 2 | 3, string> = {
  0: 'bg-emerald-950/40 border-emerald-900/30 hover:border-emerald-700',
  1: 'bg-emerald-800/60 border-emerald-700/40 hover:border-emerald-500',
  2: 'bg-emerald-600 border-emerald-500 hover:border-emerald-400',
  3: 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)] hover:border-white',
}

const DAYS_SHORT = ['Mon', 'Wed', 'Fri', 'Sun']

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  timeline,
  className,
}) => {
  const [hoveredDay, setHoveredDay] = useState<TimelineDayMetric | null>(null)

  return (
    <div className={cn('space-y-2 select-none overflow-x-auto scrollbar-none py-1', className)}>
      {/* Month Separator Legend Header */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-7">
        <span>Apr 21</span>
        <span>Apr 28</span>
        <span>May 5</span>
        <span>May 12</span>
        <span>May 19</span>
      </div>

      <div className="flex items-center gap-2 min-w-max">
        {/* Day Labels */}
        <div className="flex flex-col justify-between text-[9px] text-slate-400 font-mono h-24 shrink-0 pr-1">
          {DAYS_SHORT.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* 7-Row Grid (5 Weeks) */}
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1 min-w-[260px]">
          {timeline.map((item) => (
            <div
              key={item.id}
              tabIndex={0}
              role="gridcell"
              aria-label={`${item.count} contributions on ${item.date}`}
              onMouseEnter={() => setHoveredDay(item)}
              onMouseLeave={() => setHoveredDay(null)}
              className={cn(
                'h-3.5 w-3.5 sm:w-full rounded-[3px] border transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 hover:scale-110',
                INTENSITY_CLASSES[item.intensity]
              )}
            />
          ))}
        </div>
      </div>

      {/* Hover Tooltip Overlay */}
      {hoveredDay && (
        <div className="text-center text-[10px] font-medium text-purple-300 font-mono py-0.5 animate-fade-in">
          {hoveredDay.count} contributions on {hoveredDay.date} ({hoveredDay.day})
        </div>
      )}
    </div>
  )
}

export default ContributionHeatmap
