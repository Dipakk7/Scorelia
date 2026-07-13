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
        'flex flex-col items-center justify-center text-center p-8 border border-[var(--danger)]/15 rounded-[var(--radius-card)] bg-[var(--danger)]/[0.02] backdrop-blur-md min-h-[250px]',
        className
      )}
    >
      <div className="text-[var(--danger)] mb-4 bg-[var(--danger)]/10 p-3 rounded-[var(--radius-md)] border border-[var(--danger)]/20 animate-float">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-base font-bold font-display text-[var(--heading)] mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-[var(--muted)] max-w-sm mb-6 font-sans leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/5 hover:border-[var(--danger)]/50 rounded-[var(--radius-button)] font-bold cursor-pointer transition-all">
          {retryLabel}
        </Button>
      )}
    </motion.div>
  )
}
