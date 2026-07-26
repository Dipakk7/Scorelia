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
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-purple-400 shrink-0" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Operational Activity Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Live Updates</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {events.map((evt) => {
          const Icon = iconMap[evt.iconType] || Activity

          return (
            <div key={evt.id} className="relative flex items-start gap-3 text-xs group">
              {/* Timeline Icon Marker */}
              <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-[#121320] border border-purple-500/40 text-purple-400 group-hover:scale-110 transition-transform">
                <Icon size={12} />
              </div>

              {/* Event Content */}
              <div className="flex-1 p-3 rounded-xl bg-[#121320] border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                    {evt.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{evt.timestamp}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
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
