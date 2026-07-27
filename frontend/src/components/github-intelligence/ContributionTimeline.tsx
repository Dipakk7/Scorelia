import React from 'react'
import { Calendar, HelpCircle } from 'lucide-react'
import { githubAnalyticsMockData, type TimelineDayMetric } from '@/data/githubAnalyticsMockData'
import { ContributionHeatmap } from './ContributionHeatmap'
import { AnalyticsChartLegend } from './AnalyticsChartLegend'
import { cn } from '@/lib/utils'

export interface ContributionTimelineProps {
  timeline?: TimelineDayMetric[]
  className?: string
}

export const ContributionTimeline: React.FC<ContributionTimelineProps> = ({
  timeline = githubAnalyticsMockData.timeline,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-sm text-[var(--heading)]">
            <Calendar size={15} className="text-purple-400" />
            <span>Contribution Timeline</span>
            <span title="Contributions heat distribution">
              <HelpCircle size={13} className="text-[var(--muted)] cursor-pointer" />
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">When your contributions happened</p>
        </div>
        <div className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[var(--surface-hover)] text-[var(--muted)] border border-[var(--border)] cursor-pointer select-none">
          Last 30 Days ▾
        </div>
      </div>

      <ContributionHeatmap timeline={timeline} />

      <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between">
        <AnalyticsChartLegend variant="heatmap" />
      </div>
    </div>
  )
}
