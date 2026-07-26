import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { CheckCircle2, Clock, Sparkles, AlertCircle } from 'lucide-react'

export const InterviewFeedbackTimeline: React.FC = () => {
  const timelineStages = [
    { title: 'Interview Session Started', status: 'completed', desc: 'Parameters & resume profile selected' },
    { title: 'Questions Answered', status: 'completed', desc: 'Transcript responses recorded' },
    { title: 'AI Analysis Pending', status: 'active', desc: 'Awaiting backend LLM evaluation engine' },
    { title: 'Feedback Generation', status: 'pending', desc: 'STAR scoring & action plan assembly' },
    { title: 'Official Report Ready', status: 'pending', desc: 'PDF export & analytics center sync' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Analysis & Feedback Timeline
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Evaluation pipeline progress status.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="relative space-y-3.5 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-[var(--border)]">
          {timelineStages.map((stage, idx) => {
            const isDone = stage.status === 'completed'
            const isActive = stage.status === 'active'

            return (
              <div key={stage.title} className="relative flex items-start gap-3 text-xs">
                <div
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                    isDone
                      ? 'border-[var(--success)] bg-[var(--success)] text-white shadow-sm'
                      : isActive
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md ring-4 ring-[var(--primary)]/20'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 fill-current" aria-hidden="true" />
                  ) : isActive ? (
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isActive ? 'text-[var(--primary)] font-bold' : isDone ? 'text-[var(--heading)]' : 'text-[var(--muted)]'}`}>
                      {stage.title}
                    </span>
                    <span className="text-[10px] font-medium text-[var(--muted)] capitalize">{stage.status}</span>
                  </div>
                  <span className="mt-0.5 block text-[10px] text-[var(--muted)]">{stage.desc}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3 text-[11px] text-[var(--body)] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Full real-time scoring will occur once backend AI APIs are connected.</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewFeedbackTimeline
