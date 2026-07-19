import React from 'react'
import { Layers, CheckCircle2, AlertTriangle, Loader2, Play } from 'lucide-react'
import type { WorkflowStep } from '@/types/agent'
import { cn } from '@/lib/utils'

interface WorkflowGraphProps {
  workflowName: string
  steps: WorkflowStep[]
  activeStepIndex: number | null
  stepStatusMap?: Record<number, 'pending' | 'running' | 'completed' | 'failed'>
  stepErrorsMap?: Record<number, string>
  executionMode?: 'sequential' | 'parallel' | string
  className?: string
}

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({
  workflowName,
  steps,
  activeStepIndex,
  stepStatusMap = {},
  stepErrorsMap = {},
  executionMode = 'sequential',
  className,
}) => {
  return (
    <div className={cn('border border-[var(--border)] bg-[var(--surface-hover)]/30 backdrop-blur-md rounded-2xl p-4 text-left font-sans text-xs flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between text-left select-none">
        <div className="flex items-center gap-2 text-left">
          <Layers size={14} className="text-[var(--primary)]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--heading)] leading-none">
            {workflowName || 'Active Orchestrator Workflow'}
          </span>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/10 rounded-lg leading-none shrink-0">
          {executionMode}
        </span>
      </div>
      
      {/* SVG Workflow Steps Flow */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 overflow-x-auto py-2 scrollbar-thin text-left">
        {steps.map((step, idx) => {
          // Determine status
          let status: 'pending' | 'running' | 'completed' | 'failed' = 'pending'
          if (stepStatusMap[idx]) {
            status = stepStatusMap[idx]
          } else if (activeStepIndex === idx) {
            status = 'running'
          } else if (activeStepIndex !== null && idx < activeStepIndex) {
            status = 'completed'
          }

          const error = stepErrorsMap[idx]

          const config = {
            pending: {
              border: 'border-border border-dashed',
              bg: 'bg-slate-50/20 dark:bg-slate-900/35',
              text: 'text-slate-400 dark:text-slate-550',
              icon: <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-655 animate-pulse" />,
            },
            running: {
              border: 'border-warning ring-2 ring-warning/20 animate-pulse',
              bg: 'bg-warning/5 dark:bg-warning/10',
              text: 'text-warning',
              icon: <Loader2 size={16} className="animate-spin text-warning" />,
            },
            completed: {
              border: 'border-success/20 shadow-2xs border-success/20',
              bg: 'bg-success/10 dark:bg-success/20',
              text: 'text-success',
              icon: <CheckCircle2 size={16} className="text-success" />,
            },
            failed: {
              border: 'border-destructive ring-2 ring-destructive/20',
              bg: 'bg-destructive/10 dark:bg-destructive/20',
              text: 'text-destructive',
              icon: <AlertTriangle size={16} className="text-destructive" />,
            },
          }[status]

          return (
            <React.Fragment key={idx}>
              {/* Step Node */}
              <div className="flex flex-col items-center text-center group relative z-10 flex-1 min-w-[130px]">
                {/* Outer ring */}
                <div
                  className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center border-2 transition-all duration-350 shadow-xs cursor-default',
                    config.border,
                    config.bg
                  )}
                >
                  {config.icon}
                </div>

                {/* Labels */}
                <div className="mt-3 font-sans">
                  <span className="text-muted-foreground text-[8px] font-black uppercase font-mono tracking-widest block leading-none">Step {idx + 1}</span>
                  <span className="font-extrabold text-xs text-foreground block leading-tight mt-1.5 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-150">
                    {step.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono block mt-1.5 bg-muted px-2 py-0.5 rounded-lg border border-border/40 truncate max-w-[120px] mx-auto leading-none font-bold">
                    {step.target}
                  </span>
                </div>

                {/* Error tooltip */}
                {status === 'failed' && error && (
                  <div className="absolute top-14 bg-muted text-foreground text-[10px] p-2.5 rounded-xl border border-destructive shadow-xl max-w-[200px] z-25 text-left font-sans animate-fade-in font-medium leading-relaxed">
                    <span className="text-destructive font-black uppercase tracking-wider block mb-1">Execution Failed</span>
                    {error}
                  </div>
                )}
              </div>

              {/* Connecting arrow/line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 w-0.5 h-6 md:h-0.5 md:w-full border-l-2 md:border-l-0 md:border-t-2 border-dashed relative select-none min-h-[24px] md:min-h-0 min-w-[30px] md:min-w-[40px]">
                  {/* Line style updates based on progress */}
                  <div
                    className={cn(
                      'absolute top-0 left-0 md:top-[-2px] transition-all duration-500',
                      activeStepIndex !== null && idx < activeStepIndex
                        ? 'w-full h-full bg-success'
                        : activeStepIndex === idx
                        ? 'w-full h-1/2 md:w-1/2 md:h-full bg-warning animate-pulse'
                        : 'w-0 h-0 bg-muted'
                    )}
                  />
                  
                  {/* Directional arrowhead */}
                  <div className="absolute left-[-3.5px] bottom-0 md:bottom-auto md:left-auto md:right-0 md:top-[-5px] text-slate-305 dark:text-slate-655">
                    <Play size={8} className="fill-current rotate-90 md:rotate-0" />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
export default WorkflowGraph
