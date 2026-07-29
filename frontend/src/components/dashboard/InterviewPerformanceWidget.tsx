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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-2.5 shadow-[var(--shadow-md)] text-xs font-mono font-bold text-[var(--heading)]">
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
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md space-y-3 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--heading)] tracking-tight">Interview Performance</h3>
        <span className="text-[11px] font-mono font-semibold text-[var(--muted-color)] bg-[var(--surface-hover)] px-2 py-0.5 rounded border border-[var(--border)]">
          Last 5 Interviews
        </span>
      </div>

      <div className="h-28 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis dataKey="category" stroke="var(--border)" fontSize={11} tickLine={false} axisLine={false} tickMargin={4} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis stroke="var(--border)" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={4} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
        <div>
          <span className="text-[10px] text-[var(--muted-color)] uppercase font-mono block leading-none">Overall Performance</span>
          <span className="font-bold text-[var(--heading)] font-mono text-sm leading-tight">{overallScore}% {overallStatus}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-400">{trendText}</span>
      </div>
    </div>
  )
})
export default InterviewPerformanceWidget
