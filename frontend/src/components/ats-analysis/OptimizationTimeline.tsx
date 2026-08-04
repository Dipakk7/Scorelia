import React, { useState } from 'react'
import { Clock, CheckCircle2, ArrowRight, Play, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { mockOptimizationTimeline, type TimelineStepItem } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

export const OptimizationTimeline: React.FC = () => {
  const [selectedStepId, setSelectedStepId] = useState<string>('step-2')

  const selectedStep =
    mockOptimizationTimeline.find((s) => s.id === selectedStepId) || mockOptimizationTimeline[1]

  const completedCount = mockOptimizationTimeline.filter((s) => s.status === 'completed').length
  const totalSteps = mockOptimizationTimeline.length
  const progressPercent = Math.round((completedCount / totalSteps) * 100)

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-xl h-full flex flex-col justify-start gap-3.5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              ATS Optimization Timeline & Sequence
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Recommended step-by-step optimization sequence to achieve peak ATS score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 shadow-sm">
            6 Steps Workflow ({completedCount}/{totalSteps} Done)
          </span>
        </div>
      </div>

      {/* 2. Workflow Analytics Summary KPI Grid (Fills empty vertical space) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span>Overall Progress</span>
            <span className="font-mono font-bold text-purple-300">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 border border-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-0.5 shadow-inner">
          <span className="text-[10px] text-slate-400 font-sans block">Remaining Time</span>
          <div className="text-xs sm:text-sm font-bold text-slate-100 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> 30 Mins
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-0.5 shadow-inner">
          <span className="text-[10px] text-slate-400 font-sans block">Potential ATS Boost</span>
          <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18 Points
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-0.5 shadow-inner">
          <span className="text-[10px] text-slate-400 font-sans block">Optimization Stage</span>
          <div className="text-xs sm:text-sm font-bold text-purple-300 truncate font-sans flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Phase 2: Keywords
          </div>
        </div>
      </div>

      {/* 3. Timeline Steps Interactive Sequence Stepper Bar */}
      <div className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-inner space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span className="font-semibold text-slate-300">Optimization Roadmap Sequence</span>
          <span>Click step to inspect & execute</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
          {mockOptimizationTimeline.map((step) => {
            const isSelected = selectedStepId === step.id
            const isCompleted = step.status === 'completed'
            const isInProgress = step.status === 'in-progress'

            return (
              <button
                type="button"
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer w-full justify-start shadow-sm',
                  isSelected
                    ? 'bg-purple-600/30 text-white border-purple-500/60 shadow-md ring-1 ring-purple-500/40'
                    : isCompleted
                    ? 'bg-slate-950/90 text-slate-300 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-slate-900'
                    : isInProgress
                    ? 'bg-purple-950/30 text-purple-200 border-purple-500/30 hover:border-purple-500/50'
                    : 'bg-slate-950/50 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 shadow-sm',
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isInProgress
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : step.stepNumber}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1 text-left">
                  <div className="font-semibold text-[11px] sm:text-xs truncate">{step.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{step.estimatedTime}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Selected Step Detailed View Card */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-purple-400">
              Step {selectedStep.stepNumber} of 6
            </span>
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm',
                selectedStep.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : selectedStep.status === 'in-progress'
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              )}
            >
              {selectedStep.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> {selectedStep.estimatedTime}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-100 tracking-tight">{selectedStep.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedStep.description}</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md cursor-pointer shrink-0 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{selectedStep.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
