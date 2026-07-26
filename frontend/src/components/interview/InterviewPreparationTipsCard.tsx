import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, Code2, Users } from 'lucide-react'

export const InterviewPreparationTipsCard: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'star' | 'technical' | 'hr' | 'mistakes'>('star')

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Interview Prep Guide
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Curated educational topics & best practices.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-1 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTopic('star')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTopic === 'star' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            STAR Method
          </button>
          <button
            type="button"
            onClick={() => setActiveTopic('technical')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTopic === 'technical' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            Technical
          </button>
          <button
            type="button"
            onClick={() => setActiveTopic('hr')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTopic === 'hr' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            HR Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTopic('mistakes')}
            className={`rounded-lg py-1.5 transition-all cursor-pointer ${
              activeTopic === 'mistakes' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            Mistakes
          </button>
        </div>

        {/* Content Box */}
        <div className="space-y-2.5 text-xs">
          {activeTopic === 'star' && (
            <div className="space-y-2">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <span className="font-semibold text-[var(--primary)] block">S — Situation (15%)</span>
                <p className="text-[11px] text-[var(--muted)]">Provide concise background context, team size, and initial constraints.</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <span className="font-semibold text-[var(--primary)] block">T — Task (15%)</span>
                <p className="text-[11px] text-[var(--muted)]">State the specific goal or problem you were responsible for solving.</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <span className="font-semibold text-[var(--primary)] block">A — Action (50%)</span>
                <p className="text-[11px] text-[var(--muted)]">Detail your individual contributions, engineering decisions, and trade-offs.</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <span className="font-semibold text-[var(--primary)] block">R — Result (20%)</span>
                <p className="text-[11px] text-[var(--muted)]">Quantify business impact (e.g. -35% latency, +99.99% availability).</p>
              </div>
            </div>
          )}

          {activeTopic === 'technical' && (
            <div className="space-y-2 text-[11px] text-[var(--body)]">
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <span>Always discuss trade-offs (Time vs. Space complexity, Consistency vs. Availability).</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <span>Mention observability, logging, and failover strategy when designing systems.</span>
              </div>
            </div>
          )}

          {activeTopic === 'hr' && (
            <div className="space-y-2 text-[11px] text-[var(--body)]">
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <span>Align your career motivations with company core mission and product vision.</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                <span>Prepare thoughtful questions for the hiring manager about team growth and culture.</span>
              </div>
            </div>
          )}

          {activeTopic === 'mistakes' && (
            <div className="space-y-2 text-[11px] text-[var(--body)]">
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--danger)]/10 p-2.5 text-[var(--danger)]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Rambling without structure: Keep answers concise and structured.</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--danger)]/10 p-2.5 text-[var(--danger)]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Overusing "We" without explaining "I": Highlight your personal ownership.</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewPreparationTipsCard
