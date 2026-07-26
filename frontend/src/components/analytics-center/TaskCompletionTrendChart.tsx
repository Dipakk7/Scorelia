import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { analyticsPerformanceMockData } from '@/data/analyticsPerformanceMockData'
import type { TaskCompletionTrendPoint } from '@/data/analyticsPerformanceMockData'
import { useScoreliaReducedMotion, getChartAnimationProps } from '@/lib/motion'

interface TaskCompletionTrendChartProps {
  data?: TaskCompletionTrendPoint[]
  onViewReport?: () => void
  className?: string
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="p-3 rounded-xl bg-[#121320] border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-1.5 text-left min-w-[150px]">
      <p className="text-[11px] font-bold text-slate-400 m-0 border-b border-white/10 pb-1">
        {payload[0]?.payload?.displayDate || label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300 font-medium">{entry.name}</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export function TaskCompletionTrendChart({
  data = analyticsPerformanceMockData.taskCompletionTrend,
  onViewReport,
  className = '',
}: TaskCompletionTrendChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const animationProps = getChartAnimationProps(shouldReduceMotion, true)

  return (
    <div
      className={`flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left ${className}`}
    >
      {/* Header & Controls */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
            Task Completion Trend
          </h3>
          {/* Legend */}
          <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="text-slate-300">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className="text-slate-300">Failed</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151628] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Weekly</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* Recharts Stacked Bar Chart */}
      <div className="w-full h-48 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#ffffff1a' }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val)}
            />

            <Tooltip content={<CustomBarTooltip />} />

            <Bar dataKey="failed" name="Failed" stackId="a" fill="#f59e0b" radius={[0, 0, 2, 2]} {...animationProps} />
            <Bar dataKey="pending" name="Pending" stackId="a" fill="#3b82f6" {...animationProps} />
            <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} {...animationProps} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-white/5 flex justify-end">
        <button
          type="button"
          onClick={onViewReport}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View detailed report</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default TaskCompletionTrendChart
