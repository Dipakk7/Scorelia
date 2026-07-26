import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, Clock, Sparkles, Lock } from 'lucide-react'
import type { AdaptedTurn } from '@/lib/interview-adapter'

export const sampleTranscriptsFallback: AdaptedTurn[] = [
  {
    id: 'turn-1',
    sessionId: 'sess-1',
    questionNumber: 1,
    questionCategory: 'Behavioral & Overview',
    questionText: 'Tell me about yourself and your experience architecting high-scale web applications.',
    answerText: 'In my recent engineering lead position at ACME Corp, I oversaw the frontend and microservices redesign for our core platform serving 1.2M monthly active users. My main focus was maintaining 99.95% availability while optimizing client-side render times using React and TypeScript...',
    feedback: 'Clear structure following STAR method.',
    score: 85,
    createdAt: 'Today at 13:10 PM',
  },
  {
    id: 'turn-2',
    sessionId: 'sess-1',
    questionNumber: 2,
    questionCategory: 'Technical Deep-Dive',
    questionText: 'Describe a challenging technical project where you faced performance bottlenecks, and how you resolved them.',
    answerText: 'During our Q3 infrastructure expansion, we noticed database connection pool exhaustion under peak load spikes. I led the diagnostic effort using distributed tracing, introduced a Redis caching layer for read-heavy routes, and restructured our SQL queries, reducing API response p99 latency by 42%...',
    feedback: 'Strong technical metrics provided.',
    score: 88,
    createdAt: 'Today at 13:14 PM',
  },
]

export interface AnswerReviewCardProps {
  turns?: AdaptedTurn[]
}

export const AnswerReviewCard: React.FC<AnswerReviewCardProps> = ({
  turns = [],
}) => {
  const displayTurns = (turns ?? []).length > 0 ? turns : sampleTranscriptsFallback

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Recorded Candidate Answers
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Transcript review & response records.
              </CardDescription>
            </div>
          </div>
          <Badge variant="neutral" className="px-2.5 py-0.5 text-xs font-semibold">
            {displayTurns.length} Responses Recorded
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {displayTurns.map((item) => {
          const wordCount = (item.answerText ?? '').trim() ? (item.answerText ?? '').trim().split(/\s+/).length : 0

          return (
            <div key={item.id} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[var(--border)] pb-2.5">
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="px-2 py-0.5 text-[10px] font-semibold">
                    Question {item.questionNumber} • {item.questionCategory || 'Technical'}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[var(--muted)]">
                  {item.createdAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[var(--primary)]" aria-hidden="true" />
                      {item.createdAt}
                    </span>
                  )}
                  <span>•</span>
                  <span><strong>{wordCount}</strong> words</span>
                </div>
              </div>

              {/* Question Title */}
              <h4 className="text-xs font-semibold text-[var(--heading)]">
                "{item.questionText}"
              </h4>

              {/* Answer Excerpt */}
              <p className="text-xs text-[var(--body)] leading-relaxed italic bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]/70">
                "{item.answerText || 'No answer text recorded.'}"
              </p>

              {/* Feedback or Pending Banner */}
              <div className="flex items-center justify-between text-[11px] text-[var(--muted)] pt-1">
                {item.feedback ? (
                  <span className="flex items-center gap-1.5 text-[var(--success)] font-medium">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>AI Feedback: {item.feedback}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>AI Evaluation Pending</span>
                  </span>
                )}

                <span className="flex items-center gap-1 text-[10px]">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  <span>Defensive API Binding</span>
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnswerReviewCard
