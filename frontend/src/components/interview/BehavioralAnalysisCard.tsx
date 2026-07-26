import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ShieldCheck, Lock, Sparkles, Users, Award } from 'lucide-react'

export const BehavioralAnalysisCard: React.FC = () => {
  const behavioralDimensions = [
    { title: 'STAR Framework Completeness', desc: 'Validates presence of Situation context, Task goals, Action ownership, and Result metrics.' },
    { title: 'Leadership & Influence', desc: 'Evaluates team guidance, mentoring, stakeholder management, and initiative.' },
    { title: 'Cross-Functional Collaboration', desc: 'Measures alignment with product, design, and engineering partners.' },
    { title: 'Extreme Ownership', desc: 'Assesses accountability for failures, post-mortem analysis, and proactive problem solving.' },
    { title: 'Decision Making Under Pressure', desc: 'Analyzes reasoning when handling production incidents and tight deadlines.' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Behavioral & STAR Analysis
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Framework preview for leadership & scenario-based answers.
              </CardDescription>
            </div>
          </div>
          <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 border border-[var(--border)] text-[10px] font-bold text-[var(--muted)]">
            Pending Backend AI
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {behavioralDimensions.map((dim) => (
            <div key={dim.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-[var(--heading)]">{dim.title}</h4>
                <Lock className="h-3 w-3 text-[var(--muted)]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">{dim.desc}</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[var(--primary)]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                <span>Generated post AI analysis.</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BehavioralAnalysisCard
