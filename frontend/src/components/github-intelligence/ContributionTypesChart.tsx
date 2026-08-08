import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronRight, PieChart as PieIcon } from 'lucide-react'
import { githubAnalyticsMockData, type ContributionTypeMetric } from '@/data/githubAnalyticsMockData'
import { AnalyticsChartLegend } from './AnalyticsChartLegend'
import { cn } from '@/lib/utils'

export interface ContributionTypesChartProps {
  types?: ContributionTypeMetric[]
  totalContributions?: number
  onViewDetails?: () => void
  className?: string
}

export const ContributionTypesChart: React.FC<ContributionTypesChartProps> = ({
  types = githubAnalyticsMockData.contributionTypes,
  totalContributions = githubAnalyticsMockData.totalContributions,
  onViewDetails,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <PieIcon size={16} className="text-purple-400" />
          <h3 className="font-bold text-sm text-white m-0">Contribution Types</h3>
        </div>
        <p className="text-[11px] text-slate-400 m-0 mt-0.5">What your contributions were</p>
      </div>

      <div className="flex items-center gap-4 py-1">
        {/* Donut Chart using Recharts PieChart */}
        <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={types ?? []}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={54}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {(types ?? []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    className={cn(
                      'transition-all duration-200 cursor-pointer',
                      activeIndex === index ? 'opacity-100 scale-105' : 'opacity-90'
                    )}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ContributionTypeMetric
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-950 text-white border border-slate-700/80 text-[10px] font-bold shadow-xl space-y-0.5">
                        <div className="text-slate-300">{data.label}</div>
                        <div className="text-purple-400 font-mono">{data.value} ({data.percentage}%)</div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center">
            <span className="text-lg font-black text-white font-mono">{totalContributions ?? 0}</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase font-mono">Total</span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-1.5 flex-1 text-[11px]">
          {(types ?? []).map((t, i) => (
            <div
              key={t.label}
              className={cn(
                'flex items-center justify-between p-1.5 rounded-lg transition-colors',
                activeIndex === i ? 'bg-slate-850' : 'hover:bg-slate-900/60'
              )}
            >
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} /> {t.label}
              </span>
              <span className="font-bold text-white font-mono">{t.value} ({t.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 text-center border-t border-white/5">
        <button
          type="button"
          onClick={onViewDetails}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-md px-2 py-1"
        >
          <span>View full contribution analytics</span> <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default ContributionTypesChart
