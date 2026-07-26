import React from 'react'
import { Sparkles, Server, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InsightsHeaderProps {
  className?: string
}

export function InsightsHeader({ className }: InsightsHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Insights & System Health</span>
          <span className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles size={16} />
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Monitor recommendations, operational health, and recent activity across all AI agents.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs font-semibold select-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-purple-500/30 text-purple-300">
          <Sparkles size={12} className="text-purple-400" />
          <span>AI Recommendations</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
          <Server size={12} className="text-blue-400" />
          <span>Mock Telemetry</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-400">
          <Clock size={12} />
          <span>Just now</span>
        </span>
      </div>
    </div>
  )
}

export default InsightsHeader
