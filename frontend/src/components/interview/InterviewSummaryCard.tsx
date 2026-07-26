import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LayoutDashboard, CheckCircle2, Clock, ShieldCheck, FileCheck } from 'lucide-react'
import type { AdaptedInterviewSession } from '@/lib/interview-adapter'

export interface InterviewSummaryCardProps {
  session?: AdaptedInterviewSession | null
}

export const InterviewSummaryCard: React.FC<InterviewSummaryCardProps> = ({
  session,
}) => {
  const turnsCount = session?.turns?.length ?? 0
  const totalQuestions = session?.totalQuestions ?? 5
  const company = session?.companyName || 'Target Company'
  const role = session?.targetRole || 'Senior Engineer'
  const status = session?.status || 'COMPLETED'
  const difficulty = session?.difficulty || 'MEDIUM'

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Session Summary & Metadata
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Overview of completed session parameters.
              </CardDescription>
            </div>
          </div>

          <Badge variant={status === 'COMPLETED' ? 'success' : 'info'} className="px-2.5 py-0.5 text-xs font-semibold">
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
            <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0" aria-hidden="true" />
            <div>
              <span className="text-[var(--muted)] block">Questions Answered</span>
              <strong className="text-sm font-bold text-[var(--heading)]">{turnsCount} of {totalQuestions} Turns</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
            <Clock className="h-5 w-5 text-[var(--primary)] shrink-0" aria-hidden="true" />
            <div>
              <span className="text-[var(--muted)] block">Estimated Duration</span>
              <strong className="text-sm font-bold text-[var(--heading)]">20 Minutes</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
            <ShieldCheck className="h-5 w-5 text-[var(--primary)] shrink-0" aria-hidden="true" />
            <div>
              <span className="text-[var(--muted)] block">Difficulty Benchmark</span>
              <strong className="text-sm font-bold text-[var(--heading)]">{difficulty}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3 text-xs text-[var(--body)]">
          <FileCheck className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>
            Candidate profile practice record for <strong>{role}</strong> position at <strong>{company}</strong>.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewSummaryCard
