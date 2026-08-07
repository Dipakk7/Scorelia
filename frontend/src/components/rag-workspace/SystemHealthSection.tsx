import React from 'react'
import {
  Activity,
  Cpu,
  HardDrive,
  Database,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Layers,
  Server
} from 'lucide-react'
import {
  MOCK_SYSTEM_SERVICES,
  MOCK_RESOURCE_USAGE,
  MOCK_EMBEDDING_STATS,
  MOCK_INDEX_HEALTH
} from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface SystemHealthSectionProps {
  className?: string
}

export function SystemHealthSection({ className }: SystemHealthSectionProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 select-none', className)}>
      {/* 1. Resource Usage & Embedding Stats (6 Columns on Desktop) */}
      <div className="lg:col-span-6 space-y-4 text-left">
        {/* Resource Usage Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-purple-400 shrink-0" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Infrastructure Resource Utilization
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              Optimal
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* CPU Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">CPU Usage</span>
                <span className="text-white font-bold">{MOCK_RESOURCE_USAGE.cpuPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${MOCK_RESOURCE_USAGE.cpuPercent}%` }} />
              </div>
            </div>

            {/* RAM Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Memory (RAM)</span>
                <span className="text-white font-bold">{MOCK_RESOURCE_USAGE.ramUsedGB} GB / {MOCK_RESOURCE_USAGE.ramTotalGB} GB</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(MOCK_RESOURCE_USAGE.ramUsedGB / MOCK_RESOURCE_USAGE.ramTotalGB) * 100}%` }}
                />
              </div>
            </div>

            {/* Disk Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Vector Storage (Disk)</span>
                <span className="text-white font-bold">{MOCK_RESOURCE_USAGE.diskUsedMB} MB / 10 GB</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(MOCK_RESOURCE_USAGE.diskUsedMB / MOCK_RESOURCE_USAGE.diskTotalMB) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Embedding Stats Card & Index Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Embedding Provider</span>
            <div className="font-mono text-xs font-bold text-purple-400 truncate">{MOCK_EMBEDDING_STATS.modelName}</div>
            <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
              <div className="flex justify-between"><span>Vectors:</span> <strong className="text-white">{MOCK_EMBEDDING_STATS.totalVectors.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>Dimensions:</span> <strong className="text-white">{MOCK_EMBEDDING_STATS.dimensions}d</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vector Indexes</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white font-mono">{MOCK_INDEX_HEALTH.totalIndexes}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                100% Synced
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono pt-1">
              HNSW Graph Index • Euclidean Distance
            </div>
          </div>
        </div>
      </div>

      {/* 2. Microservice Health Checklist (6 Columns on Desktop) */}
      <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-blue-400 shrink-0" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Microservices & Pipeline Health
            </h3>
          </div>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">
            5 Services Online
          </span>
        </div>

        <div className="space-y-2.5">
          {MOCK_SYSTEM_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">{srv.name}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{srv.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right font-mono text-[11px] shrink-0">
                <div>
                  <span className="text-[var(--muted)] block text-[10px]">Latency</span>
                  <span className="text-[var(--heading)] font-bold">{srv.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block text-[10px]">Uptime</span>
                  <span className="text-emerald-400 font-bold">{srv.uptime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemHealthSection

