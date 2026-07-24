import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

export interface InterviewMetricPoint {
  category: string
  score: number
  color: string
}

const DEFAULT_INTERVIEW_DATA: InterviewMetricPoint[] = [
  { category: 'Confidence', score: 85, color: '#38bdf8' },
  { category: 'Communication', score: 88, color: '#a855f7' },
  { category: 'Technical', score: 92, color: '#6366f1' },
  { category: 'Problem Solving', score: 80, color: '#f59e0b' },
  { category: 'Behavioral', score: 86, color: '#ec4899' },
]

interface InterviewPerformanceWidgetProps {
  data?: InterviewMetricPoint[]
  overallScore?: number
  overallStatus?: string
  trendText?: string
}

function CustomBarTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#121320] p-2 shadow-xl text-xs font-mono font-bold text-slate-100">
        <span>{payload[0].payload.category}: {payload[0].value}%</span>
      </div>
    )
  }
  return null
}

export const InterviewPerformanceWidget: React.FC<InterviewPerformanceWidgetProps> = React.memo(({
  data = DEFAULT_INTERVIEW_DATA,
  overallScore = 86,
  overallStatus = 'Good',
  trendText = '↑ 6% vs last week',
}) => {
  const barData = React.useMemo(() => {
    if (!data || data.length === 0) return DEFAULT_INTERVIEW_DATA
    return data
  }, [data])

  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-3 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">Interview Performance</h3>
        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          Last 5 Interviews
        </span>
      </div>

      <div className="h-28 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis dataKey="category" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={8} domain={[0, 100]} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none">Overall Performance</span>
          <span className="font-bold text-white font-mono text-sm leading-tight">{overallScore}% {overallStatus}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-400">{trendText}</span>
      </div>
    </div>
  )
})
export default InterviewPerformanceWidget
