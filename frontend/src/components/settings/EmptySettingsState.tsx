import React from 'react'
import { Settings, RefreshCw } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

export interface EmptySettingsStateProps {
  onReload?: () => void
  className?: string
}

export const EmptySettingsState: React.FC<EmptySettingsStateProps> = ({ onReload, className }) => {
  return (
    <div className={className}>
      <EmptyState
        icon={<Settings className="w-10 h-10 text-[var(--primary)]" />}
        title="No settings available"
        description="Configure your workspace preferences once your account is ready."
        actionLabel="Reload"
        onAction={onReload || (() => window.location.reload())}
        variant="primary"
      />
    </div>
  )
}

export default EmptySettingsState
