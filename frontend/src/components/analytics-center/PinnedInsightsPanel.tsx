import React from 'react'
import { Pin, Sparkles, X } from 'lucide-react'

interface PinnedInsightItem {
  id: string
  title: string
  summary: string
  timestamp: string
}

interface PinnedInsightsPanelProps {
  pinnedInsightIds?: string[]
  onUnpin?: (id: string) => void
  className?: string
}

export function PinnedInsightsPanel({
  pinnedInsightIds = ['engagement_spike'],
  onUnpin,
  className = '',
}: PinnedInsightsPanelProps) {
  const pinnedInsights: PinnedInsightItem[] = [
    { id: 'engagement_spike', title: 'User Engagement', summary: 'Engagement is 24% higher than last week across interactive modules.', timestamp: '10m ago' },
  ].filter((i) => pinnedInsightIds.includes(i.id))

  return (
    <div className={`space-y-3 text-left ${className}`}>
      <div>
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2 m-0">
          <Pin size={14} className="text-purple-400 fill-current" />
          Pinned AI Insights
        </h4>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Priority insights pinned to the executive header feed
        </p>
      </div>

      <div className="space-y-2">
        {pinnedInsights.length === 0 ? (
          <p className="text-xs text-slate-500 font-medium py-2 m-0">No insights pinned yet.</p>
        ) : (
          pinnedInsights.map((insight) => (
            <div
              key={insight.id}
              tabIndex={0}
              className="flex items-start justify-between gap-2 p-3 rounded-xl bg-[#0f101c] border border-purple-500/30 text-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-400 shrink-0" />
                  <span className="font-bold text-slate-100 truncate">{insight.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed m-0 line-clamp-2">
                  {insight.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onUnpin?.(insight.id)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Unpin Insight"
              >
                <X size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PinnedInsightsPanel
