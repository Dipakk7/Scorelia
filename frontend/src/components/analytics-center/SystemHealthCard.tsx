import React from 'react'
import { Server, Shield, Database, HardDrive, Layers, Bot, Activity } from 'lucide-react'
import type { SystemHealthServiceItem } from '@/data/analyticsPerformanceMockData'
import { PerformanceStatusBadge } from './PerformanceStatusBadge'

interface SystemHealthCardProps {
  service: SystemHealthServiceItem
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  Server,
  Shield,
  Database,
  HardDrive,
  Layers,
  Bot,
}

export function SystemHealthCard({ service, className = '' }: SystemHealthCardProps) {
  const IconComponent = iconMap[service.iconName] || Activity

  return (
    <div
      tabIndex={0}
      className={`flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 text-left ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <IconComponent size={16} className="stroke-[2]" />
          </div>
          <span className="text-xs font-bold text-slate-100 truncate">{service.name}</span>
        </div>
        <PerformanceStatusBadge status={service.status} />
      </div>

      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/5 text-xs">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 block">Latency / Metric</span>
          <span className="text-sm font-extrabold text-slate-100 font-mono">{service.value}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block">SLA Threshold</span>
          <span className="text-xs font-mono font-bold text-slate-300">{service.threshold}</span>
        </div>
      </div>
    </div>
  )
}

export default SystemHealthCard
