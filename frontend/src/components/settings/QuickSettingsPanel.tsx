import React from 'react'
import { QuickActionCard } from './QuickActionCard'
import { systemPreferencesMockData } from './systemPreferencesMockData'
import { cn } from '@/lib/utils'

export interface QuickSettingsPanelProps {
  onActionClick?: (actionId: string) => void
  disabled?: boolean
  className?: string
}

export const QuickSettingsPanel: React.FC<QuickSettingsPanelProps> = React.memo(({
  onActionClick,
  disabled = false,
  className,
}) => {
  return (
    <section
      aria-label="Quick Settings Panel"
      className={cn('space-y-4 text-left font-sans', className)}
    >
      {/* Panel Header */}
      <div>
        <h2 className="text-lg font-bold text-[var(--heading)]">
          {systemPreferencesMockData.quickSettingsTitle}
        </h2>
        <p className="text-xs text-[var(--muted)]">
          {systemPreferencesMockData.quickSettingsSubtitle}
        </p>
      </div>

      {/* 5 Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {systemPreferencesMockData.quickActions.map((action) => (
          <QuickActionCard
            key={action.id}
            item={action}
            onAction={() => onActionClick?.(action.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  )
})

QuickSettingsPanel.displayName = 'QuickSettingsPanel'
export default QuickSettingsPanel
