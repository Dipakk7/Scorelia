import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Activity, Lock, Sparkles, Gauge, Radio } from 'lucide-react'

export const ConfidenceInsightsCard: React.FC = () => {
  const confidenceDimensions = [
    { title: 'Communication Confidence', desc: 'Measures hesitation index and assertive delivery.' },
    { title: 'Response Consistency', desc: 'Validates coherence across answers without contradiction.' },
    { title: 'Speaking Pace & Rhythm', desc: 'Analyzes words-per-minute stability during complex explanations.' },
    { title: 'Professional Executive Tone', desc: 'Tracks formal vocabulary and conversational composure.' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Confidence Insights
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Delivery composure & acoustic rhythm analysis framework.
              </CardDescription>
            </div>
          </div>
          <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 border border-[var(--border)] text-[10px] font-bold text-[var(--muted)]">
            Generated Post-Interview
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {confidenceDimensions.map((dim) => (
            <div key={dim.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-[var(--heading)]">{dim.title}</h4>
                <Lock className="h-3 w-3 text-[var(--muted)]" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">{dim.desc}</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[var(--primary)]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                <span>Generated after interview completion.</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConfidenceInsightsCard
