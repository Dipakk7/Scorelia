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
  const safeProd = productivity ?? githubDeveloperMetricsMockData.productivity
  const badges = Array.isArray(safeProd?.achievementBadges) ? safeProd.achievementBadges : []

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-white m-0">Productivity Insights</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Developer summary & achievements</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {safeProd?.qualityTrend ?? 'Stable'}
        </span>
      </div>

      {/* Summary Note Card */}
      <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-xs leading-relaxed text-slate-200 font-medium">
        <p className="m-0 flex items-start gap-2">
          <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <span>{safeProd?.weeklySummaryNote || 'Top performing developer output across repositories.'}</span>
        </p>
      </div>

      {/* Achievement Badges List */}
      <div className="space-y-2 text-xs">
        <div className="text-[11px] font-bold text-white">Recent Achievements</div>
        <div className="space-y-2">
          {badges.map((badge, idx) => (
            <div key={badge.title || idx} className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Award size={14} />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-white truncate">{badge.title}</div>
                  <div className="text-[10px] text-slate-400 truncate font-sans">{badge.desc || (badge as any).description || ''}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium font-mono">{badge.date || 'Recently'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductivityInsights
