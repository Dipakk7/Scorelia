import React from 'react'
import { analyticsInsightsMockData } from '@/data/analyticsInsightsMockData'
import type { QuickActionItemData } from '@/data/analyticsInsightsMockData'
import { QuickActionCard } from './QuickActionCard'
import { SlidersHorizontal } from 'lucide-react'

interface QuickActionsPanelProps {
  actions?: QuickActionItemData[]
  onActionClick?: (action: QuickActionItemData) => void
  className?: string
}

export function QuickActionsPanel({
  actions = analyticsInsightsMockData.quickActions,
  onActionClick,
  className = '',
}: QuickActionsPanelProps) {
  const visibleActions = actions.slice(0, 3)

  return (
    <div className={`space-y-2.5 text-left ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5 font-display">
          <SlidersHorizontal size={13} className="text-purple-400" />
          Quick Actions
        </span>
      </div>

      <div className="space-y-1.5">
        {visibleActions.map((action) => (
          <QuickActionCard key={action.id} action={action} onClick={onActionClick} />
        ))}
      </div>
    </div>
  )
}

export default QuickActionsPanel
