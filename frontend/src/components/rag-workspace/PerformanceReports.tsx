import React from 'react'
import { Activity, Zap, BarChart3, TrendingUp } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { cn } from '@/lib/utils'

export interface PerformanceReportsProps {
  className?: string
}

export function PerformanceReports({ className }: PerformanceReportsProps) {
  const performanceTrendData = [
    { time: '00:00', p95LatencyMs: 24, qps: 42, similarityScore: 0.94 },
    { time: '04:00', p95LatencyMs: 19, qps: 38, similarityScore: 0.95 },
    { time: '08:00', p95LatencyMs: 31, qps: 84, similarityScore: 0.92 },
    { time: '12:00', p95LatencyMs: 42, qps: 128, similarityScore: 0.93 },
    { time: '16:00', p95LatencyMs: 28, qps: 96, similarityScore: 0.95 },
    { time: '20:00', p95LatencyMs: 22, qps: 64, similarityScore: 0.96 }
  ]

  const topCollectionsData = [
    { name: 'AI Research Papers', queries: 4120, precision: 96.4 },
    { name: 'System Architecture', queries: 2890, precision: 94.8 },
    { name: 'API Reference', queries: 1940, precision: 98.1 },
    { name: 'Security Benchmarks', queries: 1250, precision: 95.2 },
    { name: 'Customer Support', queries: 920, precision: 91.5 }
  ]

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 text-left', className)}>
      {/* Latency & QPS Trend Chart */}
      <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <Zap size={16} className="text-amber-400" />
            Retrieval Performance & Latency Telemetry
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            p95: 28ms
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121320', borderColor: '#ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="p95LatencyMs" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#latencyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Collections Volume Bar Chart */}
      <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <BarChart3 size={16} className="text-purple-400" />
            Top Query Collections
          </h3>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCollectionsData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121320', borderColor: '#ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="queries" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PerformanceReports
