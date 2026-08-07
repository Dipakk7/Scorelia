import React from 'react'
import { TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { marketDemandMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { MarketDemandData } from '@/types/careerRoadmap'

export interface MarketDemandCardProps {
  marketData?: MarketDemandData
  className?: string
}

export function MarketDemandCard({
  marketData = marketDemandMockData,
  className,
}: MarketDemandCardProps) {
  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>AI/ML Market Demand &amp; Salary Insights</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Real-time industry hiring indicators for target role: AI/ML Engineer
          </p>
        </div>
        <span className="text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          <span>{marketData.demandLevel} Demand</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Hiring Trend (YoY)
          </span>
          <div className="text-base font-bold text-emerald-400 flex items-center gap-1">
            <span>{marketData.hiringTrend}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Top tier candidate shortage
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Estimated Salary Range
          </span>
          <div className="text-base font-bold text-purple-300 flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>{marketData.salaryRange}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Based on Entry–Mid AI role benchmark
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Industry Growth Forecast
          </span>
          <div className="text-base font-bold text-cyan-300 flex items-center gap-1">
            <span>{marketData.industryGrowth}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            High tech &amp; Enterprise expansion
          </span>
        </div>
      </div>

      {/* Top Hiring Skills Pills */}
      <div className="space-y-1.5 pt-2 border-t border-white/5">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          <span>Most Requested Skills by Recruiters:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {marketData.topHiringSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-[#0b0c14] border border-white/10 text-xs font-mono font-medium text-slate-200"
            >
              #{skill}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
export default MarketDemandCard
