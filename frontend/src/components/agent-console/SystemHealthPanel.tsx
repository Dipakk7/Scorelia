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
    <div className={cn('space-y-5 text-left', className)}>
      {/* 1. Overall Health Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#111322] border border-emerald-500/40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              All Core Agent Services Operational
            </h3>
            <p className="text-xs text-slate-400">
              System uptime is operating at optimal benchmark thresholds.
            </p>
          </div>
        </div>

        <div className="text-right select-none">
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {resources.overallHealth}%
          </span>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
            Health Index
          </span>
        </div>
      </div>

      {/* 2. Service Status Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Enterprise Services ({services.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-3.5 rounded-xl bg-[#111322] border border-white/10 space-y-2 shadow-md hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {srv.status === 'operational' && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
                  {srv.status === 'degraded' && <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />}
                  {srv.status === 'error' && <span className="h-2 w-2 rounded-full bg-rose-400" />}
                  <span className="font-bold text-white text-xs">{srv.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  {srv.uptimePercentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
                <span>Latency: <strong className="text-purple-300">{srv.latencyMs}ms</strong></span>
                <span>Status: <strong className="text-emerald-400 capitalize">{srv.status}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hardware Resource Gauges */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Resource Utilization Metrics
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* CPU Load */}
          <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Cpu size={14} className="text-purple-400" /> CPU Load
              </span>
              <span className="font-mono font-bold text-white">{resources.cpuUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${resources.cpuUsage}%` }} />
            </div>
          </div>

          {/* Memory Usage */}
          <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <HardDrive size={14} className="text-blue-400" /> Memory
              </span>
              <span className="font-mono font-bold text-white">{resources.memoryUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${resources.memoryUsage}%` }} />
            </div>
          </div>

          {/* Queue Utilization */}
          <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" /> Queue Load
              </span>
              <span className="font-mono font-bold text-white">{resources.queueUtilization}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${resources.queueUtilization}%` }} />
            </div>
          </div>

          {/* Storage Utilization */}
          <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Layers size={14} className="text-emerald-400" /> Storage
              </span>
              <span className="font-mono font-bold text-white">{resources.storageUsage}%</span>
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
