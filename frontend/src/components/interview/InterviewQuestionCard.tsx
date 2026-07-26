import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { HelpCircle, Bookmark, Volume2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'

export interface SampleQuestion {
  id: string
  number: number
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionText: string
  contextSnippet: string
}

export const defaultSampleQuestions: SampleQuestion[] = [
  {
    id: 'q1',
    number: 1,
    category: 'Behavioral & Role Overview',
    difficulty: 'Easy',
    questionText: 'Tell me about yourself and your experience architecting high-scale web applications.',
    contextSnippet: 'Focus on recent leadership achievements, primary tech stack (React, Node, Cloud), and concrete metrics.',
  },
  {
    id: 'q2',
    number: 2,
    category: 'Technical Deep-Dive',
    difficulty: 'Hard',
    questionText: 'Describe a challenging technical project where you faced performance bottlenecks, and how you resolved them.',
    contextSnippet: 'Focus on root-cause analysis, specific telemetry metrics (e.g. p99 latency), architectural trade-offs, and STAR methodology.',
  },
  {
    id: 'q3',
    number: 3,
    category: 'Cultural Alignment & Leadership',
    difficulty: 'Medium',
    questionText: 'How do you handle technical disagreements within an engineering team when choosing system architecture?',
    contextSnippet: 'Highlight data-driven decision making, benchmarking, prototyping, and fostering technical consensus.',
  },
  {
    id: 'q4',
    number: 4,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    questionText: 'How would you design a real-time collaborative document editing system supporting thousands of concurrent users?',
    contextSnippet: 'Discuss Operational Transformation (OT) / CRDTs, WebSocket connection scaling, message queues, and caching layers.',
  },
  {
    id: 'q5',
    number: 5,
    category: 'Behavioral & Conflict Management',
    difficulty: 'Medium',
    questionText: 'Describe a time when a critical production system failed unexpectedly. How did you manage post-mortem resolution?',
    contextSnippet: 'Detail incident triage, blameless post-mortem culture, preventive automated testing, and SLA recovery.',
  },
]

export interface InterviewQuestionCardProps {
  questionNumber?: number
  questionIndex?: number
  totalQuestions?: number
  category?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  questionText?: string
  contextSnippet?: string
  onQuestionChange?: (index: number) => void
}

export const InterviewQuestionCardComponent: React.FC<InterviewQuestionCardProps> = ({
  questionNumber,
  questionIndex = 0,
  totalQuestions = 5,
  category,
  difficulty,
  questionText,
  contextSnippet,
  onQuestionChange,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const activeQuestion = defaultSampleQuestions[questionIndex] || defaultSampleQuestions[0]

  const num = questionNumber ?? activeQuestion.number
  const cat = category ?? activeQuestion.category
  const diff = difficulty ?? activeQuestion.difficulty
  const text = questionText ?? activeQuestion.questionText
  const hint = contextSnippet ?? activeQuestion.contextSnippet

  const getDifficultyBadge = () => {
    switch (diff) {
      case 'Easy':
        return <Badge variant="success" className="px-2.5 py-0.5 text-xs font-semibold">Easy</Badge>
      case 'Hard':
        return <Badge variant="error" className="px-2.5 py-0.5 text-xs font-semibold">Hard</Badge>
      case 'Medium':
      default:
        return <Badge variant="warning" className="px-2.5 py-0.5 text-xs font-semibold">Medium</Badge>
    }
  }

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev)
  }

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-[var(--heading)]">
                  Question {num} of {totalQuestions}
                </CardTitle>
                <Badge variant="info" className="px-2.5 py-0.5 text-xs font-semibold">
                  {cat}
                </Badge>
              </div>
              <CardDescription className="text-xs text-[var(--muted)]">
                Active Question Turn
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getDifficultyBadge()}

            {/* Audio Prompt Button */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)]'
              }`}
              title={isPlayingAudio ? 'Pause Audio Prompt' : 'Listen to Question Audio Prompt'}
              aria-label="Listen to Question Audio"
            >
              <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} aria-hidden="true" />
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={`flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)]'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
              aria-label="Bookmark Question"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {/* Animated Question Prompt Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={num}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-base font-bold text-[var(--heading)] leading-snug md:text-lg">
              "{text}"
            </h3>

            {hint && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3.5 text-xs text-[var(--body)] leading-relaxed">
                <Sparkles className="mt-0.5 h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
                <div>
                  <strong className="font-semibold text-[var(--heading)] block mb-0.5">Evaluation Hint:</strong>
                  <span>{hint}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export const InterviewQuestionCard = React.memo(InterviewQuestionCardComponent)
export default InterviewQuestionCard
