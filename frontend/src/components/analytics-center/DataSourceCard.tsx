import React from 'react'
import { Database, Layers, Bot, Scan, FileText, Zap } from 'lucide-react'
import type { DataSourceItem } from '@/data/analyticsReportsMockData'
import { PerformanceStatusBadge } from './PerformanceStatusBadge'

interface DataSourceCardProps {
  source: DataSourceItem
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  Database,
  Layers,
  Bot,
  Scan,
  FileText,
  Zap,
}

export function DataSourceCard({ source, className = '' }: DataSourceCardProps) {
  const IconComponent = iconMap[source.iconName] || Database

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Data source ${source.name}: ${source.status}`}
      className={`flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-left space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <IconComponent size={16} className="stroke-[2]" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-slate-100 truncate">{source.name}</span>
        </div>
        <PerformanceStatusBadge status={source.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5 font-mono">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 block font-sans">Total Records</span>
          <span className="text-xs font-extrabold text-slate-100">{source.records}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block font-sans">Query Latency</span>
          <span className="text-xs font-extrabold text-purple-300">{source.latency}</span>
        </div>
      </div>

      {/* Health Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Health: {source.health}%</span>
          <span>Sync: {source.lastSync}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
            style={{ width: `${source.health}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default DataSourceCard
