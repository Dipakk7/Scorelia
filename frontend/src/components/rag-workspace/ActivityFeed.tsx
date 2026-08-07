import React, { useState } from 'react'
import { Activity, RefreshCw, Search, Cpu, Database, CheckCircle2, Clock, AlertTriangle, ShieldCheck, User } from 'lucide-react'
import { MOCK_ACTIVITY_FEED } from '@/data/ragAnalyticsMockData'
import type { ActivityEvent } from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

const iconConfig = {
  index: {
    icon: RefreshCw,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    badge: 'Indexing'
  },
  query: {
    icon: Search,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'Query'
  },
  embed: {
    icon: Cpu,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    badge: 'Neural Embed'
  },
  sync: {
    icon: Database,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'System Sync'
  },
  update: {
    icon: Activity,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'Update'
  }
}

export interface ActivityFeedProps {
  events?: ActivityEvent[]
  variant?: 'compact' | 'full'
  className?: string
}

export function ActivityFeed({
  events = MOCK_ACTIVITY_FEED,
  variant = 'compact',
  className
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'index' | 'query' | 'embed' | 'sync'>('all')

  const filteredEvents = events.filter((evt) => filter === 'all' || evt.iconType === filter)
  const isFull = variant === 'full'

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-purple-500/30 transition-all duration-300 text-left space-y-4 select-none flex flex-col justify-between',
        isFull ? 'w-full' : 'min-h-[480px]',
        className
      )}
    >
      {/* Top Header & Filter Chips */}
      <div className="space-y-3 border-b border-[var(--border)] pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--heading)] tracking-tight">
                Featured Operational Audit Log & Event Stream
              </h3>
              <p className="text-xs text-[var(--muted)] font-medium">Real-time vector operations, API queries, and neural pipeline activity</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live System Audit
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'index', label: 'Vector Indexing' },
            { id: 'query', label: 'Query Search' },
            { id: 'embed', label: 'Neural Models' },
            { id: 'sync', label: 'Database Sync' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap',
                filter === tab.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--heading)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Activity Timeline Stream */}
      <div
        className={cn(
          isFull
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2'
            : 'relative pl-7 space-y-4 my-2 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500/40 before:via-indigo-500/20 before:to-transparent flex-1'
        )}
      >
        {filteredEvents.map((evt) => {
          const cfg = iconConfig[evt.iconType] || iconConfig.update
          const Icon = cfg.icon

          return (
            <div
              key={evt.id}
              className={cn(
                'group text-xs transition-all duration-200',
                isFull ? 'flex flex-col justify-between' : 'relative flex items-start gap-3'
              )}
            >
              {/* Event Icon Marker for compact timeline view */}
              {!isFull && (
                <div
                  className={cn(
                    'absolute -left-7 top-0.5 p-1.5 rounded-full border transition-transform duration-200 group-hover:scale-110 shadow-sm',
                    cfg.bg,
                    cfg.border,
                    cfg.color
                  )}
                >
                  <Icon size={12} />
                </div>
              )}

              {/* Event Content Card */}
              <div
                className={cn(
                  'flex-1 p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] group-hover:border-purple-500/40 transition-all duration-200 shadow-sm space-y-2',
                  isFull && 'h-full flex flex-col justify-between'
                )}
              >
                {/* Header: Title + Icon + Timestamp */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-[var(--heading)] group-hover:text-purple-300 transition-colors flex items-center gap-2 text-xs">
                    {isFull && (
                      <div className={cn('p-1.5 rounded-lg border shrink-0', cfg.bg, cfg.border, cfg.color)}>
                        <Icon size={13} />
                      </div>
                    )}
                    <span>{evt.title}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--muted)] shrink-0 flex items-center gap-1">
                    <Clock size={10} /> {evt.timestamp}
                  </span>
                </div>

                {/* Secondary: Description */}
                <p className="text-[var(--muted)] text-[11px] leading-relaxed flex-1">
                  {evt.description}
                </p>

                {/* Supporting Metadata Footer: User + Source Tag + Status */}
                <div className="flex items-center justify-between pt-2 text-[10px] border-t border-[var(--border)]/60 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-semibold text-purple-400">
                      <User size={10} /> {evt.user}
                    </span>
                    {evt.source && (
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] font-mono">
                        {evt.source}
                      </span>
                    )}
                  </div>

                  <span className={cn('px-2 py-0.5 rounded-full font-mono font-bold text-[9px] border', cfg.bg, cfg.border, cfg.color)}>
                    {cfg.badge}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Audit Summary */}
      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck size={14} /> {filteredEvents.length} Verified Operational Events Logged
        </span>
        <span>Auto-Archive Engine Active</span>
      </div>
    </div>
  )
}

export default ActivityFeed
