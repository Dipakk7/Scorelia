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
  return (
    <div className={`space-y-3 text-left ${className}`}>
      <span className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5 font-display">
        <SlidersHorizontal size={14} className="text-purple-400" />
        Quick Actions
      </span>

      <div className="space-y-2">
        {actions.map((action) => (
          <QuickActionCard key={action.id} action={action} onClick={onActionClick} />
        ))}
      </div>
    </div>
  )
}

export default QuickActionsPanel
