import React from 'react'
import { FileText, Calendar, CheckCircle, HardDrive, Clock, Target } from 'lucide-react'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'
import type { ReportOverviewKPIData } from '@/data/analyticsReportsMockData'

interface ReportsDashboardProps {
  overview?: ReportOverviewKPIData[]
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Calendar,
  CheckCircle,
  HardDrive,
  Clock,
  Target,
}

export function ReportsDashboard({
  overview = analyticsReportsMockData.overview,
  className = '',
}: ReportsDashboardProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 ${className}`}
      role="region"
      aria-label="Reports Overview Metrics"
    >
      {overview.map((kpi) => {
        const IconComponent = iconMap[kpi.iconName] || FileText
        return (
          <div
            key={kpi.id}
            tabIndex={0}
            className="flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-left space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border shrink-0 ${kpi.iconBg}`}>
                <IconComponent size={16} className="stroke-[2]" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold text-slate-400 truncate">{kpi.title}</span>
            </div>

            <div>
              <span className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight block">
                {kpi.value}
              </span>
              <span className="text-[10px] font-medium text-slate-500 block mt-0.5 font-mono">
                {kpi.subtitle}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ReportsDashboard
