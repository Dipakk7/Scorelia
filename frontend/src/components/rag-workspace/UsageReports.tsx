import React, { useState } from 'react'
import { HardDrive, Users, FileText, Database, TrendingUp } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { cn } from '@/lib/utils'

export interface UsageReportsProps {
  className?: string
}

export function UsageReports({ className }: UsageReportsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const usageTrendData = [
    { date: 'May 01', storageMB: 110, apiCalls: 1200, docsCount: 84 },
    { date: 'May 07', storageMB: 122, apiCalls: 1850, docsCount: 96 },
    { date: 'May 14', storageMB: 135, apiCalls: 2400, docsCount: 108 },
    { date: 'May 21', storageMB: 146, apiCalls: 3100, docsCount: 118 },
    { date: 'May 28', storageMB: 153.4, apiCalls: 3820, docsCount: 124 }
  ]

  return (
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <TrendingUp size={16} className="text-purple-400" />
            Workspace Storage & API Usage Growth
          </h3>
          <p className="text-xs text-slate-400">
            Monitor API request volume, document ingestion velocity, and vector storage growth.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#121320] border border-white/10 p-1 rounded-xl">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                timeRange === r ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              )}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={usageTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#121320', borderColor: '#ffffff20', borderRadius: '12px' }}
              itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="apiCalls" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4, fill: '#a855f7' }} />
            <Line type="monotone" dataKey="storageMB" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default UsageReports
