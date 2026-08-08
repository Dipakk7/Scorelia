import React, { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { ArrowRight } from 'lucide-react'
import { analyticsChartsMockData } from '@/data/analyticsChartsMockData'
import type { TopFeatureUsagePoint } from '@/data/analyticsChartsMockData'
import { useScoreliaReducedMotion } from '@/lib/motion'

interface TopFeaturesChartProps {
  data?: TopFeatureUsagePoint[]
  onViewFullBreakdown?: () => void
  className?: string
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload

  return (
    <div className="p-3 rounded-xl bg-[#121320] border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-1 text-left min-w-[130px]">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
        <span className="font-bold text-slate-100">{item.feature}</span>
      </div>
      <p className="text-[11px] text-slate-400 font-mono m-0">
        {item.usage.toLocaleString()} uses ({item.percentage}%)
      </p>
    </div>
  )
}

export function TopFeaturesChart({
  data = analyticsChartsMockData.topFeatures,
  onViewFullBreakdown,
  className = '',
}: TopFeaturesChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const totalUsage = data.reduce((acc, curr) => acc + curr.usage, 0)

  return (
    <div
      className={`flex flex-col justify-between h-full p-4 sm:p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left shadow-sm ${className}`}
    >
      {/* Chart Header */}
      <div className="mb-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight font-display">
          Top Features by Usage
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Workflow feature adoption & utilization breakdown
        </p>
      </div>

      {/* Donut Chart & Legend List */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-2">
        {/* Recharts PieChart */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="feature"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={48}
                paddingAngle={3}
                isAnimationActive={!shouldReduceMotion}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#0f101c"
                    strokeWidth={2}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                      transition: 'filter 0.15s ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-lg font-extrabold text-slate-100 font-mono leading-none">
              {totalUsage.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 leading-none">
              Total Usage
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-1.5 w-full text-xs">
          {data.map((item, idx) => (
            <div
              key={item.feature}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`flex items-center justify-between gap-2 p-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
                activeIndex === idx ? 'bg-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 font-medium truncate hover:text-slate-100">
                  {item.feature}
                </span>
              </div>
              <span className="text-slate-100 font-mono font-bold shrink-0">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-white/5 flex justify-end mt-auto">
        <button
          type="button"
          onClick={onViewFullBreakdown}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View full breakdown</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default TopFeaturesChart
