import React, { useState } from 'react'
import { Clock, CheckCircle2, ArrowRight, Play, Sparkles } from 'lucide-react'
import { mockOptimizationTimeline, type TimelineStepItem } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

export const OptimizationTimeline: React.FC = () => {
  const [selectedStepId, setSelectedStepId] = useState<string>('step-2')

  const selectedStep =
    mockOptimizationTimeline.find((s) => s.id === selectedStepId) || mockOptimizationTimeline[1]

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5 h-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            ATS Optimization Timeline & Sequence
          </h3>
          <p className="text-xs text-slate-400">
            Recommended step-by-step optimization sequence to achieve peak ATS score.
          </p>
        </div>

        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
          6 Steps Workflow
        </span>
      </div>

      {/* Timeline Steps Interactive Sequence Bar */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max p-1">
          {mockOptimizationTimeline.map((step, idx) => {
            const isSelected = selectedStepId === step.id
            const isCompleted = step.status === 'completed'
            const isInProgress = step.status === 'in-progress'

            return (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => setSelectedStepId(step.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer',
                    isSelected
                      ? 'bg-purple-600/30 text-white border-purple-500/60 shadow-md ring-1 ring-purple-500/30'
                      : isCompleted
                      ? 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800/60 hover:text-slate-200'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0',
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : step.stepNumber}
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{step.estimatedTime}</div>
                  </div>
                </div>

                {idx < mockOptimizationTimeline.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Selected Step Detailed View Card */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-400">
              Step {selectedStep.stepNumber} of 6
            </span>
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border',
                selectedStep.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : selectedStep.status === 'in-progress'
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              )}
            >
              {selectedStep.status.toUpperCase()}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">{selectedStep.title}</h4>
          <p className="text-xs text-slate-300">{selectedStep.description}</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md cursor-pointer shrink-0 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{selectedStep.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
