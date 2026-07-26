import React from 'react'
import { InsightsWorkspace } from './InsightsWorkspace'
import type {
  AIInsightItem,
  ExecutiveRecommendationItem,
  QuickActionItemData,
} from '@/data/analyticsInsightsMockData'

interface AnalyticsSidebarProps {
  onInsightAction?: (insight: AIInsightItem) => void
  onApplyRecommendation?: (rec: ExecutiveRecommendationItem) => void
  onQuickActionClick?: (action: QuickActionItemData) => void
  className?: string
}

export function AnalyticsSidebar({
  onInsightAction,
  onApplyRecommendation,
  onQuickActionClick,
  className = '',
}: AnalyticsSidebarProps) {
  return (
    <aside
      className={`space-y-6 text-left ${className}`}
      aria-label="Executive Intelligence Sidebar"
    >
      <InsightsWorkspace
        onInsightAction={onInsightAction}
        onApplyRecommendation={onApplyRecommendation}
        onQuickActionClick={onQuickActionClick}
      />
    </aside>
  )
}

export default AnalyticsSidebar
