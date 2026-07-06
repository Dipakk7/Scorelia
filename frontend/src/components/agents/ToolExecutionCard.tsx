// frontend/src/components/agents/ToolExecutionCard.tsx

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { AgentStatusBadge } from './AgentStatusBadge'
import { Wrench, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolExecutionCardProps {
  toolName: string
  argumentsData: Record<string, any>
  result: any
  durationMs: number
  success: boolean
  error?: string | null
  className?: string
}

export const ToolExecutionCard: React.FC<ToolExecutionCardProps> = ({
  toolName,
  argumentsData = {},
  result,
  durationMs,
  success,
  error,
  className,
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className={cn(
        'border transition-all duration-200 shadow-xs glass-card',
        success
          ? 'border-slate-150 dark:border-dark-border/40 hover:border-brand-500/25'
          : 'border-rose-250 dark:border-rose-950/40 hover:border-rose-500/40',
        className
      )}
    >
      <CardContent className="p-4">
        {/* Header Summary */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                success
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
              )}
            >
              <Wrench size={16} />
            </div>

            <div>
              <span className="text-slate-400 text-xxs font-mono block uppercase">Tool Invocations</span>
              <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                {toolName}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xxs font-mono">
              <Clock size={12} />
              <span>{durationMs.toFixed(0)}ms</span>
            </div>

            <AgentStatusBadge status={success ? 'healthy' : 'unhealthy'} />

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded text-slate-405 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-700 cursor-pointer focus:outline-none"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Expanded panel details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-border/40 flex flex-col gap-3 font-sans text-xs">
            {/* Direct Tool execution errors */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <strong className="font-bold">Execution Error:</strong>
                  <span className="font-mono text-xxs break-all">{error}</span>
                </div>
              </div>
            )}

            {/* Arguments */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xxs font-mono uppercase tracking-wider block">
                Arguments Config:
              </span>
              <div className="p-2.5 bg-slate-900 text-slate-350 dark:bg-slate-950/80 rounded font-mono text-xxs overflow-x-auto border border-slate-950/50">
                <pre>{JSON.stringify(argumentsData, null, 2)}</pre>
              </div>
            </div>

            {/* Result payload */}
            {result !== undefined && (
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xxs font-mono uppercase tracking-wider block">
                  Output Result:
                </span>
                <div className="p-2.5 bg-slate-900 text-slate-350 dark:bg-slate-950/80 rounded font-mono text-xxs overflow-x-auto border border-slate-950/50 max-h-48">
                  <pre>
                    {typeof result === 'object'
                      ? JSON.stringify(result, null, 2)
                      : String(result)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
