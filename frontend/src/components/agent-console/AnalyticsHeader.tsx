import React from 'react'
import { Activity, Database, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnalyticsHeaderProps {
  className?: string
}

export function AnalyticsHeader({ className }: AnalyticsHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Performance Analytics</span>
          <span className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Activity size={16} />
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Monitor agent performance, task execution trends, and operational efficiency.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs font-semibold select-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-emerald-500/30 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Monitoring</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
          <Database size={12} className="text-purple-400" />
          <span>Enterprise Mock Dataset</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-400">
          <Clock size={12} />
          <span>Just now</span>
        </span>
      </div>
    </div>
  )
}

export default AnalyticsHeader
