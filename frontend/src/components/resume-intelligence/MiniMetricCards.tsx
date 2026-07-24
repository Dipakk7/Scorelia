import React, { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricItem {
  id: string
  value: string
  label: string
  subtitle?: string
  badgeText?: string
  badgeVariant?: 'emerald' | 'amber' | 'blue' | 'purple'
  sparklineColor?: string
  trend?: number[]
}

interface MiniMetricCardsProps {
  metrics?: MetricItem[]
}

const defaultMetrics: MetricItem[] = [
  {
    id: 'score-change',
    value: '+12',
    label: 'Score Change',
    subtitle: 'vs last analysis',
    badgeText: '↑ +12 pts',
    badgeVariant: 'emerald',
    sparklineColor: '#10b981',
    trend: [72, 75, 78, 82, 85, 92],
  },
  {
    id: 'ats-friendly',
    value: '98%',
    label: 'ATS Friendly',
    subtitle: 'Parse Rate 100%',
    badgeText: 'Excellent',
    badgeVariant: 'emerald',
    sparklineColor: '#10b981',
    trend: [90, 92, 95, 96, 98, 98],
  },
  {
    id: 'content-quality',
    value: '88%',
    label: 'Content Quality',
    subtitle: 'Action Verbs 92%',
    badgeText: 'Very Good',
    badgeVariant: 'amber',
    sparklineColor: '#f59e0b',
    trend: [80, 82, 84, 85, 87, 88],
  },
  {
    id: 'recruiter-appeal',
    value: '91%',
    label: 'Recruiter Appeal',
    subtitle: 'Impact Density High',
    badgeText: 'Excellent',
    badgeVariant: 'emerald',
    sparklineColor: '#10b981',
    trend: [82, 84, 87, 89, 90, 91],
  },
]

export const MiniMetricCards: React.FC<MiniMetricCardsProps> = React.memo(({
  metrics = defaultMetrics,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 h-full">
      {metrics.map((item) => {
        const trend = item.trend || [50, 60, 55, 70, 85, 90]
        const minVal = Math.min(...trend)
        const maxVal = Math.max(...trend)
        const range = maxVal - minVal || 1

        const points = trend
          .map((val, idx) => {
            const x = (idx / (trend.length - 1)) * 100
            const y = 30 - ((val - minVal) / range) * 22
            return `${x},${y}`
          })
          .join(' L ')

        return (
          <Card
            key={item.id}
            className="bg-[#0b0c14]/90 border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md relative overflow-hidden shadow-md group hover:border-slate-700/80 hover:bg-slate-900/60 transition-all duration-300"
          >
            {/* Top Row: Value & Badge */}
            <div className="flex flex-col gap-1 z-10">
              <div className="flex items-center justify-between gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">
                  {item.value}
                </span>

                {item.badgeText && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1',
                      item.badgeVariant === 'emerald' &&
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      item.badgeVariant === 'amber' &&
                        'bg-amber-500/10 text-amber-400 border-amber-500/20',
                      item.badgeVariant === 'purple' &&
                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    )}
                  >
                    {item.badgeVariant === 'emerald' && <TrendingUp className="w-2.5 h-2.5" />}
                    {item.badgeVariant === 'amber' && <Minus className="w-2.5 h-2.5" />}
                    {item.badgeText}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-300 tracking-tight">
                  {item.label}
                </span>
                {item.subtitle && (
                  <span className="text-[11px] text-slate-400 font-normal">{item.subtitle}</span>
                )}
              </div>
            </div>

            {/* Bottom Row: Dynamic SVG Sparkline */}
            <div className="mt-3 h-8 w-full relative z-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <path
                  d={`M ${points}`}
                  fill="none"
                  stroke={item.sparklineColor || '#10b981'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="100"
                  cy={30 - ((trend[trend.length - 1] - minVal) / range) * 22}
                  r="3.5"
                  fill={item.sparklineColor || '#10b981'}
                  className="animate-pulse"
                />
              </svg>
            </div>
          </Card>
        )
      })}
    </div>
  )
})

MiniMetricCards.displayName = 'MiniMetricCards'
export default MiniMetricCards
