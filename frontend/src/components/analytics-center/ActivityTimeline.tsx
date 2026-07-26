import React from 'react'
import { ArrowRight, Clock } from 'lucide-react'
import { analyticsInsightsMockData } from '@/data/analyticsInsightsMockData'
import type { ActivityTimelineItemData } from '@/data/analyticsInsightsMockData'
import { ActivityTimelineItem } from './ActivityTimelineItem'

interface ActivityTimelineProps {
  items?: ActivityTimelineItemData[]
  onViewAllClick?: () => void
  className?: string
}

export function ActivityTimeline({
  items = analyticsInsightsMockData.timelineItems,
  onViewAllClick,
  className = '',
}: ActivityTimelineProps) {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5 font-display">
          <Clock size={14} className="text-purple-400" />
          Activity Feed
        </span>

        <button
          type="button"
          onClick={onViewAllClick}
          className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View all</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Feed List with Timeline Connector */}
      <div className="relative pl-3 space-y-2.5 border-l-2 border-white/10">
        {items.map((item) => (
          <div key={item.id} className="relative">
            {/* Connector Node */}
            <div className="absolute -left-[19px] top-3.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-[#0b0c14]" />
            <ActivityTimelineItem item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityTimeline
