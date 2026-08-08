import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts'
import { ChartCard } from '@/components/ui/ChartCard'
import { mockTaskDistribution } from '@/data/performanceAnalyticsMockData'
import { useScoreliaReducedMotion } from '@/lib/motion'

export interface TaskDistributionChartProps {
  className?: string
}

export function TaskDistributionChart({ className }: TaskDistributionChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="p-3 rounded-xl bg-[#121322] border border-white/10 shadow-2xl text-left text-xs font-sans space-y-1">
          <p className="font-bold text-white tracking-tight">{data.name}</p>
          <div className="flex items-center gap-3 text-slate-300 text-xs">
            <span>Share: <strong className="text-white">{data.percentage}%</strong></span>
            <span>Total: <strong className="text-purple-300 font-mono">{data.count.toLocaleString()}</strong> tasks</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ChartCard
      title="Task Category Distribution"
      description="Percentage breakdown of workload distribution across AI domain capabilities."
      className={className}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Recharts Donut Pie Chart */}
        <div style={{ width: '100%', height: 250 }} className="sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RechartsTooltip content={<CustomTooltip />} />
              <Pie
                data={mockTaskDistribution}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                isAnimationActive={!shouldReduceMotion}
                animationDuration={800}
              >
                {mockTaskDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="#0e101d" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Table */}
        <div className="sm:w-1/2 space-y-2 text-xs text-slate-300 w-full text-left">
          {mockTaskDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-white/5">
              <div className="flex items-center gap-2 truncate">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-slate-200 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0">
                <span className="font-bold text-white">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  )
}

export default TaskDistributionChart
