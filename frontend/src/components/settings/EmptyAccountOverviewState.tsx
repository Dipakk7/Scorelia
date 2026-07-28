import React from 'react'
import { UserX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

export interface EmptyAccountOverviewStateProps {
  onReload?: () => void
  className?: string
}

export const EmptyAccountOverviewState: React.FC<EmptyAccountOverviewStateProps> = ({
  onReload,
  className,
}) => {
  return (
    <div className={className}>
      <EmptyState
        icon={<UserX className="w-10 h-10 text-[var(--primary)]" />}
        title="No Account Information Available"
        description="Account information will appear after your workspace has been initialized."
        actionLabel="Reload"
        onAction={onReload || (() => window.location.reload())}
        variant="primary"
      />
    </div>
  )
}

export default EmptyAccountOverviewState
