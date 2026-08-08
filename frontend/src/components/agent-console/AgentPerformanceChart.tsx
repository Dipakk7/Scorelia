import React, { useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { ChartCard } from '@/components/ui/ChartCard'
import { ChartLegend, type LegendItem } from './ChartLegend'
import { mock90DayPerformanceData, mock24HourPerformanceData } from '@/data/performanceAnalyticsMockData'
import { useScoreliaReducedMotion, getChartAnimationProps } from '@/lib/motion'

export interface AgentPerformanceChartProps {
  timeRange?: '24h' | '7d' | '30d' | '90d'
  className?: string
}

export function AgentPerformanceChart({ timeRange = '7d', className }: AgentPerformanceChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const [seriesState, setSeriesState] = useState<LegendItem[]>([
    { id: 'successfulTasks', label: 'Successful Tasks', color: '#10b981', visible: true },
    { id: 'failedTasks', label: 'Failed Tasks', color: '#f43f5e', visible: true },
    { id: 'avgResponseTime', label: 'Avg Response Time (s)', color: '#a855f7', visible: true },
  ])

  const handleToggleSeries = (id: string) => {
    setSeriesState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    )
  }

  const isSuccessfulVisible = seriesState.find((s) => s.id === 'successfulTasks')?.visible
  const isFailedVisible = seriesState.find((s) => s.id === 'failedTasks')?.visible
  const isResponseVisible = seriesState.find((s) => s.id === 'avgResponseTime')?.visible

  const data = timeRange === '24h' ? mock24HourPerformanceData : mock90DayPerformanceData

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-[#121322] border border-white/10 shadow-2xl text-left text-xs font-sans space-y-1.5 min-w-[160px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-white/5 pb-1">
            Timestamp: {label}
          </p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ChartCard
      title="Agent Performance & Execution Trends"
      description="Track task execution volumes, failure rates, and response latency over time."
      headerActions={<ChartLegend items={seriesState} onToggleItem={handleToggleSeries} />}
      className={className}
    >
      <div style={{ width: '100%', height: 280 }} className="pt-2 text-xs font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-success" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="grad-failed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />

            <XAxis
              dataKey="date"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              yAxisId="left"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#a855f7"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={5}
              unit="s"
            />

            <RechartsTooltip content={<CustomTooltip />} />

            {isSuccessfulVisible && (
              <Area
                yAxisId="left"
                type="monotone"
                name="Successful Tasks"
                dataKey="successfulTasks"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#grad-success)"
                {...getChartAnimationProps(shouldReduceMotion, true)}
              />
            )}

            {isFailedVisible && (
              <Area
                yAxisId="left"
                type="monotone"
                name="Failed Tasks"
                dataKey="failedTasks"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#grad-failed)"
                {...getChartAnimationProps(shouldReduceMotion, true)}
              />
            )}

            {isResponseVisible && (
              <Line
                yAxisId="right"
                type="monotone"
                name="Avg Response Time (s)"
                dataKey="avgResponseTime"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 3, stroke: '#a855f7', strokeWidth: 1, fill: '#0b0c14' }}
                activeDot={{ r: 5, stroke: '#a855f7', strokeWidth: 2, fill: '#a855f7' }}
                {...getChartAnimationProps(shouldReduceMotion, true)}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default AgentPerformanceChart
