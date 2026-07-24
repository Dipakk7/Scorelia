import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export interface TrendPoint {
  month: string
  score: number
}

const DEFAULT_TREND_DATA: TrendPoint[] = [
  { month: 'Jan', score: 50 },
  { month: 'Feb', score: 64 },
  { month: 'Mar', score: 69 },
  { month: 'Apr', score: 73 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 85 },
  { month: 'Jul', score: 87 },
]

interface CareerTrendWidgetProps {
  data?: TrendPoint[]
  timeframe?: string
  onTimeframeChange?: (tf: string) => void
}

function CustomTrendTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const val = payload[0].value
    return (
      <div className="rounded-xl border border-white/10 bg-[#121320] p-2.5 shadow-xl text-left font-sans select-none text-xs space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">{label}</p>
        <div className="flex items-center gap-2 font-mono font-bold text-white">
          <span className="h-2 w-2 rounded-full bg-purple-400" />
          <span>ATS Score: {val}%</span>
        </div>
      </div>
    )
  }
  return null
}

export const CareerTrendWidget: React.FC<CareerTrendWidgetProps> = React.memo(({
  data = DEFAULT_TREND_DATA,
  timeframe = 'This Year',
}) => {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return DEFAULT_TREND_DATA
    return data
  }, [data])
  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-4 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">Career Intelligence Trend</h3>
        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer hover:border-white/20">
          {timeframe}
        </span>
      </div>

      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="trendLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTrendTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#trendLineGrad)"
              strokeWidth={3}
              dot={{ fill: '#a855f7', r: 4, stroke: '#121325', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})
export default CareerTrendWidget
