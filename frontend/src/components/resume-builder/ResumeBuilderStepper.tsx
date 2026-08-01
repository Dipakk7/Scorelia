import React from 'react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  key: string
  label: string
}

export const BUILDER_STEPS: StepItem[] = [
  { id: 1, key: 'personal', label: 'Personal' },
  { id: 2, key: 'experience', label: 'Experience' },
  { id: 3, key: 'education', label: 'Education' },
  { id: 4, key: 'skills', label: 'Skills' },
  { id: 5, key: 'projects', label: 'Projects' },
  { id: 6, key: 'certifications', label: 'Certifications' },
  { id: 7, key: 'summary', label: 'Summary' },
  { id: 8, key: 'review', label: 'Review & Optimize' },
]

interface ResumeBuilderStepperProps {
  activeStep: number
  onStepClick: (stepId: number) => void
}

export const ResumeBuilderStepper: React.FC<ResumeBuilderStepperProps> = ({
  activeStep,
  onStepClick,
}) => {
  return (
    <div className="w-full shrink-0 flex-none overflow-x-auto custom-scrollbar bg-slate-100/60 dark:bg-surface-l2/50 border border-slate-200/60 dark:border-border-subtle/40 px-2 py-1.5 rounded-[10px] transition-colors shadow-none">
      <nav className="flex items-center gap-1 min-w-max" role="tablist" aria-label="Resume builder step navigation">
        {BUILDER_STEPS.map((step) => {
          const isActive = step.id === activeStep
          const isCompleted = step.id < activeStep

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Step ${step.id}: ${step.label}`}
              onClick={() => onStepClick(step.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-xs font-medium transition-all duration-150 cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
                isActive
                  ? 'bg-purple-100/70 dark:bg-purple-600/20 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-500/40 font-semibold shadow-none'
                  : isCompleted
                  ? 'bg-transparent text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200/60 dark:hover:bg-surface-l3/60 hover:text-slate-900 dark:hover:text-white'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200/50 dark:hover:bg-surface-l3/40 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-4.5 h-4.5 rounded-full text-[10px] font-mono font-bold transition-all shrink-0',
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300/60 dark:border-purple-500/30'
                    : 'bg-slate-200/60 dark:bg-surface-l4/60 text-slate-500 dark:text-slate-400 border border-slate-300/30 dark:border-border-subtle/30'
                )}
              >
                {step.id}
              </span>
              <span className="whitespace-nowrap tracking-tight">{step.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
