import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { ChevronDown } from 'lucide-react'
import { analyticsChartsMockData } from '@/data/analyticsChartsMockData'
import type { ActiveUsersGrowthPoint } from '@/data/analyticsChartsMockData'
import { useScoreliaReducedMotion, getChartAnimationProps } from '@/lib/motion'

interface ActiveUsersGrowthChartProps {
  data?: ActiveUsersGrowthPoint[]
  isLoading?: boolean
  isEmpty?: boolean
  className?: string
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="p-3 rounded-xl bg-[#121320] border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[150px] text-left">
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

export function ActiveUsersGrowthChart({
  data = analyticsChartsMockData.activeUsersGrowth,
  isLoading = false,
  isEmpty = false,
  className = '',
}: ActiveUsersGrowthChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const animationProps = getChartAnimationProps(shouldReduceMotion, true)

  return (
    <div
      className={`flex flex-col justify-between h-full p-4 sm:p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left shadow-sm ${className}`}
    >
      {/* Chart Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight font-display">
            Active Users Growth
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
            Unique active user trend over recent timeframes
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151628] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Last 30 Days</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-56 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanUsersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />

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
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(2)}K` : val)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="activeUsers"
              name="Active Users"
              stroke="#38bdf8"
              strokeWidth={3}
              fill="url(#cyanUsersGrad)"
              activeDot={{ r: 5, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
              {...animationProps}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ActiveUsersGrowthChart
