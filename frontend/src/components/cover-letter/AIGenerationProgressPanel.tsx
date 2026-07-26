import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, Loader2, X, Clock } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { mockGenerationStages } from '@/lib/cover-letter-mock-data'

export interface AIGenerationProgressPanelProps {
  onComplete?: () => void
  onCancel?: () => void
}

export const AIGenerationProgressPanel: React.FC<AIGenerationProgressPanelProps> = ({
  onComplete,
  onCancel,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [progressPercent, setProgressPercent] = useState(10)
  const [secondsRemaining, setSecondsRemaining] = useState(5)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const totalStages = mockGenerationStages.length

    // Stage progression timer
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < totalStages - 1) {
          const nextIndex = prev + 1
          const pct = Math.round(((nextIndex + 1) / totalStages) * 100)
          setProgressPercent(pct)
          setSecondsRemaining(Math.max(0, 5 - Math.round((pct / 100) * 5)))
          return nextIndex
        } else {
          clearInterval(interval)
          setProgressPercent(100)
          setSecondsRemaining(0)
          setIsDone(true)
          setTimeout(() => {
            onComplete?.()
          }, 800)
          return prev
        }
      })
    }, 600)

    return () => clearInterval(interval)
  }, [onComplete])

  const activeStage = mockGenerationStages[currentStageIndex]

  return (
    <motion.div
      role="region"
      aria-label="AI Generation Timeline Status"
      aria-live="polite"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--surface)] p-6 shadow-xl space-y-6 text-left relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isDone ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
          >
            {isDone ? <CheckCircle2 size={22} /> : <Sparkles size={22} className="animate-pulse" />}
          </motion.div>

          <div>
            <h3 className="font-display font-black text-base text-[var(--heading)] m-0 flex items-center gap-2">
              <span>{isDone ? 'Cover Letter Generation Complete!' : 'AI Generating Cover Letter...'}</span>
            </h3>
            <p className="text-xs text-[var(--muted)] font-medium m-0 mt-0.5">
              {isDone ? 'All 7 optimization stages finished cleanly.' : activeStage.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isDone && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--muted)] font-semibold">
              <Clock size={12} />
              <span>~{secondsRemaining}s remaining</span>
            </div>
          )}

          {!isDone && onCancel && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <X size={13} />
              <span>Cancel</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress Bar & Percentage Count-up */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-extrabold">
          <span className="text-[var(--heading)] flex items-center gap-2">
            {!isDone && <Loader2 size={13} className="animate-spin text-[var(--primary)]" />}
            <span>Stage {currentStageIndex + 1} of 7: {activeStage.label}</span>
          </span>
          <span className="text-[var(--primary)]">{progressPercent}%</span>
        </div>

        <div className="h-3 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden p-0.5 border border-[var(--border)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-400"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
      </div>

      {/* 7-Stage Generation Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
        {mockGenerationStages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex || isDone
          const isCurrent = idx === currentStageIndex && !isDone

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-xl border transition-all text-left space-y-1 ${
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--heading)] shadow-sm'
                  : 'bg-[var(--surface-hover)]/30 border-[var(--border)] text-[var(--muted)] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Step {stage.id}</span>
                {isCompleted ? (
                  <CheckCircle2 size={12} className="text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 size={12} className="animate-spin text-[var(--primary)]" />
                ) : null}
              </div>

              <span className="block font-bold text-xs leading-tight truncate">{stage.label}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default AIGenerationProgressPanel
