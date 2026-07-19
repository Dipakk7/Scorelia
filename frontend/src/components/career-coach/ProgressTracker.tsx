
interface ProgressTrackerProps {
  value: number
  className?: string
}

export function ProgressTracker({ value, className = '' }: ProgressTrackerProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200/20 dark:border-slate-800/20 relative ${className}`}>
      <div
        className="bg-brand-600 dark:bg-brand-500 h-2.5 rounded-full progress-fill progress-shimmer"
        style={{ transform: `scaleX(${clampedValue / 100})` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
export default ProgressTracker
