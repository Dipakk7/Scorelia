// frontend/src/components/agents/ExecutionStepCard.tsx

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { AgentStatusBadge } from './AgentStatusBadge'
import { Clock, ChevronDown, ChevronUp, AlertCircle, FileCode, CheckCircle } from 'lucide-react'
import type { AgentResponse } from '@/types/agent'
import { cn } from '@/lib/utils'

interface ExecutionStepCardProps {
  step: AgentResponse
  index: number
  className?: string
}

export const ExecutionStepCard: React.FC<ExecutionStepCardProps> = ({ step, index, className }) => {
  const [expanded, setExpanded] = useState(false)
  const isSuccess = step.status === 'success'

  return (
    <Card
      className={cn(
        'border transition-all duration-200 shadow-xs glass-card',
        isSuccess
          ? 'border-slate-200 dark:border-dark-border/60 hover:border-emerald-500/35'
          : 'border-rose-300 dark:border-rose-950/60 hover:border-rose-500/50',
        className
      )}
    >
      <CardContent className="p-4">
        {/* Summary Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Step Index badge */}
            <div
              className={cn(
                'h-7 w-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center flex-shrink-0',
                isSuccess
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              )}
            >
              {index + 1}
            </div>

            <div>
              <span className="text-slate-400 text-xxs font-mono block uppercase">Agent Execution Step</span>
              <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 font-sans mt-0.5">
                {step.agent_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time metric */}
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xxs font-mono">
              <Clock size={12} />
              <span>{step.execution_time_ms.toFixed(0)}ms</span>
            </div>

            <AgentStatusBadge status={step.status} />

            {/* Toggle Expand button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-600 dark:hover:text-slate-250 cursor-pointer focus:outline-none"
              aria-label={expanded ? 'Collapse detail' : 'Expand detail'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Detailed collapsible content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-border/40 flex flex-col gap-3 font-sans text-xs">
            {/* Errors display */}
            {step.errors && step.errors.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <strong className="font-bold">Errors:</strong>
                  {step.errors.map((err, i) => (
                    <span key={i} className="block font-mono text-xxs break-all">
                      {err}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step Output */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400 text-xxs font-mono flex items-center gap-1">
                <FileCode size={12} />
                <span>STEP OUTPUT PAYLOAD</span>
              </span>
              <div className="p-3 bg-slate-900 text-slate-350 dark:bg-slate-950/80 rounded-lg font-mono text-xxs overflow-x-auto max-h-60 border border-slate-950/50">
                <pre>{JSON.stringify(step.output, null, 2)}</pre>
              </div>
            </div>

            {/* Latency Breakdown Info */}
            <div className="flex items-center gap-2 text-xxs text-slate-500 dark:text-slate-450 mt-1">
              <CheckCircle size={12} className="text-emerald-500" />
              <span>Orchestrated successfully. Memory variables merged to session space.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
