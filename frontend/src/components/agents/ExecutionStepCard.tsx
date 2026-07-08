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
        'border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs',
        !isSuccess && 'border-rose-350 dark:border-rose-950/60',
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
                'h-7 w-7 rounded-xl text-xs font-black font-mono flex items-center justify-center flex-shrink-0 leading-none shadow-2xs border border-transparent',
                isSuccess
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/10'
                  : 'bg-rose-500/10 text-rose-650 dark:text-rose-455 border-rose-500/10'
              )}
            >
              {index + 1}
            </div>

            <div className="text-left">
              <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase font-mono tracking-widest block leading-none">Agent Execution Step</span>
              <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 font-sans mt-1.5 leading-none">
                {step.agent_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Time metric */}
            <div className="flex items-center gap-1 text-slate-455 dark:text-slate-500 text-[10px] font-mono leading-none">
              <Clock size={12} className="text-slate-400" />
              <span>{step.execution_time_ms.toFixed(0)}ms</span>
            </div>

            <AgentStatusBadge status={step.status} />

            {/* Toggle Expand button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-md text-slate-455 hover:bg-slate-100/50 dark:hover:bg-slate-900 hover:text-slate-700 cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
              aria-label={expanded ? 'Collapse detail' : 'Expand detail'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Detailed collapsible content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850/65 flex flex-col gap-3 font-sans text-xs text-left animate-fade-in">
            {/* Errors display */}
            {step.errors && step.errors.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-455 rounded-xl flex gap-2 text-left">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <strong className="font-bold">Errors:</strong>
                  {step.errors.map((err, i) => (
                    <span key={i} className="block font-mono text-[10px] break-all leading-relaxed">
                      {err}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step Output */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 leading-none">
                <FileCode size={12} className="text-slate-400" />
                <span>Step Output Payload</span>
              </span>
              <div className="p-3 bg-slate-900 dark:bg-slate-950/80 rounded-xl font-mono text-[10px] overflow-x-auto max-h-60 border border-slate-950/50 text-left">
                <pre className="m-0 leading-normal">{JSON.stringify(step.output, null, 2)}</pre>
              </div>
            </div>

            {/* Latency Breakdown Info */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-550 dark:text-slate-450 mt-1 select-none leading-none">
              <CheckCircle size={12} className="text-emerald-500" />
              <span>Orchestrated successfully. Memory variables merged to session space.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default ExecutionStepCard
