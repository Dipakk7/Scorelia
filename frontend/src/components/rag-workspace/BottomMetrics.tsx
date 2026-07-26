import React from 'react'
import {
  HardDrive,
  Database,
  Zap,
  Clock,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BottomMetricsProps {
  className?: string
}

export function BottomMetrics({ className }: BottomMetricsProps) {
  const metrics = [
    {
      title: 'Data Sources',
      value: '7',
      subtext: 'Active',
      icon: Database,
      iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Storage Used',
      value: '1.2 GB',
      subtext: '/ 10 GB',
      icon: HardDrive,
      iconColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      title: 'API Calls (Today)',
      value: '342',
      trend: '↑ 12%',
      trendType: 'up' as const,
      subtext: 'vs yesterday',
      icon: Zap,
      iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      title: 'Avg. Response Time',
      value: '1.24s',
      trend: '↓ 9%',
      trendType: 'up' as const, // faster response time is good
      subtext: 'vs yesterday',
      icon: Clock,
      iconColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      title: 'Auto-backup',
      value: 'Enabled ✓',
      subtext: 'Last backup: 2h ago',
      icon: ShieldCheck,
      iconColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    }
  ]

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4', className)}>
      {metrics.map((m, i) => {
        const Icon = m.icon
        return (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-md text-left flex flex-col justify-between"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className={cn('p-2 rounded-xl border flex items-center justify-center shrink-0', m.iconColor)}>
                <Icon size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-400 truncate">{m.title}</span>
            </div>

            <div className="flex items-baseline justify-between gap-1 mt-auto">
              <div className="text-lg font-extrabold text-white font-mono">
                {m.value}
              </div>
              {m.trend && (
                <span className="text-[10px] font-bold text-emerald-400 font-mono">
                  {m.trend}
                </span>
              )}
              {m.subtext && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {m.subtext}
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* 6. System Diagnostics Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 shadow-md text-left flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
            <Activity size={16} />
          </div>
          <span className="text-xs font-bold text-white">System Diagnostics</span>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-between text-xs font-bold text-purple-300 hover:text-white bg-purple-600/30 hover:bg-purple-600/50 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-all cursor-pointer"
        >
          <span>Run full check</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default BottomMetrics
