import React from 'react'
import { Settings } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

export interface EmptyGeneralPreferencesStateProps {
  onReload?: () => void
  className?: string
}

export const EmptyGeneralPreferencesState: React.FC<EmptyGeneralPreferencesStateProps> = ({
  onReload,
  className,
}) => {
  return (
    <div className={className}>
      <EmptyState
        icon={<Settings className="w-10 h-10 text-[var(--primary)]" />}
        title="No Preferences Available"
        description="General preferences will appear once your workspace is configured."
        actionLabel="Reload"
        onAction={onReload || (() => window.location.reload())}
        variant="primary"
      />
    </div>
  )
}

export default EmptyGeneralPreferencesState
