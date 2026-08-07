import React from 'react'
import { Activity, RefreshCw, Search, Cpu, Database } from 'lucide-react'
import { MOCK_ACTIVITY_FEED } from '@/data/ragAnalyticsMockData'
import type { ActivityEvent } from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

const iconMap = {
  index: RefreshCw,
  query: Search,
  embed: Cpu,
  sync: Database,
  update: Activity
}

export interface ActivityFeedProps {
  events?: ActivityEvent[]
  className?: string
}

export function ActivityFeed({
  events = MOCK_ACTIVITY_FEED,
  className
}: ActivityFeedProps) {
  return (
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4 select-none', className)}>
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-purple-400 shrink-0" />
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Operational Activity Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--muted)]">Live Updates</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
        {events.map((evt) => {
          const Icon = iconMap[evt.iconType] || Activity

          return (
            <div key={evt.id} className="relative flex items-start gap-3 text-xs group">
              {/* Timeline Icon Marker */}
              <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-[var(--surface-hover)] border border-purple-500/40 text-purple-400 group-hover:scale-110 transition-transform">
                <Icon size={12} />
              </div>

              {/* Event Content */}
              <div className="flex-1 p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] group-hover:border-purple-500/30 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-[var(--heading)] group-hover:text-purple-300 transition-colors">
                    {evt.title}
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--muted)] shrink-0">{evt.timestamp}</span>
                </div>
                <p className="text-[var(--muted)] text-[11px] mt-0.5 leading-relaxed">
                  {evt.description}
                </p>
                <div className="text-[10px] text-purple-400 font-mono mt-1.5 font-semibold">
                  By {evt.user}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityFeed

