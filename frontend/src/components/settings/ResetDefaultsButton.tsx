import React from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useResetSettingsMutation } from '@/hooks/settings/useSettingsHooks'
import { cn } from '@/lib/utils'

export interface ResetDefaultsButtonProps {
  onClick?: () => void
  disabled?: boolean
  label?: string
  className?: string
}

export const ResetDefaultsButton: React.FC<ResetDefaultsButtonProps> = React.memo(({
  onClick,
  disabled = false,
  label = 'Reset to Defaults',
  className,
}) => {
  const resetMutation = useResetSettingsMutation()

  const handleReset = async () => {
    if (onClick) {
      onClick()
      return
    }
    try {
      await resetMutation.mutateAsync()
    } catch {
      // Handled by React Query mutation
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      disabled={disabled || resetMutation.isPending}
      type="button"
      aria-label={label}
      className={cn(
        'text-xs text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] border border-[var(--border)]/60 rounded-md gap-1.5 h-8 px-3 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] min-h-[36px]',
        className
      )}
    >
      {resetMutation.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <RotateCcw className="w-3.5 h-3.5" />
      )}
      <span>{resetMutation.isPending ? 'Resetting...' : label}</span>
    </Button>
  )
})

ResetDefaultsButton.displayName = 'ResetDefaultsButton'
export default ResetDefaultsButton
