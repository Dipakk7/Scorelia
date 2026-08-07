import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import type {
  LatencyDataPoint,
  ThroughputDataPoint,
  SearchTrendDataPoint
} from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface PerformanceSectionProps {
  latencyData: LatencyDataPoint[]
  throughputData: ThroughputDataPoint[]
  searchTrendsData: SearchTrendDataPoint[]
  className?: string
}

export function PerformanceSection({
  latencyData,
  throughputData,
  searchTrendsData,
  className
}: PerformanceSectionProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6 select-none', className)}>
      {/* 1. Query Latency Line Chart */}
      <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Query Latency (ms)
          </h3>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">
            p95 Monitoring
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--heading)' }}
              />
              <Line type="monotone" dataKey="latencyMs" name="Avg Latency" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="p95LatencyMs" name="p95 Latency" stroke="#ec4899" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Throughput Area Chart */}
      <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Query Throughput (QPS)
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
            99.9% Success
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--heading)' }}
              />
              <Area type="monotone" dataKey="successfulQueries" name="Successful QPS" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Search Trend Bar Chart */}
      <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Search Method Breakdown
          </h3>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
            Hybrid Preferred
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={searchTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--heading)' }}
              />
              <Bar dataKey="hybridQueries" name="Hybrid" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="semanticQueries" name="Semantic" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="keywordQueries" name="Keyword" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PerformanceSection

