// frontend/src/components/agents/WorkflowGraph.tsx

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
    <Card className={cn('glass-card border border-slate-200 dark:border-dark-border', className)}>
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-dark-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-brand-500" />
            <CardTitle className="text-sm font-semibold font-display text-slate-800 dark:text-slate-200">
              {workflowName || 'Active Orchestrator Workflow'}
            </CardTitle>
          </div>
          <span className="px-2 py-0.5 text-xxs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400 rounded-md uppercase tracking-wider font-mono">
            {executionMode}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* SVG Workflow Steps Flow */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 overflow-x-auto py-4 scrollbar-thin">
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
                border: 'border-slate-350 dark:border-slate-700 border-dashed',
                bg: 'bg-slate-50 dark:bg-slate-900',
                text: 'text-slate-400 dark:text-slate-500',
                icon: <div className="h-2 w-2 rounded-full bg-slate-450 dark:bg-slate-655" />,
              },
              running: {
                border: 'border-amber-500 ring-2 ring-amber-500/30 animate-pulse',
                bg: 'bg-amber-50 dark:bg-amber-950/20',
                text: 'text-amber-600 dark:text-amber-400',
                icon: <Loader2 size={16} className="animate-spin text-amber-500" />,
              },
              completed: {
                border: 'border-emerald-500 shadow-sm shadow-emerald-500/10',
                bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                text: 'text-emerald-600 dark:text-emerald-400',
                icon: <CheckCircle2 size={16} className="text-emerald-500" />,
              },
              failed: {
                border: 'border-rose-500 ring-2 ring-rose-500/30',
                bg: 'bg-rose-50 dark:bg-rose-950/20',
                text: 'text-rose-600 dark:text-rose-400',
                icon: <AlertTriangle size={16} className="text-rose-500" />,
              },
            }[status]

            return (
              <React.Fragment key={idx}>
                {/* Step Node */}
                <div className="flex flex-col items-center text-center group relative z-10 flex-1 min-w-[130px]">
                  {/* Outer ring */}
                  <div
                    className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center border-2 transition-all duration-350 shadow-xs',
                      config.border,
                      config.bg
                    )}
                  >
                    {config.icon}
                  </div>

                  {/* Labels */}
                  <div className="mt-3 font-sans">
                    <span className="text-slate-400 text-xxs font-mono block">Step {idx + 1}</span>
                    <span className="font-semibold text-xs text-slate-700 dark:text-slate-350 block leading-tight mt-0.5 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-150">
                      {step.name}
                    </span>
                    <span className="text-xxs text-slate-400 font-mono block mt-1 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-dark-border/40 truncate max-w-[120px] mx-auto">
                      {step.target}
                    </span>
                  </div>

                  {/* Error tooltip */}
                  {status === 'failed' && error && (
                    <div className="absolute top-14 bg-slate-900 text-white text-xxs p-2 rounded border border-rose-500 shadow-xl max-w-[200px] z-25 text-left font-sans animate-fade-in">
                      <span className="text-rose-400 font-bold block mb-0.5">Execution Failed:</span>
                      {error}
                    </div>
                  )}
                </div>

                {/* Connecting arrow/line */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 min-w-[30px] md:min-w-[40px] border-t-2 border-dashed relative">
                    {/* Line style updates based on progress */}
                    <div
                      className={cn(
                        'absolute top-[-2px] left-0 h-0.5 transition-all duration-500',
                        activeStepIndex !== null && idx < activeStepIndex
                          ? 'w-full bg-emerald-500'
                          : activeStepIndex === idx
                          ? 'w-1/2 bg-amber-400 animate-pulse'
                          : 'w-0 bg-slate-200 dark:bg-slate-700'
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
