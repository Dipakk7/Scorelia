import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { GitCommit } from 'lucide-react'
import { githubDeveloperMetricsMockData, type CommitActivityData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface CommitActivityChartProps {
  activity?: CommitActivityData
  className?: string
}

export const CommitActivityChart: React.FC<CommitActivityChartProps> = ({
  activity = githubDeveloperMetricsMockData.commitActivity,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit size={16} className="text-sky-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Commit Activity</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Code additions & deletion frequency</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-[var(--heading)]">
            <strong className="text-sky-400">{activity.monthlyCommits}</strong> Monthly Commits
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activity.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="day" stroke="var(--muted)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="p-2.5 rounded-xl bg-[var(--heading)] text-[var(--surface)] text-[10px] font-bold shadow-lg space-y-1">
                      <div>{label} Activity</div>
                      <div className="text-sky-400 font-mono">{data.commits} Commits</div>
                      <div className="text-emerald-400 font-mono">+{data.additions} Additions</div>
                      <div className="text-rose-400 font-mono">-{data.deletions} Deletions</div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#commitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>Avg Commit Size: <strong className="text-[var(--heading)]">{activity.averageCommitSize}</strong></span>
        <span>Frequency: <strong className="text-emerald-400">{activity.commitFrequency}</strong></span>
      </div>
    </div>
  )
}
