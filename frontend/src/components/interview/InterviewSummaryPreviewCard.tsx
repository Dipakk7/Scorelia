import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, Download, RotateCcw, Sparkles, FileText, Lock, ShieldCheck } from 'lucide-react'

export interface InterviewSummaryPreviewCardProps {
  onRestartSession?: () => void
}

export const InterviewSummaryPreviewCard: React.FC<InterviewSummaryPreviewCardProps> = ({
  onRestartSession,
}) => {
  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <CardHeader className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--success)]/10 via-[var(--surface-hover)] to-[var(--surface-hover)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--success)] text-white shadow-md">
              <CheckCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold text-[var(--heading)]">
                  Interview Session Completed!
                </CardTitle>
                <Badge variant="success" className="px-2.5 py-0.5 text-xs font-semibold">
                  Phase 3 Verified
                </Badge>
              </div>
              <CardDescription className="text-xs text-[var(--muted)]">
                Your response transcript has been recorded in candidate session history.
              </CardDescription>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRestartSession}
            className="h-10 gap-1.5 px-4 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            <span>Practice Another Session</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Banner Announcement */}
        <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 text-xs leading-relaxed text-[var(--body)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--primary)] mb-1">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>AI Feedback Generation Pending (Phase 4 Integration)</span>
          </div>
          <p className="text-[var(--body)]">
            Congratulations on completing your mock interview session! In the full edition (Phase 4), detailed STAR scoring breakdown, transcript analysis, filler-word frequency, and custom action plans will be available here.
          </p>
        </div>

        {/* Placeholder Summary Metric Blocks (NO FAKE SCORES) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 p-4 text-center">
            <FileText className="mx-auto mb-1.5 h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            <span className="block text-[11px] font-medium text-[var(--muted)]">Questions Answered</span>
            <span className="text-base font-bold text-[var(--heading)]">3 / 3 Completed</span>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 p-4 text-center">
            <ShieldCheck className="mx-auto mb-1.5 h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            <span className="block text-[11px] font-medium text-[var(--muted)]">Transcript Status</span>
            <span className="text-base font-bold text-[var(--heading)]">Saved & Encrypted</span>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 p-4 text-center">
            <Lock className="mx-auto mb-1.5 h-5 w-5 text-[var(--muted)]" aria-hidden="true" />
            <span className="block text-[11px] font-medium text-[var(--muted)]">AI Scoring Engine</span>
            <span className="text-base font-bold text-[var(--muted)]">Available in Phase 4</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <p className="text-xs text-[var(--muted)]">
            Official performance reports can be downloaded once AI scoring is unlocked.
          </p>

          <Button
            variant="primary"
            disabled
            className="h-10 min-h-[44px] gap-2 px-5 text-xs font-semibold opacity-60 cursor-not-allowed"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download Official Report (Phase 4)</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewSummaryPreviewCard
