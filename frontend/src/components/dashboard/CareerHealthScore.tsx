import { Activity, Award, MessageSquareCode, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CountUpText } from '@/components/ui/CountUpText'
import { ScoreRing } from '@/components/ui/ScoreRing'

interface CareerHealthScoreProps {
  atsScore: number
  interviewSessions: number
  interviewQualityScore?: number // Optional quality metric for future extensibility
  careerProgress: number
  hasResumes: boolean
}

export default function CareerHealthScore({
  atsScore,
  interviewSessions,
  interviewQualityScore,
  careerProgress,
  hasResumes
}: CareerHealthScoreProps) {
  // Temporary session-based heuristic for interview score.
  // If a future quality metric is supplied, we use it directly.
  const interviewScore = interviewQualityScore !== undefined && interviewQualityScore > 0
    ? interviewQualityScore
    : interviewSessions > 0
      ? Math.min(100, 40 + (interviewSessions * 20))
      : 0

  // Overall Health Score calculation
  // ATS (40%) + Interview (30%) + Roadmap Progress (30%)
  const rawScore = (atsScore * 0.4) + (interviewScore * 0.3) + (careerProgress * 0.3)
  const healthScore = hasResumes ? Math.round(rawScore) : 0

  // Status mapping
  const getHealthStatus = (score: number) => {
    if (!hasResumes) return { label: 'Inactive', color: 'text-muted-foreground', border: 'border-border/60 bg-surface-hover/20' }
    if (score >= 85) return { label: 'Excellent', color: 'text-success', border: 'border-success/30 bg-success/5' }
    if (score >= 70) return { label: 'Healthy', color: 'text-primary', border: 'border-primary/30 bg-primary/5' }
    if (score >= 50) return { label: 'Calibration Needed', color: 'text-warning', border: 'border-warning/30 bg-warning/5' }
    return { label: 'Critical Attention', color: 'text-danger', border: 'border-danger/30 bg-danger/5' }
  }

  const status = getHealthStatus(healthScore)

  return (
    <div className={cn("border rounded-xl p-6 flex flex-col justify-between h-full select-none", status.border)}>
      <div className="space-y-5">
        <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-wider font-mono">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-primary stroke-[1.75]" />
            <span>Career Health Score</span>
          </div>
          <span className={cn("font-bold uppercase font-mono px-2 py-0.5 rounded border text-[9px] bg-background/50", status.color)}>
            {status.label}
          </span>
        </div>

        {/* Large visual score circle */}
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <ScoreRing
            value={healthScore}
            size={96}
            strokeWidth={6}
            color={healthScore >= 85 ? '--success' : healthScore >= 70 ? '--primary' : healthScore >= 50 ? '--warning' : '--destructive'}
            subLabel="/ 100"
          />
          <p className="text-[10px] text-muted-foreground font-sans font-medium text-center max-w-[200px] leading-relaxed">
            Composite metrics index evaluating ATS coverage, verbal mock readiness, and milestones completion.
          </p>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3.5 border-t border-border/40 pt-4">
          {/* Row 1: Resume & ATS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5 font-sans">
                <FileText size={13} className="text-primary stroke-[1.75]" />
                <span>Resume & ATS Score</span>
              </span>
              <span className="text-foreground font-bold font-mono">
                {hasResumes ? <CountUpText value={atsScore} suffix="%" /> : '0%'}
              </span>
            </div>
            <div className="w-full bg-border/40 rounded-full h-1 overflow-hidden relative">
              <div
                className="bg-primary h-full rounded-full progress-fill progress-shimmer"
                style={{ transform: `scaleX(${hasResumes ? atsScore : 0} / 100)` }}
              />
            </div>
          </div>

          {/* Row 2: Interview Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5 font-sans">
                <MessageSquareCode size={13} className="text-warning stroke-[1.75]" />
                <span>Interview Score</span>
              </span>
              <span className="text-foreground font-bold font-mono">
                {hasResumes ? <CountUpText value={interviewScore} suffix="%" /> : '0%'}
              </span>
            </div>
            <div className="w-full bg-border/40 rounded-full h-1 overflow-hidden relative">
              <div
                className="bg-warning h-full rounded-full progress-fill progress-shimmer"
                style={{ transform: `scaleX(${hasResumes ? interviewScore : 0} / 100)` }}
              />
            </div>
          </div>

          {/* Row 3: Roadmap Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5 font-sans">
                <Award size={13} className="text-career stroke-[1.75]" />
                <span>Roadmap Progress</span>
              </span>
              <span className="text-foreground font-bold font-mono">
                {hasResumes ? <CountUpText value={careerProgress} suffix="%" /> : '0%'}
              </span>
            </div>
            <div className="w-full bg-border/40 rounded-full h-1 overflow-hidden relative">
              <div
                className="bg-career h-full rounded-full progress-fill progress-shimmer"
                style={{ transform: `scaleX(${hasResumes ? careerProgress : 0} / 100)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
