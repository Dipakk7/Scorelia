import React from 'react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

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
      className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md space-y-2 hover:border-[var(--primary)]/30 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] transition-all duration-200 shadow-[var(--shadow-sm)] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
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
