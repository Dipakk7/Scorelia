import React, { useState } from 'react'
import type {
  AIInsightItem,
  ExecutiveRecommendationItem,
  QuickActionItemData,
} from '@/data/analyticsInsightsMockData'
import { AIInsightsPanel } from './AIInsightsPanel'
import { ActivityTimeline } from './ActivityTimeline'
import { QuickActionsPanel } from './QuickActionsPanel'
import { InsightsSkeleton } from './InsightsSkeleton'
import { EmptyInsightsState } from './EmptyInsightsState'
import { ArrowRight } from 'lucide-react'
import { useInsightsWorkspace } from '@/services/analytics/analyticsQueries'

interface InsightsWorkspaceProps {
  onInsightAction?: (insight: AIInsightItem) => void
  onApplyRecommendation?: (rec: ExecutiveRecommendationItem) => void
  onQuickActionClick?: (action: QuickActionItemData) => void
  className?: string
}

export function InsightsWorkspace({
  onInsightAction,
  onApplyRecommendation,
  onQuickActionClick,
  className = '',
}: InsightsWorkspaceProps) {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'insights' | 'activity'>('insights')
  const { data, isLoading, isError, refetch } = useInsightsWorkspace()

  if (isLoading) {
    return <InsightsSkeleton />
  }

  if (isError || !data) {
    return <EmptyInsightsState onRefresh={refetch} />
  }

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Sidebar Header Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveSidebarTab('insights')}
            className={`text-xs font-bold transition-colors cursor-pointer relative pb-1 ${
              activeSidebarTab === 'insights'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Insights
          </button>
          <button
            type="button"
            onClick={() => setActiveSidebarTab('activity')}
            className={`text-xs font-bold transition-colors cursor-pointer relative pb-1 ${
              activeSidebarTab === 'activity'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activity
          </button>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View all</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Tabbed View Body */}
      {activeSidebarTab === 'insights' ? (
        <AIInsightsPanel
          insights={data.insights}
          recommendations={data.recommendations}
          onInsightAction={onInsightAction}
          onApplyRecommendation={onApplyRecommendation}
        />
      ) : (
        <ActivityTimeline items={data.timelineItems} />
      )}

      {/* Quick Actions Section (Always visible below main sidebar content) */}
      <div className="pt-3 border-t border-white/5">
        <QuickActionsPanel actions={data.quickActions} onActionClick={onQuickActionClick} />
      </div>
    </div>
  )
}

export default InsightsWorkspace
