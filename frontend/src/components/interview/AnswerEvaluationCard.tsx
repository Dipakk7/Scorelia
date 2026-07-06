import { CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown, Sparkles, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { AnswerEvaluationResponse } from '@/types/interview'

interface AnswerEvaluationCardProps {
  evaluation: AnswerEvaluationResponse
  questionText: string
  answerText: string
}

export default function AnswerEvaluationCard({ evaluation, questionText, answerText }: AnswerEvaluationCardProps) {
  const categories = [
    { label: 'Technical Depth', value: evaluation.technical_score, color: 'bg-amber-500' },
    { label: 'Communication Skill', value: evaluation.communication_score, color: 'bg-blue-500' },
    { label: 'Grammar & Tone', value: evaluation.grammar_score, color: 'bg-emerald-500' },
    { label: 'Professionalism', value: evaluation.professionalism_score, color: 'bg-purple-500' },
    { label: 'Linguistic Confidence', value: evaluation.confidence_score, color: 'bg-rose-500' },
  ]

  return (
    <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card overflow-hidden text-left space-y-6">
      <CardContent className="p-6 space-y-6">
        {/* Header Title with Score */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles size={16} className="text-brand-500 animate-pulse-slow" />
              <span>Real-Time Answer Evaluation</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-sans max-w-md">
              Feedback computed by the AI interview engine based on keyword matching and context assessment.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-brand-500/5 dark:bg-brand-500/10 p-2.5 rounded-xl border border-brand-500/15">
            <div className="h-10 w-10 bg-brand-600 rounded-lg flex flex-col items-center justify-center text-white shrink-0">
              <span className="text-sm font-bold">{evaluation.overall_score}</span>
              <span className="text-[6px] font-bold uppercase">Score</span>
            </div>
            <div className="text-[9px] font-sans">
              <span className="font-bold text-slate-900 dark:text-white block">Overall Grade</span>
              <span className="text-slate-550 dark:text-slate-400">
                {evaluation.overall_score >= 85
                  ? 'Excellent Performance'
                  : evaluation.overall_score >= 70
                  ? 'Good Progress'
                  : 'Needs Practice'}
              </span>
            </div>
          </div>
        </div>

        {/* Question & Answer Summary */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800 rounded-xl space-y-2.5">
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-350 block">Question asked:</strong>
            <p className="italic mt-0.5 leading-normal">{questionText}</p>
          </div>
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/30">
            <strong className="text-slate-700 dark:text-slate-350 block">Your response:</strong>
            <p className="mt-0.5 leading-normal line-clamp-3">{answerText}</p>
          </div>
        </div>

        {/* Scores Breakdown & Progress Bars */}
        <div className="space-y-3.5">
          <span className="block font-bold text-slate-700 dark:text-slate-355 text-[10px] uppercase tracking-wider">
            Evaluation metrics
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-sans">
                  <span className="font-medium text-slate-550 dark:text-slate-400">{cat.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cat.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', cat.color)}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary Text */}
        {evaluation.summary && (
          <div className="space-y-1.5">
            <span className="block font-bold text-slate-700 dark:text-slate-355 text-[10px] uppercase tracking-wider">
              Qualitative summary
            </span>
            <p className="text-xs font-sans text-slate-650 dark:text-slate-400 leading-relaxed bg-brand-500/5 p-4 rounded-xl border border-brand-555/5">
              {evaluation.summary}
            </p>
          </div>
        )}

        {/* Strengths & Weaknesses Split Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Strengths */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5">
              <ThumbsUp size={12} />
              <span>Response Strengths</span>
            </span>
            <ul className="space-y-2">
              {evaluation.strengths.length > 0 ? (
                evaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-sans leading-normal">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 italic">No key strengths highlighted.</li>
              )}
            </ul>
          </div>

          {/* Weaknesses / Improvements */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <ThumbsDown size={12} />
              <span>Areas for Improvement</span>
            </span>
            <ul className="space-y-2">
              {evaluation.weaknesses.length > 0 ? (
                evaluation.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-sans leading-normal">
                    <AlertCircle size={13} className="text-rose-500 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 italic">No major flaws identified in delivery.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Missing Topics & Suggestions */}
        {(evaluation.missing_topics.length > 0 || evaluation.improvements.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-slate-800/85">
            {/* Missing Topics */}
            {evaluation.missing_topics.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Missing Topics / Keywords
                </span>
                <div className="flex flex-wrap gap-1">
                  {evaluation.missing_topics.map((topic, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-amber-500/5 text-amber-600 border-amber-550/10 text-[9px] py-0.5 px-2"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Specific suggestions */}
            {evaluation.improvements.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Specific Coaching Advices
                </span>
                <ul className="space-y-1.5">
                  {evaluation.improvements.map((imp, i) => (
                    <li key={i} className="text-[10px] text-slate-550 dark:text-slate-455 font-sans leading-normal list-disc pl-3">
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Follow-up Questions */}
        {evaluation.followup_questions && evaluation.followup_questions.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/85">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MessageSquare size={12} className="text-brand-500" />
              <span>Recommended Follow-up Drills</span>
            </span>
            <div className="space-y-2">
              {evaluation.followup_questions.map((fq, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 rounded-lg text-[10px] text-slate-700 dark:text-slate-350 leading-relaxed font-sans"
                >
                  {fq}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
