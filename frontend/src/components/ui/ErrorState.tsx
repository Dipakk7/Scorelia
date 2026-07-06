import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'An error occurred',
  message = 'We encountered an error loading this section. Please try again.',
  retryLabel = 'Retry',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-red-200/50 dark:border-red-900/30 rounded-xl bg-red-50/20 dark:bg-red-950/10 min-h-[250px]',
        className
      )}
    >
      <div className="text-red-500 mb-4 bg-red-50 dark:bg-red-950/60 p-3 rounded-full border border-red-100 dark:border-red-900/50">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-base font-semibold font-display text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-sans">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:hover:text-red-400">
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
