import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { ArrowRight } from 'lucide-react'
import { analyticsPerformanceMockData } from '@/data/analyticsPerformanceMockData'
import type { ResponseTimeTrendPoint } from '@/data/analyticsPerformanceMockData'
import { useScoreliaReducedMotion, getChartAnimationProps } from '@/lib/motion'

interface ResponseTimeChartProps {
  data?: ResponseTimeTrendPoint[]
  onViewDetails?: () => void
  className?: string
}

function CustomResponseTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="p-3 rounded-xl bg-[#121320] border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-1.5 text-left min-w-[140px]">
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
          <span className="font-mono font-bold text-slate-100">{entry.value}s</span>
        </div>
      ))}
    </div>
  )
}

export function ResponseTimeChart({
  data = analyticsPerformanceMockData.responseTimeTrend,
  onViewDetails,
  className = '',
}: ResponseTimeChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const animationProps = getChartAnimationProps(shouldReduceMotion, true)

  return (
    <div
      className={`flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left ${className}`}
    >
      {/* Header */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
          Performance Overview
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Key platform latency vs 1.5s SLA target
        </p>
      </div>

      {/* Recharts Line Chart */}
      <div className="w-full h-48 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#ffffff1a' }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[1.0, 2.0]}
              tickFormatter={(val) => `${val}s`}
            />

            <Tooltip content={<CustomResponseTooltip />} />

            {/* SLA Target Threshold Line */}
            <ReferenceLine
              y={1.5}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: 'SLA Target 1.5s',
                fill: '#f59e0b',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Line
              type="monotone"
              dataKey="responseTime"
              name="Response Time"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 4, fill: '#a855f7' }}
              activeDot={{ r: 6, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
              {...animationProps}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-white/5 flex justify-start">
        <button
          type="button"
          onClick={onViewDetails}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View performance details</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default ResponseTimeChart
