import React, { useState, useMemo, useEffect } from 'react'
import { useInsights } from '@/hooks/useInsights'
import {
  mockActivityTimeline,
  type ActivityTimelineItem,
} from '@/data/insightsSystemHealthMockData'
import { Bot, Workflow, BookOpen, Server, CheckCircle2, XCircle, Clock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ActivityTimelineProps {
  className?: string
}

export function ActivityTimeline({ className }: ActivityTimelineProps) {
  const { timeline: queryTimeline } = useInsights()
  const [timelineEvents, setTimelineEvents] = useState<ActivityTimelineItem[]>(mockActivityTimeline)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (queryTimeline && queryTimeline.length > 0) {
      setTimelineEvents(queryTimeline)
    }
  }, [queryTimeline])

  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'all') return timelineEvents
    return timelineEvents.filter((item) => item.category === categoryFilter)
  }, [timelineEvents, categoryFilter])

  return (
    <div className={cn('space-y-4 text-left', className)}>
      {/* Category Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs select-none">
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border',
            categoryFilter === 'all'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-white'
          )}
        >
          All Events ({timelineEvents.length})
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('agent')}
          className={cn(
            'px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border',
            categoryFilter === 'agent'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-white'
          )}
        >
          Agent Events
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('automation')}
          className={cn(
            'px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border',
            categoryFilter === 'automation'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-white'
          )}
        >
          Automation Events
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('knowledge')}
          className={cn(
            'px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border',
            categoryFilter === 'knowledge'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-white'
          )}
        >
          Knowledge Events
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('system')}
          className={cn(
            'px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border',
            categoryFilter === 'system'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-white'
          )}
        >
          System Events
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-4 border-l border-white/10 ml-3 py-2">
        {(filteredEvents || []).map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Icon Node */}
            <div className="absolute -left-[33px] top-0.5 h-7 w-7 rounded-full bg-[#111322] border border-white/20 flex items-center justify-center text-xs shadow-md">
              {item.category === 'agent' && <Bot size={13} className="text-purple-400" />}
              {item.category === 'automation' && <Workflow size={13} className="text-blue-400" />}
              {item.category === 'knowledge' && <BookOpen size={13} className="text-indigo-400" />}
              {item.category === 'system' && <Server size={13} className="text-slate-400" />}
            </div>

            {/* Content Card */}
            <div className="p-3.5 rounded-xl bg-[#111322] border border-white/10 group-hover:border-purple-500/40 shadow-lg space-y-1.5 transition-all">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-white tracking-tight truncate">{item.action}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
                    {item.agent}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'success' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 size={12} />
                      Success
                    </span>
                  )}
                  {item.status === 'running' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300">
                      <Play size={12} className="animate-pulse" />
                      Running
                    </span>
                  )}
                  {item.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400">
                      <XCircle size={12} />
                      Failed
                    </span>
                  )}
                  {item.status === 'queued' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      <Clock size={12} />
                      Queued
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span>Source: <strong className="text-slate-200 font-sans">{item.source}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-purple-300">{item.duration}</strong></span>
                </div>
                <span>{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityTimeline
