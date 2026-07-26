import React from 'react'
import { FileText, Scan, UserCheck, MailOpen, Map, Server, Activity } from 'lucide-react'
import type { ActivityTimelineItemData } from '@/data/analyticsInsightsMockData'
import { ActivityStatusBadge } from './ActivityStatusBadge'

interface ActivityTimelineItemProps {
  item: ActivityTimelineItemData
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Scan,
  UserCheck,
  MailOpen,
  Map,
  Server,
  Activity,
}

export function ActivityTimelineItem({ item, className = '' }: ActivityTimelineItemProps) {
  const IconComponent = iconMap[item.iconName] || Activity

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`${item.title} at ${item.timestamp}`}
      className={`group relative flex items-start gap-3 p-2.5 rounded-xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${className}`}
    >
      <div
        className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}
      >
        <IconComponent size={14} className="stroke-[2]" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0 text-left space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors truncate">
            {item.title}
          </span>
          <ActivityStatusBadge status={item.status} />
        </div>

        <p className="text-[11px] text-slate-400 font-medium m-0 leading-snug truncate">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
          <span className="truncate">By: {item.actor}</span>
          <span className="shrink-0">{item.timestamp}</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityTimelineItem
