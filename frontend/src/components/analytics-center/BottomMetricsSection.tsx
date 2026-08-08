import React from 'react'
import {
  Database,
  FileSpreadsheet,
  HardDrive,
  AlertTriangle,
  Target,
  Clock,
  CheckCircle2,
} from 'lucide-react'

interface BottomMetricItem {
  id: string
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  iconBg: string
  isStatusConnected?: boolean
}

const bottomMetrics: BottomMetricItem[] = [
  {
    id: 'sources',
    title: 'Data Sources',
    value: '12',
    subtitle: 'Connected',
    icon: Database,
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    isStatusConnected: true,
  },
  {
    id: 'reports',
    title: 'Reports Generated',
    value: '28',
    subtitle: '↑ 30% vs last 30 days',
    icon: FileSpreadsheet,
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'volume',
    title: 'Data Volume',
    value: '2.48 GB',
    subtitle: '↑ 15% vs last 30 days',
    icon: HardDrive,
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'alerts',
    title: 'Alerts Triggered',
    value: '3',
    subtitle: '↓ 25% vs last 30 days',
    icon: AlertTriangle,
    iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
  {
    id: 'accuracy',
    title: 'Forecast Accuracy',
    value: '91.2%',
    subtitle: '↑ 4.3% vs last 30 days',
    icon: Target,
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'sync',
    title: 'Last Data Sync',
    value: '2 min ago',
    subtitle: 'All data is up to date',
    icon: Clock,
    iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    isStatusConnected: true,
  },
]

export function BottomMetricsSection({ className = '' }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4 ${className}`}
      role="region"
      aria-label="Platform Operational Metrics"
    >
      {bottomMetrics.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.id}
            tabIndex={0}
            className="flex items-center gap-3.5 h-full p-3.5 sm:p-4 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/40 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          >
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}
            >
              <Icon size={18} className="stroke-[2]" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 truncate">
                {item.title}
              </span>
              <span className="text-lg font-extrabold text-slate-100 font-mono tracking-tight leading-tight my-0.5">
                {item.value}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 truncate">
                {item.isStatusConnected && (
                  <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                )}
                <span>{item.subtitle}</span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BottomMetricsSection
