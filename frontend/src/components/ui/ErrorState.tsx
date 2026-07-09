import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-red-500/10 dark:border-red-500/10 rounded-2xl bg-rose-500/[0.02] dark:bg-rose-500/[0.01] backdrop-blur-md min-h-[250px]',
        className
      )}
    >
      <div className="text-rose-500 mb-4 bg-rose-500/10 p-3 rounded-2xl border border-rose-500/25 animate-float">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-200 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-sans leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 hover:bg-rose-500/5 hover:text-rose-700 hover:border-red-300 dark:border-red-900/40 dark:hover:bg-rose-950/20 dark:hover:text-red-400 rounded-xl font-bold cursor-pointer transition-all">
          {retryLabel}
        </Button>
      )}
    </motion.div>
  )
}
