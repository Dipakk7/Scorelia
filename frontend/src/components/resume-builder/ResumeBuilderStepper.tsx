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

interface ResumeStepBadgeProps {
  stepId: number
  isActive: boolean
}

export const ResumeStepBadge: React.FC<ResumeStepBadgeProps> = ({ stepId, isActive }) => {
  return (
    <span
      className={cn(
        'flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold transition-all duration-200 shrink-0',
        isActive
          ? 'bg-white text-purple-600 shadow-xs'
          : 'bg-slate-200 dark:bg-[#1f2238] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10'
      )}
    >
      {stepId}
    </span>
  )
}

interface ResumeStepItemProps {
  step: StepItem
  isActive: boolean
  onClick: () => void
}

export const ResumeStepItem: React.FC<ResumeStepItemProps> = ({ step, isActive, onClick }) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-current={isActive ? 'step' : undefined}
      aria-label={`Step ${step.id}: ${step.label}`}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
        isActive
          ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/30 font-bold'
          : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-[#1f2238] hover:text-slate-900 dark:hover:text-white'
      )}
    >
      <ResumeStepBadge stepId={step.id} isActive={isActive} />
      <span className="whitespace-nowrap tracking-tight">{step.label}</span>
    </button>
  )
}

interface ResumeBuilderStepperProps {
  activeStep: number
  onStepClick: (stepId: number) => void
}

export const ResumeBuilderStepper: React.FC<ResumeBuilderStepperProps> = ({
  activeStep,
  onStepClick,
}) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.08] p-2 rounded-2xl shadow-sm transition-colors">
      <nav className="flex items-center gap-2 min-w-max" role="tablist" aria-label="Resume builder step navigation">
        {BUILDER_STEPS.map((step) => (
          <ResumeStepItem
            key={step.id}
            step={step}
            isActive={step.id === activeStep}
            onClick={() => onStepClick(step.id)}
          />
        ))}
      </nav>
    </div>
  )
}
