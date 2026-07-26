import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Rocket, Mic, Code2, Video } from 'lucide-react'

export const UpcomingFeaturesCard: React.FC = () => {
  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Rocket className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--heading)]">
              Roadmap Teaser
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted)]">
              Scorelia V3 upcoming releases.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-5">
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
            <Mic className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[var(--heading)]">Voice AI Mode</span>
                <span className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">V3.2</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">Spoken voice interaction & tone analysis.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
            <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[var(--heading)]">Coding Sandbox</span>
                <span className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">V3.3</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">In-browser IDE & automated test suite.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5">
            <Video className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[var(--heading)]">Webcam Analytics</span>
                <span className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">V3.4</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">Eye contact & non-verbal feedback.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UpcomingFeaturesCard
