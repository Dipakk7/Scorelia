import React from 'react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  title: string
  subtitle: string
}

export interface CoverLetterStepsBarProps {
  currentStep?: number
  onSelectStep?: (step: number) => void
}

const steps: StepItem[] = [
  { id: 1, title: 'Details', subtitle: 'Job & Company' },
  { id: 2, title: 'Generate', subtitle: 'AI Creation' },
  { id: 3, title: 'Customize', subtitle: 'Edit & Refine' },
  { id: 4, title: 'Review', subtitle: 'Score & Improve' },
]

export const CoverLetterStepsBar: React.FC<CoverLetterStepsBarProps> = ({
  currentStep = 1,
  onSelectStep,
}) => {
  return (
    <nav
      aria-label="Cover Letter Generation Steps"
      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 shadow-[var(--shadow-sm)]"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep?.(step.id)}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                isActive
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--heading)]'
                  : isCompleted
                  ? 'bg-[var(--surface-hover)]/60 border-[var(--border)] text-[var(--heading)] opacity-90'
                  : 'bg-transparent border-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)]/40'
              )}
            >
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-colors',
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--surface-hover)] text-[var(--muted)] border border-[var(--border)]'
                )}
              >
                {isCompleted ? '✓' : step.id}
              </div>

              <div className="min-w-0">
                <span className="block text-xs font-bold text-[var(--heading)] leading-tight truncate">
                  {step.title}
                </span>
                <span className="block text-[10px] text-[var(--muted)] font-medium leading-tight truncate mt-0.5">
                  {step.subtitle}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default CoverLetterStepsBar
