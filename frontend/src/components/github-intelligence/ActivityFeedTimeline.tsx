import React from 'react'
import { Activity } from 'lucide-react'
import { githubAIInsightsMockData, type ActivityFeedItemData } from '@/data/githubAIInsightsMockData'
import { ActivityTimelineItem } from './ActivityTimelineItem'
import { cn } from '@/lib/utils'

export interface ActivityFeedTimelineProps {
  items?: ActivityFeedItemData[]
  className?: string
}

export const ActivityFeedTimeline: React.FC<ActivityFeedTimelineProps> = ({
  items = githubAIInsightsMockData.activityFeed,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-4 font-sans text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-sky-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Live Activity Feed</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Chronological repository audit trail</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Realtime
        </span>
      </div>

      <div className="relative pl-2 space-y-4 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
        {items.map((item) => (
          <ActivityTimelineItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
