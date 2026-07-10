import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
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
    <Card className={cn('border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs', className)}>
      <CardHeader className="pb-4 border-b border-border/60 text-left">
        <div className="flex items-center justify-between text-left">
          <div className="flex items-center gap-2 text-left">
            <Layers size={18} className="text-brand-500" />
            <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground m-0 leading-none">
              {workflowName || 'Active Orchestrator Workflow'}
            </CardTitle>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-655 dark:text-brand-400 border border-brand-500/10 rounded-lg leading-none shrink-0">
            {executionMode}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 text-left">
        {/* SVG Workflow Steps Flow */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 overflow-x-auto py-4 scrollbar-thin text-left">
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
                  <div className="flex-1 h-0.5 min-w-[30px] md:min-w-[40px] border-t-2 border-dashed relative select-none">
                    {/* Line style updates based on progress */}
                    <div
                      className={cn(
                        'absolute top-[-2px] left-0 h-0.5 transition-all duration-500',
                        activeStepIndex !== null && idx < activeStepIndex
                          ? 'w-full bg-success'
                          : activeStepIndex === idx
                          ? 'w-1/2 bg-warning animate-pulse'
                          : 'w-0 bg-muted'
                      )}
                    />
                    
                    {/* Directional arrowhead */}
                    <div className="absolute right-0 top-[-5px] text-slate-300 dark:text-slate-700">
                      <Play size={8} className="fill-current text-slate-300 dark:text-slate-750 rotate-0" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default WorkflowGraph
