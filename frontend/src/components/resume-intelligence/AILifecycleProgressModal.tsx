import React, { useState, useEffect } from 'react'
import { Sparkles, CheckCircle2, Loader2, Bot, Check, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepItem {
  id: string
  label: string
  durationMs: number
}

const lifecycleSteps: StepItem[] = [
  { id: 'prep', label: 'Preparing Resume Document', durationMs: 800 },
  { id: 'parse', label: 'Parsing Structural Sections & Headers', durationMs: 1000 },
  { id: 'ats', label: 'Running ATS Keyword Density Scanner', durationMs: 1200 },
  { id: 'ai', label: 'Running AI Recruiter & Quality Scoring', durationMs: 1400 },
  { id: 'recs', label: 'Generating Tailored Recommendations', durationMs: 1000 },
  { id: 'report', label: 'Building Final Intelligence Report', durationMs: 600 },
]

interface AILifecycleProgressModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AILifecycleProgressModal: React.FC<AILifecycleProgressModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0)
      setIsCompleted(false)
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>

    const advanceStep = (index: number) => {
      if (index >= lifecycleSteps.length) {
        setIsCompleted(true)
        timeoutId = setTimeout(() => {
          onClose()
        }, 1200)
        return
      }

      const step = lifecycleSteps[index]
      timeoutId = setTimeout(() => {
        setCurrentStepIndex(index + 1)
        advanceStep(index + 1)
      }, step.durationMs)
    }

    advanceStep(0)

    return () => clearTimeout(timeoutId)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const progressPercent = Math.min(
    100,
    Math.round((currentStepIndex / lifecycleSteps.length) * 100)
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[#0b0c14] border border-purple-800/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden text-slate-100">
        {/* Glow background accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
            ) : (
              <Bot className="w-6 h-6 text-purple-300 animate-pulse" />
            )}
          </div>
          <div>
            <h2 id="ai-modal-title" className="text-base font-bold text-white tracking-tight">
              {isCompleted ? 'Analysis Completed!' : 'Scorelia AI Intelligence Pipeline'}
            </h2>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Your resume report has been updated.'
                : 'Processing resume deep review...'}
            </p>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-purple-300 font-mono">
              {isCompleted ? '100% Ready' : `Step ${Math.min(currentStepIndex + 1, lifecycleSteps.length)} of ${lifecycleSteps.length}`}
            </span>
            <span className="text-slate-400 font-mono font-bold">{progressPercent}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stepper Checklist */}
        <div className="flex flex-col gap-2 my-1 max-h-56 overflow-y-auto custom-scrollbar pr-1">
          {lifecycleSteps.map((step, idx) => {
            const isDone = idx < currentStepIndex || isCompleted
            const isCurrent = idx === currentStepIndex && !isCompleted

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center justify-between p-2 rounded-xl text-xs transition-all',
                  isDone && 'bg-slate-900/40 text-slate-300',
                  isCurrent && 'bg-purple-950/40 border border-purple-800/40 text-white font-semibold',
                  !isDone && !isCurrent && 'text-slate-500 opacity-60'
                )}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{step.label}</span>
                </div>

                {isDone && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Done</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Recruiter Standard AI Engine
          </span>
          <span className="text-slate-500 font-mono">Press Esc to dismiss</span>
        </div>
      </div>
    </div>
  )
}

export default AILifecycleProgressModal
