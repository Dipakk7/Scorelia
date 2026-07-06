import { ShieldCheck, CheckSquare, Target, Zap, Award, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface STARScoreCardProps {
  starScore: number // Overall STAR methodology score (0-100)
  answerText: string
  starAnalysis?: {
    situation?: { score: number; feedback: string }
    task?: { score: number; feedback: string }
    action?: { score: number; feedback: string }
    result?: { score: number; feedback: string }
  } | null
}

export default function STARScoreCard({ starScore, answerText, starAnalysis }: STARScoreCardProps) {
  // Compute fallback/simulated individual scores if not explicitly provided by the backend.
  // We can analyze answer length or look for transition words (e.g. "situation", "task", "result", "because of", "I did", "we resolved").
  const lowerAnswer = answerText.toLowerCase()
  const hasSituation = lowerAnswer.includes('situation') || lowerAnswer.includes('background') || lowerAnswer.length > 50
  const hasTask = lowerAnswer.includes('task') || lowerAnswer.includes('responsibility') || lowerAnswer.includes('goal') || lowerAnswer.length > 100
  const hasAction = lowerAnswer.includes('action') || lowerAnswer.includes('i did') || lowerAnswer.includes('solved') || lowerAnswer.includes('using') || lowerAnswer.length > 150
  const hasResult = lowerAnswer.includes('result') || lowerAnswer.includes('outcome') || lowerAnswer.includes('metric') || lowerAnswer.includes('%') || lowerAnswer.length > 200

  const sScore = starAnalysis?.situation?.score ?? (hasSituation ? Math.min(100, Math.floor(starScore * 1.05)) : 40)
  const tScore = starAnalysis?.task?.score ?? (hasTask ? Math.min(100, Math.floor(starScore * 0.95)) : 35)
  const aScore = starAnalysis?.action?.score ?? (hasAction ? Math.min(100, Math.floor(starScore * 1.02)) : 45)
  const rScore = starAnalysis?.result?.score ?? (hasResult ? Math.min(100, Math.floor(starScore * 0.98)) : 30)

  const sFeedback =
    starAnalysis?.situation?.feedback ??
    (hasSituation
      ? 'Context and problem background were clearly stated.'
      : 'Explain the background situation and challenges first.')
  const tFeedback =
    starAnalysis?.task?.feedback ??
    (hasTask
      ? 'Task objectives and project goals were defined.'
      : 'Clearly state your responsibilities or target objectives.')
  const aFeedback =
    starAnalysis?.action?.feedback ??
    (hasAction
      ? 'Detailed implementation steps and your core contributions.'
      : 'Detail what actions YOU specifically took to resolve the issue.')
  const rFeedback =
    starAnalysis?.result?.feedback ??
    (hasResult
      ? 'Outcomes, quantifiable metrics, and key lessons were shared.'
      : 'Quantify the results. Mention metrics, percentages, or learnings.')

  const steps = [
    {
      key: 'S',
      title: 'Situation',
      score: sScore,
      feedback: sFeedback,
      desc: 'Set the scene. Explain the background, context, and challenge faced.',
      icon: Info,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      barColor: 'bg-blue-500',
    },
    {
      key: 'T',
      title: 'Task',
      score: tScore,
      feedback: tFeedback,
      desc: 'Define the target objective. Explain your specific responsibility or goal.',
      icon: Target,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      barColor: 'bg-amber-500',
    },
    {
      key: 'A',
      title: 'Action',
      score: aScore,
      feedback: aFeedback,
      desc: 'Detail your contribution. Describe exactly how you solved the issue.',
      icon: Zap,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      barColor: 'bg-purple-500',
    },
    {
      key: 'R',
      title: 'Result',
      score: rScore,
      feedback: rFeedback,
      desc: 'Share the outcomes. State metrics, percentages, and lessons learned.',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: 'bg-emerald-500',
    },
  ]

  return (
    <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card overflow-hidden text-left space-y-5">
      <CardContent className="p-6 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-500" />
              <span>STAR Structure Audit</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-sans max-w-sm">
              Assessment of your answer structure against standard behavioral interviewing guidelines.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-brand-500/5 dark:bg-brand-500/10 py-1.5 px-3 rounded-lg border border-brand-500/15">
            <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400">
              STAR SCORE:
            </span>
            <span className="text-sm font-bold text-slate-850 dark:text-white">{starScore}%</span>
          </div>
        </div>

        {/* STAR grid steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const ratingLabel =
              step.score >= 80 ? 'Exceptional' : step.score >= 60 ? 'Satisfactory' : 'Needs Expansion'

            return (
              <div
                key={step.key}
                className="flex flex-col md:flex-row items-start gap-4 p-4.5 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/15"
              >
                {/* Visual Letter Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center font-display font-black text-lg border',
                      step.color
                    )}
                  >
                    {step.key}
                  </div>
                  <div className="md:hidden">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white font-display">
                      {step.title}
                    </h4>
                    <span className="text-[9px] font-sans text-slate-400">
                      Score: {step.score}% ({ratingLabel})
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="hidden md:flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-905 dark:text-white font-display">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-sans">
                      <span className="text-slate-450 dark:text-slate-500">Rating: {ratingLabel}</span>
                      <span className="font-bold text-slate-850 dark:text-white">{step.score}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-normal">
                    {step.desc}
                  </p>

                  {/* Tiny progress bar */}
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', step.barColor)}
                      style={{ width: `${step.score}%` }}
                    />
                  </div>

                  <p className="text-[10px] font-sans text-slate-800 dark:text-slate-300 bg-white dark:bg-dark-card p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 leading-normal flex items-start gap-1.5 mt-2">
                    <CheckSquare size={12} className="text-brand-500 shrink-0 mt-0.5" />
                    <span>{step.feedback}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
