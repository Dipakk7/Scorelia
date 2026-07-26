import React from 'react'
import { CheckCircle2, PlayCircle, Sparkles, Scan, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { progressHistoryMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { ProgressHistoryItem } from '@/types/careerRoadmap'

export interface ProgressHistoryProps {
  history?: ProgressHistoryItem[]
  className?: string
}

export function ProgressHistory({
  history = progressHistoryMockData,
  className,
}: ProgressHistoryProps) {
  const renderEventIcon = (eventType: ProgressHistoryItem['eventType']) => {
    switch (eventType) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
      case 'started':
        return <PlayCircle className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
      case 'milestone':
        return <Sparkles className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
      case 'analysis':
      default:
        return <Scan className="h-4 w-4 text-cyan-400 shrink-0" aria-hidden="true" />
    }
  }

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Clock className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Progress History Log</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Audit trail of recently completed activities and learning milestones
          </p>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          Recent Activity
        </span>
      </div>

      <div className="space-y-3">
        {history.map((event) => (
          <div
            key={event.id}
            className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 flex items-start gap-3 text-left hover:border-purple-500/30 transition-all"
          >
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 mt-0.5">
              {renderEventIcon(event.eventType)}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate m-0">
                  {event.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed m-0 line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default ProgressHistory
