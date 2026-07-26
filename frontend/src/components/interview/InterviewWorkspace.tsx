import React from 'react'
import AIInterviewerCard from './AIInterviewerCard'
import InterviewQuestionCard, { defaultSampleQuestions } from './InterviewQuestionCard'
import AnswerEditorCard from './AnswerEditorCard'
import InterviewTimerCard from './InterviewTimerCard'
import QuestionProgressCard from './QuestionProgressCard'
import AIThinkingCard from './AIThinkingCard'
import InterviewSummaryPreviewCard from './InterviewSummaryPreviewCard'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, SkipForward, Square, Play } from 'lucide-react'

export interface InterviewWorkspaceProps {
  sessionState?: 'idle' | 'greeting' | 'active_question' | 'ai_thinking' | 'completed'
  currentPhase?: 'Introduction' | 'Warm-up' | 'Technical Questions' | 'Behavioral Questions' | 'Wrap-up'
  currentQuestionIndex?: number
  interviewerStatus?: 'speaking' | 'thinking' | 'listening' | 'ready'
  greetingMessage?: string
  onQuestionChange?: (index: number) => void
  onSubmitAnswer?: (answer: string) => void
  onRestartSession?: () => void
}

export const InterviewWorkspace: React.FC<InterviewWorkspaceProps> = ({
  sessionState = 'active_question',
  currentPhase = 'Technical Questions',
  currentQuestionIndex = 0,
  interviewerStatus = 'ready',
  greetingMessage,
  onQuestionChange,
  onSubmitAnswer,
  onRestartSession,
}) => {
  const isCompleted = sessionState === 'completed'
  const isThinking = sessionState === 'ai_thinking'

  if (isCompleted) {
    return (
      <section className="flex flex-col gap-6" aria-label="Completed Interview Summary Workspace">
        <InterviewSummaryPreviewCard onRestartSession={onRestartSession} />
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6" aria-label="Interview Workspace">
      {/* AI Interviewer Persona Card */}
      <AIInterviewerCard
        currentPhase={currentPhase}
        interviewerStatus={interviewerStatus}
        greetingMessage={greetingMessage}
      />

      {/* Main Workspace Dynamic Area (Question & Answer Editor OR AI Thinking Indicator) */}
      {isThinking ? (
        <AIThinkingCard message="Alex is evaluating your response context and synthesizing the next technical inquiry..." />
      ) : (
        <>
          {/* Current Question Card */}
          <InterviewQuestionCard
            questionIndex={currentQuestionIndex}
            onQuestionChange={onQuestionChange}
          />

          {/* Answer Editor Card */}
          <AnswerEditorCard onSubmitAnswer={onSubmitAnswer} />
        </>
      )}

      {/* Timer & Question Progress Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InterviewTimerCard />
        <QuestionProgressCard />
      </div>

      {/* Session Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onQuestionChange && onQuestionChange(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0 || isThinking}
            className="h-10 min-h-[44px] gap-1.5 px-4 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous Question"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => onQuestionChange && onQuestionChange(Math.min(defaultSampleQuestions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex >= defaultSampleQuestions.length - 1 || isThinking}
            className="h-10 min-h-[44px] gap-1.5 px-4 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Skip Question"
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            <span>Skip</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => onQuestionChange && onQuestionChange(Math.min(defaultSampleQuestions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex >= defaultSampleQuestions.length - 1 || isThinking}
            className="h-10 min-h-[44px] gap-1.5 px-5 text-xs font-semibold cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next Question"
          >
            <span>Next Question</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default InterviewWorkspace
