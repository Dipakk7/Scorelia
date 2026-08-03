import React from 'react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { cn } from '@/lib/utils'

export interface SparklineMetricProps {
  title: string
  score: string | number
  status: string
  change: string
  color: string
  gradientId: string
  strokeColor: string
  fillColor: string
  chartData?: { value: number }[]
  isSelected?: boolean
  onClick?: () => void
}

const DEFAULT_SPARKLINE_DATA = [
  { value: 40 },
  { value: 55 },
  { value: 50 },
  { value: 70 },
  { value: 65 },
  { value: 85 },
  { value: 90 },
]

export const SparklineMetricCard: React.FC<SparklineMetricProps> = React.memo(({
  title,
  score,
  status,
  change,
  color,
  gradientId,
  strokeColor,
  fillColor,
  chartData = DEFAULT_SPARKLINE_DATA,
  isSelected = false,
  onClick,
}) => {
  // Ensure chartData is safe for Recharts area rendering
  const safeData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return DEFAULT_SPARKLINE_DATA
    if (chartData.length === 1) return [{ value: chartData[0].value }, { value: chartData[0].value }]
    return chartData
  }, [chartData])

  return (
    <div
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      aria-selected={onClick ? isSelected : undefined}
      onClick={onClick}
      className={cn(
        'p-4 rounded-2xl bg-[#0f101c] transition-all duration-200 space-y-2 select-none',
        'hover:bg-[#15172a] hover:border-purple-500/40 hover:-translate-y-0.5 hover:shadow-md',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
        onClick && 'cursor-pointer',
        isSelected
          ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border border-white/10 shadow-sm'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--muted-color)] truncate">{title}</span>
        <span className={`text-[11px] font-mono font-bold ${color}`}>{change}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-extrabold font-mono text-[var(--heading)]">{score}</span>
        <span className="text-[11px] font-mono text-[var(--muted-color)] uppercase font-semibold">{status}</span>
      </div>
      {/* Recharts Area Sparkline Graph */}
      <div className="h-6 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={safeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})
export default SparklineMetricCard
