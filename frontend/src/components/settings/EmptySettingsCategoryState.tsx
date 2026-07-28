import React from 'react'
import { Settings } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

export interface EmptySettingsCategoryStateProps {
  onReload?: () => void
  className?: string
}

export const EmptySettingsCategoryState: React.FC<EmptySettingsCategoryStateProps> = ({
  onReload,
  className,
}) => {
  return (
    <div className={className}>
      <EmptyState
        icon={<Settings className="w-10 h-10 text-[var(--primary)]" />}
        title="No Category Available"
        description="This settings category has not been configured yet."
        actionLabel="Reload"
        onAction={onReload || (() => window.location.reload())}
        variant="primary"
      />
    </div>
  )
}

export default EmptySettingsCategoryState
