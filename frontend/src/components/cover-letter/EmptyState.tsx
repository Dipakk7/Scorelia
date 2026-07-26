import React from 'react'
import { MailOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Cover Letter Created Yet',
  description = 'Select a resume and job description to generate a highly targeted, AI-optimized cover letter.',
  actionLabel = 'Start New Cover Letter',
  onAction,
}) => {
  return (
    <div
      aria-label="Empty Cover Letter State"
      className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 space-y-4 max-w-xl mx-auto my-8"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm">
        <MailOpen size={32} />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display font-bold text-lg text-[var(--heading)]">{title}</h3>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{description}</p>
      </div>

      {onAction && (
        <Button
          onClick={onAction}
          className="mt-2 flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  )
}

export default EmptyState
