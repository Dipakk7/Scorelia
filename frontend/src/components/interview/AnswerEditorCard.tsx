import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Edit3, 
  MicOff, 
  Send, 
  Bold, 
  Italic, 
  List, 
  Code, 
  Quote, 
  Trash2, 
  Clock, 
  Info,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import toast from 'react-hot-toast'

export interface AnswerEditorCardProps {
  onSubmitAnswer?: (answer: string) => void
  isSubmitting?: boolean
}

export const AnswerEditorCard: React.FC<AnswerEditorCardProps> = ({
  onSubmitAnswer,
  isSubmitting = false,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [answerText, setAnswerText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const typingTimerRef = React.useRef<number | null>(null)

  const wordCount = useMemo(() => {
    const trimmed = answerText.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }, [answerText])

  const charCount = answerText.length
  const targetWords = 200
  const completionProgress = Math.min(100, Math.round((wordCount / targetWords) * 100))

  const estSpeakingTime = useMemo(() => {
    if (wordCount === 0) return '0 sec'
    const totalSeconds = Math.round((wordCount / 130) * 60)
    if (totalSeconds < 60) {
      return `~${totalSeconds} sec`
    }
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `~${mins}m ${secs}s`
  }, [wordCount])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value)
    setIsTyping(true)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const handleClearText = () => {
    setAnswerText('')
    setIsTyping(false)
    toast.success('Response draft cleared')
  }

  const handleSubmit = () => {
    if (!answerText.trim()) {
      toast.error('Please enter a response before submitting')
      return
    }
    toast.success('Response submitted for AI analysis!')
    if (onSubmitAnswer) {
      onSubmitAnswer(answerText)
    }
  }

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Edit3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Answer Editor
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Draft your structured answer using STAR method or technical key points.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isTyping ? 'info' : wordCount > 0 ? 'success' : 'neutral'}
              className="px-2.5 py-0.5 text-xs font-semibold transition-colors"
            >
              {isTyping ? 'Typing Response...' : wordCount > 0 ? 'Draft Ready' : 'Draft Empty'}
            </Badge>

            <div className="flex items-center gap-1.5 rounded-full bg-[var(--surface-hover)] px-2.5 py-1 border border-[var(--border)] text-xs text-[var(--muted)]">
              <MicOff className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden="true" />
              <span>Voice Standby</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {/* Formatting Toolbar with 44px Touch Targets */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAnswerText((prev) => prev + ' **bold snippet**')}
              className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
              title="Add Bold snippet"
              aria-label="Format Bold"
            >
              <Bold className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setAnswerText((prev) => prev + ' *italic snippet*')}
              className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
              title="Add Italic snippet"
              aria-label="Format Italic"
            >
              <Italic className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setAnswerText((prev) => prev + '\n- Item 1\n- Item 2')}
              className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
              title="Add Bullet List"
              aria-label="Format Bullet List"
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setAnswerText((prev) => prev + ' `const architecture = "microservices";`')}
              className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
              title="Add Code snippet"
              aria-label="Format Code"
            >
              <Code className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setAnswerText((prev) => prev + '\n> Situation: ...\n> Action: ...')}
              className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
              title="Add STAR Block"
              aria-label="Format STAR Method"
            >
              <Quote className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {answerText && (
              <button
                type="button"
                onClick={handleClearText}
                className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 focus:outline-none cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={answerText}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={6}
            placeholder="Type your structured answer here... (e.g. In my recent engineering initiative at ACME Corp, I evaluated our distributed database bottlenecks...)"
            className={`w-full resize-none rounded-xl border p-4 text-xs leading-relaxed text-[var(--body)] placeholder:text-[var(--muted)]/60 transition-all duration-200 ${
              isFocused
                ? 'border-[var(--primary)] bg-[var(--surface)] ring-2 ring-[var(--primary)]/20 shadow-sm'
                : 'border-[var(--border)] bg-[var(--surface)]'
            }`}
          />
        </div>

        {/* Suggested Length & Completion Progress Bar */}
        <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 p-3 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--muted)]">
              Suggested Response Length: <strong className="text-[var(--heading)]">150–250 words</strong>
            </span>
            <span className="font-semibold text-[var(--primary)]">
              {completionProgress}% of Target
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Suggested Answer Length Progress"
            aria-valuenow={completionProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]"
          >
            <motion.div
              className="h-full bg-[var(--primary)]"
              initial={{ width: '0%' }}
              animate={{ width: `${completionProgress}%` }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--muted)] pt-1">
            <div className="flex items-center gap-3">
              <span>
                <strong className="text-[var(--heading)]">{wordCount}</strong> words
              </span>
              <span>•</span>
              <span>
                <strong className="text-[var(--heading)]">{charCount}</strong> characters
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[var(--primary)]" aria-hidden="true" />
              <span>Est. Speaking Time: <strong className="text-[var(--heading)]">{estSpeakingTime}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Submit CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Info className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
            <span>Submitting will advance the simulated interview turn to AI evaluation.</span>
          </div>

          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!answerText.trim() || isSubmitting}
            className="h-10 min-h-[44px] gap-2 px-6 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Submit Answer & Next</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AnswerEditorCard
