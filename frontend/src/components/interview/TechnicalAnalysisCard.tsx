import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Code2, Lock, Sparkles, Cpu, Layers } from 'lucide-react'

export const TechnicalAnalysisCard: React.FC = () => {
  const technicalDimensions = [
    { title: 'Technical Accuracy & Domain Depth', desc: 'Validates correctness of technical terms, APIs, algorithms, and architectural concepts.' },
    { title: 'Systematic Problem Solving', desc: 'Evaluates methodic breakdown of complex technical scenarios and edge cases.' },
    { title: 'Knowledge Depth & Trade-offs', desc: 'Measures depth in explaining database choices, caching layers, and latency trade-offs.' },
    { title: 'Explanation & Code Quality', desc: 'Assesses how clearly technical concepts and code structures are articulated.' },
    { title: 'Industry Best Practices', desc: 'Checks alignment with security, scalability, testing, and modern engineering standards.' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Technical Analysis
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Framework preview for engineering depth & domain accuracy.
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
          {technicalDimensions.map((dim) => (
            <div key={dim.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-[var(--heading)]">{dim.title}</h4>
                <Lock className="h-3 w-3 text-[var(--muted)]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">{dim.desc}</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[var(--primary)]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                <span>Evaluated upon AI connection.</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TechnicalAnalysisCard
