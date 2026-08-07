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
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-left space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Query Latency (ms)
          </h3>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">
            p95 Monitoring
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
              />
              <Line type="monotone" dataKey="latencyMs" name="Avg Latency" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="p95LatencyMs" name="p95 Latency" stroke="#ec4899" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Throughput Area Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-left space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="successfulQueries" name="Successful QPS" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Search Trend Bar Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-left space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Search Volume Trends
          </h3>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
            7-Day History
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={searchTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
              />
              <Bar dataKey="queriesCount" name="Total Queries" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PerformanceSection

