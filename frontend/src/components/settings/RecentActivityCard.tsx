import React from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { SidebarCard } from './SidebarCard'
import { ActivityTimelineItem } from './ActivityTimelineItem'
import type { TimelineActivityItem } from './accountOverviewMockData'

export interface RecentActivityCardProps {
  activities: TimelineActivityItem[]
  onViewAll?: () => void
  className?: string
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  onViewAll,
  className,
}) => {
  return (
    <SidebarCard
      title="Recent Activity"
      icon={<Clock className="w-4 h-4 text-amber-400" />}
      action={
        <a
          href="#all-activity"
          onClick={(e) => {
            e.preventDefault()
            onViewAll?.()
          }}
          className="text-xs text-[var(--primary)] hover:underline font-medium inline-flex items-center gap-0.5"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      }
      className={className}
    >
      <div className="space-y-0.5 pt-1">
        {activities.map((act, index) => (
          <ActivityTimelineItem
            key={act.id}
            item={act}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </SidebarCard>
  )
}

export default RecentActivityCard
