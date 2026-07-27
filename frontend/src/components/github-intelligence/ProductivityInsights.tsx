import React from 'react'
import { Sparkles, Award, Zap, ShieldCheck, TrendingUp } from 'lucide-react'
import { githubDeveloperMetricsMockData, type ProductivityInsightsData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface ProductivityInsightsProps {
  productivity?: ProductivityInsightsData
  className?: string
}

export const ProductivityInsights: React.FC<ProductivityInsightsProps> = ({
  productivity = githubDeveloperMetricsMockData.productivity,
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
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Productivity Insights</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Developer summary & achievements</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {productivity.qualityTrend}
        </span>
      </div>

      {/* Summary Note Card */}
      <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-xs leading-relaxed text-[var(--heading)] font-medium">
        <p className="m-0 flex items-start gap-2">
          <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <span>{productivity.weeklySummaryNote}</span>
        </p>
      </div>

      {/* Achievement Badges List */}
      <div className="space-y-2 text-xs">
        <div className="text-[11px] font-bold text-[var(--heading)]">Recent Achievements</div>
        <div className="space-y-2">
          {productivity.achievementBadges.map((badge) => (
            <div key={badge.title} className="p-2.5 rounded-xl border border-[var(--border)]/60 bg-[var(--surface-hover)]/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Award size={14} />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-[var(--heading)] truncate">{badge.title}</div>
                  <div className="text-[10px] text-[var(--muted)] truncate">{badge.desc}</div>
                </div>
              </div>
              <span className="text-[10px] text-[var(--muted)] shrink-0 font-medium">{badge.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
