import { useState } from 'react'
import { Send, SkipForward, Flag, Loader2, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { InterviewTurnResponse } from '@/types/interview'

interface InterviewQuestionCardProps {
  turn: InterviewTurnResponse
  currentNumber: number
  totalCount: number
  onSubmitAnswer: (answer: string) => void
  onSkipQuestion: () => void
  onCompleteSession: () => void
  isSubmitting?: boolean
}

export default function InterviewQuestionCard({
  turn,
  currentNumber,
  totalCount,
  onSubmitAnswer,
  onSkipQuestion,
  onCompleteSession,
  isSubmitting,
}: InterviewQuestionCardProps) {
  const [answer, setAnswer] = useState<string>('')

  // Word count and Character count
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0
  const charCount = answer.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    onSubmitAnswer(answer.trim())
    setAnswer('') // Reset answer after submission
  }

  // Format category badge nicely
  const categoryLabel = turn.question_category
    ? turn.question_category.replace('_', ' ')
    : 'General'

  return (
    <Card className="overflow-hidden text-left flex flex-col h-full justify-between shadow-md">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        {/* Header indicator */}
        <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-slate-800/85">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-sans">
              Question {currentNumber} of {totalCount}
            </span>
            <Badge variant="outline" className="text-[9px] uppercase font-semibold py-0 border-slate-200/60 text-slate-500">
              {categoryLabel}
            </Badge>
          </div>
          <div className="h-2 w-28 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentNumber / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center gap-1.5">
            <BookOpen size={12} />
            <span>Active Question Prompt</span>
          </span>
          <p className="text-sm font-semibold font-display text-slate-905 dark:text-white leading-relaxed">
            {turn.question_text}
          </p>
        </div>

        {/* Typing Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 flex-1 flex flex-col">
            <label htmlFor="response-text" className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider">
              Your Professional Answer
            </label>
            <textarea
              id="response-text"
              disabled={isSubmitting}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Structure your answer clearly. For behavioral questions, consider using the STAR methodology: describe the Situation, specify the Task, describe your Actions, and share the final Results..."
              className="flex-1 w-full text-xs font-sans leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:outline-none rounded-md p-4 resize-none min-h-[160px]"
            />
            {/* TextArea character metrics */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 pt-0.5">
              <div className="flex items-center gap-3">
                <span>
                  Words: <strong className="font-semibold text-slate-500 dark:text-slate-400">{wordCount}</strong>
                </span>
                <span>
                  Characters: <strong className="font-semibold text-slate-500 dark:text-slate-400">{charCount}</strong>
                </span>
              </div>
              <span className="italic">Recommended: 150+ words for deep evaluation.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/85">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSkipQuestion}
                disabled={isSubmitting}
                className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 font-semibold text-xs gap-1.5 cursor-pointer"
              >
                <SkipForward size={13} />
                <span>Skip</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCompleteSession}
                disabled={isSubmitting}
                className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 h-9 font-semibold text-xs gap-1.5 cursor-pointer"
              >
                <Flag size={13} />
                <span>Finish</span>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !answer.trim()}
              className="gap-2 h-9 text-xs px-5 font-bold shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Evaluating answer...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit & Next</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
