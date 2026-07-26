import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { TrendingUp, MessageSquare, Code2, ShieldCheck, Layers, HelpCircle, Lock } from 'lucide-react'

export const ImprovementSuggestionsCard: React.FC = () => {
  const categories = [
    { title: 'Communication Guidance', icon: MessageSquare, focus: 'Pacing, brevity, and eliminating filler vocabulary.' },
    { title: 'Technical Deepening', icon: Code2, focus: 'System architecture trade-offs, caching, & concurrency.' },
    { title: 'Behavioral Positioning', icon: ShieldCheck, focus: 'STAR framework structure and quantitative metrics.' },
    { title: 'Interview Structure', icon: Layers, focus: 'High-level summaries before diving into technical details.' },
    { title: 'Follow-up Preparation', icon: HelpCircle, focus: 'Anticipating follow-up questions from hiring managers.' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Improvement Recommendation Categories
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Action plan categories generated post-evaluation.
              </CardDescription>
            </div>
          </div>
          <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 border border-[var(--border)] text-[10px] font-bold text-[var(--muted)]">
            Category Framework
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const IconComponent = cat.icon
            return (
              <div key={cat.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                    <h4 className="text-xs font-semibold text-[var(--heading)]">{cat.title}</h4>
                  </div>
                  <Lock className="h-3 w-3 text-[var(--muted)]" aria-hidden="true" />
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">{cat.focus}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ImprovementSuggestionsCard
