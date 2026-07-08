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
        'border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs',
        !success && 'border-rose-350 dark:border-rose-950/60',
        className
      )}
    >
      <CardContent className="p-4">
        {/* Header Summary */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent shadow-2xs',
                success
                  ? 'bg-slate-100 dark:bg-slate-855 text-slate-655 dark:text-slate-405'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-455'
              )}
            >
              <Wrench size={16} />
            </div>

            <div className="text-left">
              <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase font-mono tracking-widest block leading-none">Tool Invocations</span>
              <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mt-1.5 font-mono leading-none">
                {toolName}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-slate-455 dark:text-slate-500 text-[10px] font-mono leading-none">
              <Clock size={12} className="text-slate-400" />
              <span>{durationMs.toFixed(0)}ms</span>
            </div>

            <AgentStatusBadge status={success ? 'healthy' : 'unhealthy'} />

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded text-slate-455 hover:bg-slate-100/50 dark:hover:bg-slate-900 hover:text-slate-700 cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Expanded panel details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850/65 flex flex-col gap-3 font-sans text-xs text-left animate-fade-in">
            {/* Direct Tool execution errors */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-655 dark:text-rose-455 rounded-xl flex gap-2 text-left">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <strong className="font-bold">Execution Error:</strong>
                  <span className="font-mono text-[10px] break-all leading-relaxed">{error}</span>
                </div>
              </div>
            )}

            {/* Arguments */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 leading-none">
                Arguments Config:
              </span>
              <div className="p-3 bg-slate-900 dark:bg-slate-950/80 rounded-xl font-mono text-[10px] overflow-x-auto border border-slate-950/50 text-left max-h-48">
                <pre className="m-0 leading-normal">{JSON.stringify(argumentsData, null, 2)}</pre>
              </div>
            </div>

            {/* Result payload */}
            {result !== undefined && (
              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-slate-455 dark:text-slate-500 text-[8px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 leading-none">
                  Output Result:
                </span>
                <div className="p-3 bg-slate-900 dark:bg-slate-950/80 rounded-xl font-mono text-[10px] overflow-x-auto border border-slate-950/50 max-h-48 text-left">
                  <pre className="m-0 leading-normal font-medium">
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
export default ToolExecutionCard
