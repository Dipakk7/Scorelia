import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Grid, Lock, Check, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'

export const QuestionNavigatorCard: React.FC = () => {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const questions = [
    { num: 1, status: 'current', title: 'Tell me about yourself' },
    { num: 2, status: 'locked', title: 'Technical bottleneck project' },
    { num: 3, status: 'locked', title: 'Company cultural alignment' },
    { num: 4, status: 'locked', title: 'System design architecture' },
    { num: 5, status: 'locked', title: 'Behavioral challenge' },
  ]

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Grid className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[var(--heading)]">
                Question Navigator
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Quick jump navigation.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q) => (
            <motion.button
              key={q.num}
              type="button"
              disabled={q.status === 'locked'}
              whileHover={!shouldReduceMotion && q.status !== 'locked' ? { scale: 1.05 } : undefined}
              whileTap={!shouldReduceMotion && q.status !== 'locked' ? { scale: 0.95 } : undefined}
              className={`flex flex-col items-center justify-center rounded-xl p-2 border text-xs font-bold transition-colors cursor-pointer ${
                q.status === 'current'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm ring-2 ring-[var(--primary)]/20'
                  : q.status === 'completed'
                  ? 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]'
                  : 'border-[var(--border)] bg-[var(--surface-hover)]/30 text-[var(--muted)] opacity-50 cursor-not-allowed'
              }`}
              title={`Question ${q.num}: ${q.title}`}
            >
              <span>Q{q.num}</span>
              {q.status === 'current' && <Play className="mt-0.5 h-3 w-3 fill-current text-[var(--primary)]" aria-hidden="true" />}
              {q.status === 'completed' && <Check className="mt-0.5 h-3 w-3 text-[var(--success)]" aria-hidden="true" />}
              {q.status === 'locked' && <Lock className="mt-0.5 h-3 w-3 text-[var(--muted)]" aria-hidden="true" />}
            </motion.button>
          ))}
        </div>

        <p className="text-[11px] text-[var(--muted)] text-center">
          Questions unlock sequentially during an active interview.
        </p>
      </CardContent>
    </Card>
  )
}

export default QuestionNavigatorCard
