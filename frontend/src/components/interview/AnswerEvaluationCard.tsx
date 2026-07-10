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

  const overallGradeText =
    evaluation.overall_score >= 85
      ? 'Excellent Performance'
      : evaluation.overall_score >= 70
      ? 'Good Progress'
      : 'Needs Practice'

  const overallGradeClass =
    evaluation.overall_score >= 85
      ? 'text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider text-[10px] block mt-0.5'
      : evaluation.overall_score >= 70
      ? 'text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider text-[10px] block mt-0.5'
      : 'text-rose-650 dark:text-rose-500 font-bold uppercase tracking-wider text-[10px] block mt-0.5'

  return (
    <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left space-y-6 font-sans text-xs">
      <CardContent className="p-6 space-y-6">
        {/* Header Title with Score */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-foreground flex items-center gap-1.5 m-0 leading-none">
              <Sparkles size={16} className="text-brand-500 animate-pulse" />
              <span>Real-Time Answer Evaluation</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans max-w-md m-0 font-medium">
              Feedback computed by the AI interview engine based on keyword matching and context assessment.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-brand-500/5 dark:bg-brand-500/10 p-2.5 rounded-xl border border-brand-500/20 font-sans">
            <div className="h-10 w-10 bg-brand-500 rounded-lg flex flex-col items-center justify-center text-white shrink-0 font-black shadow-2xs font-mono">
              <span className="text-sm font-black leading-none">{evaluation.overall_score}</span>
              <span className="text-[6px] font-black uppercase tracking-wider mt-0.5 leading-none">Score</span>
            </div>
            <div className="text-[9px] font-sans">
              <span className="font-bold text-foreground block uppercase tracking-wider">Overall Grade</span>
              <span className={overallGradeClass}>{overallGradeText}</span>
            </div>
          </div>
        </div>

        {/* Question & Answer Summary */}
        <div className="p-4 bg-slate-50/30 dark:bg-slate-950/10 border border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-2.5 text-left">
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-405">
            <strong className="text-slate-700 dark:text-slate-350 block uppercase tracking-wider text-[9px] font-black">Question asked:</strong>
            <p className="italic mt-1 leading-relaxed m-0 font-medium">{questionText}</p>
          </div>
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-405 pt-2.5 border-t border-slate-200/40 dark:border-slate-850">
            <strong className="text-slate-700 dark:text-slate-350 block uppercase tracking-wider text-[9px] font-black">Your response:</strong>
            <p className="mt-1 leading-relaxed line-clamp-3 m-0 font-medium">{answerText}</p>
          </div>
        </div>

        {/* Scores Breakdown & Progress Bars */}
        <div className="space-y-3.5">
          <span className="block font-black text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider">
            Evaluation metrics
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-sans">
                  <span className="font-extrabold text-muted-foreground uppercase tracking-widest text-[9px]">{cat.label}</span>
                  <span className="font-mono font-black text-foreground">{cat.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
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
          <div className="space-y-2">
            <span className="block font-black text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider">
              Qualitative summary
            </span>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed bg-brand-500/5 p-4 rounded-xl border border-brand-500/10 font-medium m-0">
              {evaluation.summary}
            </p>
          </div>
        )}

        {/* Strengths & Weaknesses Split Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Strengths */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5">
              <ThumbsUp size={12} className="text-emerald-500" />
              <span>Response Strengths</span>
            </span>
            <ul className="space-y-2 m-0 p-0 list-none">
              {evaluation.strengths.length > 0 ? (
                evaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground font-sans leading-normal font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 italic font-medium">No key strengths highlighted.</li>
              )}
            </ul>
          </div>

          {/* Weaknesses / Improvements */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-rose-650 dark:text-rose-500 flex items-center gap-1.5">
              <ThumbsDown size={12} className="text-rose-500" />
              <span>Areas for Improvement</span>
            </span>
            <ul className="space-y-2 m-0 p-0 list-none">
              {evaluation.weaknesses.length > 0 ? (
                evaluation.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground font-sans leading-normal font-medium">
                    <AlertCircle size={13} className="text-rose-500 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 italic font-medium">No major flaws identified in delivery.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Missing Topics & Suggestions */}
        {(evaluation.missing_topics.length > 0 || evaluation.improvements.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-slate-850/80">
            {/* Missing Topics */}
            {evaluation.missing_topics.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Missing Topics / Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.missing_topics.map((topic, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-amber-500/5 text-amber-600 border-amber-500/15 text-[9px] font-bold py-0 px-2 rounded-lg"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Specific suggestions */}
            {evaluation.improvements.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Specific Coaching Advices
                </span>
                <ul className="space-y-1.5 m-0 pl-4 list-disc text-slate-655 dark:text-slate-400 leading-relaxed font-sans font-medium">
                  {evaluation.improvements.map((imp, i) => (
                    <li key={i}>
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
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-855">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <MessageSquare size={12} className="text-brand-500" />
              <span>Recommended Follow-up Drills</span>
            </span>
            <div className="space-y-2">
              {evaluation.followup_questions.map((fq, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-855 rounded-xl text-[10px] text-slate-700 dark:text-slate-350 leading-relaxed font-sans font-medium"
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
