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
    <div className="w-full overflow-x-auto custom-scrollbar bg-[#0b0c14]/70 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
      <nav className="flex items-center gap-1.5 min-w-max" role="tablist" aria-label="Resume builder step navigation">
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
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
                isActive
                  ? 'bg-purple-600/20 text-white border-purple-500/50 shadow-md shadow-purple-950/40'
                  : isCompleted
                  ? 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-extrabold transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                    : 'bg-white/10 text-slate-400'
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
