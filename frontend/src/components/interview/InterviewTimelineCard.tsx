import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { CheckCircle2, Circle, Clock, Milestone } from 'lucide-react'

export interface InterviewTimelineCardProps {
  currentStepIndex?: number
}

export const InterviewTimelineCard: React.FC<InterviewTimelineCardProps> = ({
  currentStepIndex = 2,
}) => {
  const steps = [
    { title: 'Welcome & Briefing', category: 'Phase 1', duration: '1 Min' },
    { title: 'Candidate Introduction', category: 'Warm-up', duration: '3 Min' },
    { title: 'Technical Question 1', category: 'System Architecture', duration: '5 Min' },
    { title: 'Technical Question 2', category: 'Algorithmic Optimization', duration: '5 Min' },
    { title: 'Behavioral Scenario', category: 'Team Leadership', duration: '4 Min' },
    { title: 'Session Wrap-up', category: 'Summary Preview', duration: '2 Min' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Milestone className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Session Timeline
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Interactive progression map.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="relative space-y-4 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-[var(--border)]">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isActive = idx === currentStepIndex
            const isPending = idx > currentStepIndex

            return (
              <div key={step.title} className="relative flex items-start gap-3 text-xs">
                {/* Timeline Icon / Node */}
                <div
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                    isCompleted
                      ? 'border-[var(--success)] bg-[var(--success)] text-white shadow-sm'
                      : isActive
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md ring-4 ring-[var(--primary)]/20'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 fill-current" aria-hidden="true" />
                  ) : isActive ? (
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Content Details */}
                <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isActive ? 'text-[var(--primary)] font-bold' : isCompleted ? 'text-[var(--heading)]' : 'text-[var(--muted)]'}`}>
                      {step.title}
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">{step.duration}</span>
                  </div>
                  <span className="mt-0.5 block text-[10px] text-[var(--muted)]">
                    {step.category} • {isCompleted ? 'Completed' : isActive ? 'Active Step' : 'Upcoming'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewTimelineCard
