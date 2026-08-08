import React from 'react'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import {
  mockOperationalServices,
  mockResourceMetrics,
} from '@/data/insightsSystemHealthMockData'
import { ShieldCheck, Cpu, HardDrive, Zap, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SystemHealthPanelProps {
  className?: string
}

export function SystemHealthPanel({ className }: SystemHealthPanelProps) {
  const { services: queryServices, resources: queryResources } = useSystemHealth()

  const services = queryServices && queryServices.length > 0 ? queryServices : mockOperationalServices
  const resources = queryResources || mockResourceMetrics

  return (
    <div className={cn('space-y-4 text-left font-sans', className)}>
      {/* 1. Overall Health Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#111322] border border-emerald-500/30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
              Core Agent Services
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              Operating at optimal threshold
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 select-none pl-2">
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {resources.overallHealth}%
          </span>
          <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
            Health Index
          </span>
        </div>
      </div>

      {/* 2. Service Status Grid */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Enterprise Services ({services.length})
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-2.5 sm:p-3 rounded-xl bg-[#111322] border border-white/10 space-y-2 shadow-md hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {srv.status === 'operational' && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
                  {srv.status === 'degraded' && <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />}
                  {srv.status === 'error' && <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0" />}
                  <span className="font-bold text-white text-xs truncate">{srv.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold shrink-0">
                  {srv.uptimePercentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1.5 border-t border-white/5">
                <span>Latency: <strong className="text-purple-300">{srv.latencyMs}ms</strong></span>
                <span>Status: <strong className="text-emerald-400 capitalize">{srv.status}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hardware Resource Gauges */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Resource Utilization Metrics
        </h4>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* CPU Load */}
          <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Cpu size={13} className="text-purple-400" /> CPU
              </span>
              <span className="font-mono text-[11px] font-bold text-white">{resources.cpuUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${resources.cpuUsage}%` }} />
            </div>
          </div>

          {/* Memory Usage */}
          <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <HardDrive size={13} className="text-blue-400" /> RAM
              </span>
              <span className="font-mono text-[11px] font-bold text-white">{resources.memoryUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${resources.memoryUsage}%` }} />
            </div>
          </div>

          {/* Queue Utilization */}
          <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Zap size={13} className="text-amber-400" /> Queue
              </span>
              <span className="font-mono text-[11px] font-bold text-white">{resources.queueUtilization}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${resources.queueUtilization}%` }} />
            </div>
          </div>

          {/* Storage Utilization */}
          <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Layers size={13} className="text-emerald-400" /> Storage
              </span>
              <span className="font-mono text-[11px] font-bold text-white">{resources.storageUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${resources.storageUsage}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemHealthPanel
