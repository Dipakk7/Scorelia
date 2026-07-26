import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ListOrdered, CheckCircle2, Clock } from 'lucide-react'

export interface QuestionProgressCardProps {
  totalQuestions?: number
  currentQuestion?: number
  completedQuestions?: number
}

export const QuestionProgressCard: React.FC<QuestionProgressCardProps> = ({
  totalQuestions = 5,
  currentQuestion = 1,
  completedQuestions = 0,
}) => {
  const remainingQuestions = Math.max(0, totalQuestions - completedQuestions)
  const progressPercent = Math.round((completedQuestions / totalQuestions) * 100)

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <ListOrdered className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Question Progress
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Turn & overall completion progress.
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-bold text-[var(--primary)]">
            {progressPercent}% Complete
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 p-5">
        {/* Accessible Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[var(--muted)]">
            <span>Question {currentQuestion} of {totalQuestions}</span>
            <span>{completedQuestions} Completed</span>
          </div>
          <div
            role="progressbar"
            aria-label="Interview Question Progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-hover)] border border-[var(--border)]/50"
          >
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 5)}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5 text-[var(--muted)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
            <span>Remaining: <strong className="text-[var(--heading)]">{remainingQuestions} Questions</strong></span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/20 p-2.5 text-[var(--muted)]">
            <Clock className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
            <span>Est. Time Left: <strong className="text-[var(--heading)]">~20 Min</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionProgressCard
