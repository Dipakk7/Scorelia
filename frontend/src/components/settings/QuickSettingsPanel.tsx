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
      className={cn('space-y-4 text-left font-sans w-full', className)}
    >
      {/* Panel Header */}
      <div className="pb-3 border-b border-white/10">
        <h2 className="text-lg font-bold text-white tracking-tight font-sans">
          {systemPreferencesMockData.quickSettingsTitle}
        </h2>
        <p className="text-xs text-slate-400 font-medium font-sans">
          {systemPreferencesMockData.quickSettingsSubtitle}
        </p>
      </div>

      {/* 5 Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 w-full">
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
