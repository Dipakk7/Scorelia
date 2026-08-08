import React, { useState, useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from 'recharts'
import { ChartCard } from '@/components/ui/ChartCard'
import { mockTopAgentsRanked } from '@/data/performanceAnalyticsMockData'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type SortMetric = 'tasksCompleted' | 'successRate' | 'avgResponseTime'

export interface TopAgentsChartProps {
  className?: string
}

export function TopAgentsChart({ className }: TopAgentsChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [sortBy, setSortBy] = useState<SortMetric>('tasksCompleted')

  const sortedData = useMemo(() => {
    return [...mockTopAgentsRanked].sort((a, b) => {
      if (sortBy === 'tasksCompleted') return (b.tasksCompleted ?? 0) - (a.tasksCompleted ?? 0)
      if (sortBy === 'successRate') return (b.successRate ?? 0) - (a.successRate ?? 0)
      if (sortBy === 'avgResponseTime') return parseFloat(a.avgResponseTime || '0') - parseFloat(b.avgResponseTime || '0')
      return 0
    })
  }, [sortBy])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="p-3 rounded-xl bg-[#121322] border border-white/10 shadow-2xl text-left text-xs font-sans space-y-1">
          <p className="font-bold text-white tracking-tight">{data.name}</p>
          <p className="text-[10px] text-purple-300 font-mono font-semibold">{data.category}</p>
          <div className="space-y-0.5 pt-1 text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Tasks:</span>
              <strong className="text-white font-mono">{(data.tasksCompleted ?? 0).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Success Rate:</span>
              <strong className="text-emerald-400 font-mono">{data.successRate}%</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Avg Latency:</span>
              <strong className="text-amber-300 font-mono">{data.avgResponseTime}</strong>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ChartCard
      title="Top Performing Agents Ranking"
      description="Ranked overview of agent throughput, execution success, and response latency."
      headerActions={
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0b0c14] border border-white/10 text-xs select-none">
          <button
            type="button"
            onClick={() => setSortBy('tasksCompleted')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer',
              sortBy === 'tasksCompleted'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Tasks
          </button>
          <button
            type="button"
            onClick={() => setSortBy('successRate')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer',
              sortBy === 'successRate'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Success Rate
          </button>
          <button
            type="button"
            onClick={() => setSortBy('avgResponseTime')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer',
              sortBy === 'avgResponseTime'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Latency
          </button>
        </div>
      }
      className={className}
    >
      <div style={{ width: '100%', height: 270 }} className="pt-2 text-xs font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />

            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />

            <YAxis
              type="category"
              dataKey="name"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={125}
            />

            <RechartsTooltip content={<CustomTooltip />} />

            <Bar
              dataKey={sortBy}
              radius={[0, 6, 6, 0]}
              isAnimationActive={!shouldReduceMotion}
              animationDuration={800}
            >
              {sortedData.map((entry, index) => {
                const color = index === 0 ? '#a855f7' : index === 1 ? '#6366f1' : index === 2 ? '#3b82f6' : '#64748b'
                return <Cell key={`cell-${entry.name}`} fill={color} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default TopAgentsChart
