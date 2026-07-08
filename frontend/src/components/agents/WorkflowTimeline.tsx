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
    <div className={cn('flex flex-col gap-4 text-left font-sans text-xs', className)}>
      {/* Header Info */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-350">
          <Activity size={16} className="text-brand-500" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-905 dark:text-white leading-none">
            Execution Steps Timeline ({steps.length})
          </span>
        </div>

        {totalDurationMs !== undefined && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-455 dark:text-slate-500 font-bold leading-none">
            <Clock size={12} className="text-slate-400" />
            <span>Total: {totalDurationMs.toFixed(0)}ms</span>
          </div>
        )}
      </div>

      {/* Timeline Stream */}
      <div className="relative flex flex-col gap-5 pl-4 border-l-2 border-slate-200 dark:border-slate-850 ml-2 mt-1">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Timeline bullet indicator */}
            <div
              className={cn(
                'absolute -left-[23px] top-4.5 h-3.5 w-3.5 rounded-full border-2 bg-white dark:bg-slate-900 z-10 transition-colors duration-250',
                step.status === 'success'
                  ? 'border-emerald-500 bg-white dark:bg-slate-950'
                  : 'border-rose-500 bg-white dark:bg-slate-950'
              )}
            />

            <ExecutionStepCard step={step} index={idx} />
          </div>
        ))}

        {steps.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-205 dark:border-slate-850 rounded-2xl text-slate-455 dark:text-slate-500 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md">
            <span className="text-xs font-bold leading-none">No workflow steps executed yet</span>
          </div>
        )}
      </div>
    </div>
  )
}
export default WorkflowTimeline
