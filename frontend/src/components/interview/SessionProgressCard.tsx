import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Activity, CheckCircle2, Circle, Clock } from 'lucide-react'

export const SessionProgressCard: React.FC = () => {
  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Session Stages
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Live interview stage timeline.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-5">
        <div className="space-y-2 text-xs">
          {/* Stage 1 */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
              <div>
                <span className="font-semibold text-[var(--heading)] block">Stage 1: Setup & Configuration</span>
                <span className="text-[10px] text-[var(--muted)]">Target role & preferences confirmed</span>
              </div>
            </div>
            <span className="rounded bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)]">Active</span>
          </div>

          {/* Stage 2 */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 opacity-60">
            <div className="flex items-center gap-2.5">
              <Circle className="h-4 w-4 text-[var(--muted)] shrink-0" aria-hidden="true" />
              <div>
                <span className="font-semibold text-[var(--muted)] block">Stage 2: AI Question Rounds</span>
                <span className="text-[10px] text-[var(--muted)]">5 questions tailored to seniority</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[var(--muted)]">Pending</span>
          </div>

          {/* Stage 3 */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 opacity-60">
            <div className="flex items-center gap-2.5">
              <Circle className="h-4 w-4 text-[var(--muted)] shrink-0" aria-hidden="true" />
              <div>
                <span className="font-semibold text-[var(--muted)] block">Stage 3: Evaluation & Feedback</span>
                <span className="text-[10px] text-[var(--muted)]">Detailed report generated post-interview</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[var(--muted)]">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SessionProgressCard
