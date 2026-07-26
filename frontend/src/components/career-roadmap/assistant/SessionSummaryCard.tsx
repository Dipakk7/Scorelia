import React from 'react'
import { Sparkles, Clock, CheckCircle2, MessageSquare, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { sessionSummaryMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { SessionSummaryData } from '@/types/careerRoadmap'

export interface SessionSummaryCardProps {
  summary?: SessionSummaryData
  className?: string
}

export function SessionSummaryCard({
  summary = sessionSummaryMockData,
  className,
}: SessionSummaryCardProps) {
  return (
    <Card className={cn('p-5 bg-[#121320] border border-white/10 rounded-2xl space-y-3.5 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 m-0">
          <Sparkles className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
          <span>Session Summary</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
          <span>{summary.sessionDuration}</span>
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Today Focus */}
        <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Today&apos;s Focus
          </span>
          <p className="font-semibold text-white m-0 leading-snug">
            {summary.todayFocus}
          </p>
        </div>

        {/* Goals & Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/10 flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" aria-hidden="true" />
            <div>
              <span className="font-bold text-white block">{summary.aiSuggestionsCount}</span>
              <span className="text-[9px] text-slate-400 block">AI Suggestions</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/10 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <div>
              <span className="font-bold text-white block">{summary.completedTopicsCount} Topics</span>
              <span className="text-[9px] text-slate-400 block">Completed Today</span>
            </div>
          </div>
        </div>

        {/* Goals Discussed Pills */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <Target className="h-3 w-3 text-blue-400" aria-hidden="true" />
            <span>Key Topics Discussed</span>
          </span>
          <div className="flex flex-wrap gap-1">
            {summary.goalsDiscussed.map((goal, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#0b0c14] border border-white/10 text-[10px] font-medium text-slate-300"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
export default SessionSummaryCard
