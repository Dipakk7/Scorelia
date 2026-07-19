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
    <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left flex flex-col h-full justify-between font-sans text-xs">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        {/* Header indicator */}
        <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-405 font-sans leading-none">
              Question {currentNumber} of {totalCount}
            </span>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 border-slate-200/60 text-slate-500">
              {categoryLabel}
            </Badge>
          </div>
          <div className="h-1.5 w-28 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentNumber / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 leading-none">
            <BookOpen size={12} className="text-slate-400" />
            <span>Active Question Prompt</span>
          </span>
          <p className="text-sm font-extrabold font-display text-foreground leading-relaxed m-0">
            {turn.question_text}
          </p>
        </div>

        {/* Typing Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between m-0">
          <div className="space-y-2 flex-1 flex flex-col">
            <label htmlFor="response-text" className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none">
              Your Professional Answer
            </label>
            <textarea
              id="response-text"
              disabled={isSubmitting}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Structure your answer clearly. For behavioral questions, consider using the STAR methodology: describe the Situation, specify the Task, describe your Actions, and share the final Results..."
              className="flex-1 w-full text-xs font-sans leading-relaxed text-foreground bg-slate-55/30 dark:bg-slate-950/20 border border-slate-250 dark:border-slate-850 focus:border-brand-500 focus:outline-none rounded-xl p-4 resize-none min-h-[160px] focus:ring-1 focus:ring-brand-500 transition-colors font-medium"
            />
            {/* TextArea character metrics */}
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 pt-0.5">
              <div className="flex items-center gap-3">
                <span>
                  Words: <strong className="font-extrabold text-muted-foreground">{wordCount}</strong>
                </span>
                <span>
                  Characters: <strong className="font-extrabold text-muted-foreground">{charCount}</strong>
                </span>
              </div>
              <span className="italic text-[9px] tracking-normal normal-case font-medium text-slate-405">Recommended: 150+ words for deep evaluation.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSkipQuestion}
                disabled={isSubmitting}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-850/30 h-9 font-bold text-[10px] uppercase tracking-wider gap-1.5 cursor-pointer rounded-lg transition-all bg-transparent border-none flex items-center"
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
                className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 h-9 font-bold text-[10px] uppercase tracking-wider gap-1.5 cursor-pointer rounded-lg transition-all bg-transparent border-none flex items-center"
              >
                <Flag size={13} />
                <span>Finish</span>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !answer.trim()}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs h-9"
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
