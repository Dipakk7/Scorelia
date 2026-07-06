import { useEffect } from 'react'
import { Play, Pause, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface InterviewTimerProps {
  secondsLeft: number
  totalSeconds: number
  isPaused: boolean
  onPauseToggle: () => void
  onTimeUp?: () => void
}

export default function InterviewTimer({
  secondsLeft,
  totalSeconds,
  isPaused,
  onPauseToggle,
  onTimeUp,
}: InterviewTimerProps) {
  // Format MM:SS
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Calculate circular progress percentages
  const fraction = totalSeconds > 0 ? secondsLeft / totalSeconds : 0
  const dashoffset = Math.max(0, 100 - fraction * 100)

  // Critical warnings
  const isCritical = secondsLeft <= 60
  const isWarning = secondsLeft <= 120 && secondsLeft > 60

  useEffect(() => {
    if (secondsLeft === 0 && onTimeUp) {
      onTimeUp()
    }
  }, [secondsLeft, onTimeUp])

  return (
    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border text-center space-y-4">
      {/* Circular Timer Visualization */}
      <div className="relative h-28 w-28 flex items-center justify-center">
        <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r="48"
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="56"
            cy="56"
            r="48"
            className={cn(
              'fill-none stroke-current transition-all duration-1000 ease-linear',
              isCritical
                ? 'text-rose-500 animate-pulse'
                : isWarning
                ? 'text-amber-500'
                : 'text-brand-600 dark:text-brand-500',
              isPaused && 'text-slate-400 dark:text-slate-600'
            )}
            strokeWidth="6"
            strokeDasharray="301.6" // 2 * pi * r (approx 2 * 3.14159 * 48 = 301.59)
            strokeDashoffset={(dashoffset / 100) * 301.6}
            strokeLinecap="round"
          />
        </svg>

        {/* Text inside circle */}
        <div className="z-10 text-center select-none font-display">
          <span
            className={cn(
              'text-lg font-bold block tabular-nums',
              isCritical ? 'text-rose-500' : 'text-slate-850 dark:text-white',
              isPaused && 'text-slate-400 dark:text-slate-500'
            )}
          >
            {formattedTime}
          </span>
          <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-0.5">
            {isPaused ? 'Paused' : 'Remaining'}
          </span>
        </div>
      </div>

      {/* Control Buttons & Warnings */}
      <div className="space-y-3 w-full">
        {isCritical && !isPaused && (
          <div className="flex items-center justify-center gap-1.5 text-rose-500 text-[10px] font-semibold animate-pulse-slow">
            <AlertTriangle size={12} />
            <span>Time running out! Wrap up answer.</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onPauseToggle}
          className={cn(
            'w-full h-8 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer border-slate-200 dark:border-slate-800',
            isPaused
              ? 'text-emerald-600 hover:bg-emerald-500/5 hover:border-emerald-500/20'
              : 'text-slate-600 hover:bg-slate-50'
          )}
        >
          {isPaused ? (
            <>
              <Play size={10} />
              <span>Resume Timer</span>
            </>
          ) : (
            <>
              <Pause size={10} />
              <span>Pause Simulator</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
