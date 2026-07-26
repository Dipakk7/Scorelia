import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Volume2, Mic, Sparkles, Brain, Award } from 'lucide-react'

export interface AIInterviewerCardProps {
  interviewerName?: string
  interviewerRole?: string
  status?: 'speaking' | 'listening' | 'thinking' | 'ready'
  interviewerStatus?: 'speaking' | 'listening' | 'thinking' | 'ready'
  personaSummary?: string
  currentPhase?: string
  greetingMessage?: string
}

export const AIInterviewerCardComponent: React.FC<AIInterviewerCardProps> = ({
  interviewerName = 'Dr. Alex Vance',
  interviewerRole = 'Principal AI Engineering Evaluator',
  status,
  interviewerStatus,
  personaSummary = 'Adaptive interviewer tailored for Senior Technical & Systems Architecture roles.',
  currentPhase = 'Technical Questions',
  greetingMessage,
}) => {
  const activeStatus = status ?? interviewerStatus ?? 'ready'

  const getStatusBadge = () => {
    switch (activeStatus) {
      case 'speaking':
        return (
          <Badge variant="info" className="px-3 py-1 text-xs font-semibold animate-pulse">
            <Volume2 className="mr-1.5 h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
            AI Speaking...
          </Badge>
        )
      case 'listening':
        return (
          <Badge variant="success" className="px-3 py-1 text-xs font-semibold">
            <Mic className="mr-1.5 h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
            Listening to Candidate
          </Badge>
        )
      case 'thinking':
        return (
          <Badge variant="warning" className="px-3 py-1 text-xs font-semibold animate-pulse">
            <Brain className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Evaluating Response...
          </Badge>
        )
      case 'ready':
      default:
        return (
          <Badge variant="neutral" className="px-3 py-1 text-xs font-semibold">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
            Ready for Next Turn
          </Badge>
        )
    }
  }

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* AI Avatar */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-indigo-600 text-white shadow-md">
              <Brain className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--surface)] text-[10px]">
                ⚡
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-[var(--heading)]">
                  {interviewerName}
                </CardTitle>
                <Badge variant="outline" className="px-2 py-0 text-[10px] font-semibold text-[var(--primary)]">
                  {currentPhase}
                </Badge>
              </div>
              <CardDescription className="text-xs text-[var(--muted)]">
                {interviewerRole}
              </CardDescription>
            </div>
          </div>

          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {/* Persona Description or Greeting Message */}
        <p className="text-xs text-[var(--body)] leading-relaxed font-normal">
          {greetingMessage || personaSummary}
        </p>

        {/* Evaluation Metrics Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <Award className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            <span className="font-semibold text-[var(--heading)]">Evaluation Rigor:</span>
            <span>Senior Staff Benchmark</span>
          </div>

          {/* Dynamic Audio Waveform Visualizer */}
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className={`h-3 w-1 rounded-full bg-[var(--primary)] ${activeStatus === 'speaking' ? 'animate-bounce' : 'opacity-40'}`} />
            <span className={`h-5 w-1 rounded-full bg-[var(--primary)] ${activeStatus === 'speaking' ? 'animate-pulse' : 'opacity-40'}`} />
            <span className={`h-4 w-1 rounded-full bg-[var(--primary)] ${activeStatus === 'speaking' ? 'animate-bounce' : 'opacity-40'}`} />
            <span className={`h-2 w-1 rounded-full bg-[var(--primary)] ${activeStatus === 'speaking' ? 'animate-pulse' : 'opacity-40'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const AIInterviewerCard = React.memo(AIInterviewerCardComponent)
export default AIInterviewerCard
