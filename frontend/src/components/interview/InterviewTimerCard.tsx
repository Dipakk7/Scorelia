import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Clock, Pause, Play, Square } from 'lucide-react'

export const InterviewTimerCard: React.FC = () => {
  const targetMinutes = 20
  const progressPercent = 0
  const strokeDasharray = 283
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercent) / 100

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Session Timer
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Turn & overall duration monitor.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Circular Progress & Clock Display */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[var(--surface-hover)]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[var(--primary)] transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <Clock className="absolute h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            </div>

            <div role="timer" aria-label="Interview Elapsed Timer">
              <div className="flex items-baseline gap-1 font-mono text-2xl font-bold tracking-tight text-[var(--heading)]">
                <span>00</span>
                <span className="text-[var(--muted)]">:</span>
                <span>00</span>
                <span className="text-[var(--muted)]">:</span>
                <span>00</span>
              </div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Target Duration: {targetMinutes} minutes
              </p>
            </div>
          </div>

          {/* Action Control Buttons (WCAG min-h-[44px] Touch Targets) */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-10 min-h-[44px] gap-1.5 px-3.5 text-xs opacity-60 cursor-not-allowed"
              aria-label="Pause Timer (Disabled)"
            >
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Pause</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-10 min-h-[44px] gap-1.5 px-3.5 text-xs opacity-60 cursor-not-allowed"
              aria-label="Resume Timer (Disabled)"
            >
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              <span>Resume</span>
            </Button>

            <Button
              variant="danger"
              size="sm"
              disabled
              className="h-10 min-h-[44px] gap-1.5 px-3.5 text-xs opacity-60 cursor-not-allowed"
              aria-label="End Interview (Disabled)"
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              <span>End</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewTimerCard
