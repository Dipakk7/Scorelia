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
    <div className="w-full shrink-0 flex-none overflow-x-auto custom-scrollbar bg-[#0b0c14]/90 border border-slate-800/90 px-3 py-1.5 rounded-xl shadow-xs scroll-smooth">
      <nav className="flex items-center gap-2 min-w-max shrink-0 flex-none" role="tablist" aria-label="Resume builder step navigation">
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
                'inline-flex items-center gap-2 px-3.5 py-1.5 h-8 min-h-[32px] rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex-none transition-all duration-200 cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                isActive
                  ? 'bg-purple-600/20 text-white border-purple-500/50 font-extrabold shadow-xs'
                  : isCompleted
                  ? 'bg-transparent text-slate-200 border-transparent hover:bg-slate-900/60 hover:text-white'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-900/40 hover:text-slate-200'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-mono font-bold transition-all shrink-0',
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
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
