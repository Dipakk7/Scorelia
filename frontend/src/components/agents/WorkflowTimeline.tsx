// frontend/src/components/agents/WorkflowTimeline.tsx

import React from 'react'
import { ExecutionStepCard } from './ExecutionStepCard'
import { Activity, Clock } from 'lucide-react'
import type { AgentResponse } from '@/types/agent'
import { cn } from '@/lib/utils'

interface WorkflowTimelineProps {
  steps: AgentResponse[]
  totalDurationMs?: number
  className?: string
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  steps,
  totalDurationMs,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-350">
          <Activity size={16} className="text-brand-500" />
          <span className="text-xs font-semibold uppercase tracking-wider font-sans">
            Execution Steps Timeline ({steps.length})
          </span>
        </div>

        {totalDurationMs !== undefined && (
          <div className="flex items-center gap-1.5 text-xxs font-mono text-slate-500 dark:text-slate-400">
            <Clock size={12} />
            <span>Total: {totalDurationMs.toFixed(0)}ms</span>
          </div>
        )}
      </div>

      {/* Timeline Stream */}
      <div className="relative flex flex-col gap-5 pl-4 border-l-2 border-slate-100 dark:border-dark-border/40 ml-2 mt-1">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Timeline bullet indicator */}
            <div
              className={cn(
                'absolute -left-[23px] top-4.5 h-3.5 w-3.5 rounded-full border-2 bg-white dark:bg-dark-bg z-10 transition-colors duration-250',
                step.status === 'success'
                  ? 'border-emerald-500'
                  : 'border-rose-500'
              )}
            />

            <ExecutionStepCard step={step} index={idx} />
          </div>
        ))}

        {steps.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 dark:border-dark-border rounded-xl text-slate-400">
            <span className="text-xs font-sans">No workflow steps executed yet</span>
          </div>
        )}
      </div>
    </div>
  )
}
