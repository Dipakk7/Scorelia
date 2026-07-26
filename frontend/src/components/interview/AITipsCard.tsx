import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Sparkles, MessageSquare, Target } from 'lucide-react'

export const AITipsCard: React.FC = () => {
  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Real-Time AI Tips
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Contextual guidance for active questions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-5 text-xs">
        <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--primary)] mb-1">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Target Response Focus</span>
          </div>
          <p className="text-[11px] text-[var(--body)] leading-relaxed">
            Highlight specific leadership metrics and architectural trade-offs to demonstrate senior engineering authority.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--heading)] mb-1">
            <MessageSquare className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
            <span>Conciseness Advice</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Keep your introductory statement under 2 minutes (~250 words) to leave ample time for technical follow-ups.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AITipsCard
