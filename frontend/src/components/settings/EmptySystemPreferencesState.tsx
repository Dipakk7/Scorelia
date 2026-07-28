import React from 'react'
import { Settings } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

export interface EmptySystemPreferencesStateProps {
  onReload?: () => void
  className?: string
}

export const EmptySystemPreferencesState: React.FC<EmptySystemPreferencesStateProps> = ({
  onReload,
  className,
}) => {
  return (
    <div className={className}>
      <EmptyState
        icon={<Settings className="w-10 h-10 text-[var(--primary)]" />}
        title="No System Preferences Available"
        description="System preferences will become available after workspace initialization."
        actionLabel="Reload"
        onAction={onReload || (() => window.location.reload())}
        variant="primary"
      />
    </div>
  )
}

export default EmptySystemPreferencesState
