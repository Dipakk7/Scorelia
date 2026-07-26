import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LayoutDashboard, Target, Briefcase, Award, Clock, FileText } from 'lucide-react'

export const InterviewOverviewCard: React.FC = () => {
  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Session Overview
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Preset configuration parameters.
              </CardDescription>
            </div>
          </div>
          <Badge variant="info" className="px-2 py-0.5 text-[10px] font-semibold">
            Ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="flex items-center gap-1.5 text-[var(--muted)]">
              <Briefcase className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              Role:
            </span>
            <span className="font-semibold text-[var(--heading)]">Senior Full Stack</span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="flex items-center gap-1.5 text-[var(--muted)]">
              <FileText className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              Resume:
            </span>
            <span className="font-semibold text-[var(--heading)]">v2.4 Selected</span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="flex items-center gap-1.5 text-[var(--muted)]">
              <Target className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              Type:
            </span>
            <span className="font-semibold text-[var(--heading)]">Technical & HR</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[var(--muted)]">
              <Clock className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              Duration:
            </span>
            <span className="font-semibold text-[var(--heading)]">20 Minutes</span>
          </div>
        </div>

        <p className="text-center text-[11px] text-[var(--muted)]">
          Press "Start Interview" in the header when ready to initialize your AI session.
        </p>
      </CardContent>
    </Card>
  )
}

export default InterviewOverviewCard
