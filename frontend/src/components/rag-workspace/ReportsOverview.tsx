import React from 'react'
import { FileSpreadsheet, Download, Share2, Calendar, HardDrive, FileCheck } from 'lucide-react'
import type { ReportsOverviewKPI } from '@/data/ragReportsMockData'
import { KPICard } from './KPICard'
import { cn } from '@/lib/utils'

export interface ReportsOverviewProps {
  kpi: ReportsOverviewKPI
  className?: string
}

export function ReportsOverview({ kpi, className }: ReportsOverviewProps) {
  const cards = [
    {
      id: 'generated',
      title: 'Generated Reports',
      numericValue: kpi.generatedReports,
      trend: '↑ 12%',
      trendType: 'positive' as const,
      icon: FileSpreadsheet,
      iconBgColor: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400'
    },
    {
      id: 'exportJobs',
      title: 'Export Jobs',
      numericValue: kpi.exportJobs,
      badgeText: 'Active Queue',
      icon: FileCheck,
      iconBgColor: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'downloads',
      title: 'Total Downloads',
      numericValue: kpi.totalDownloads,
      trend: '↑ 24%',
      trendType: 'positive' as const,
      icon: Download,
      iconBgColor: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'scheduled',
      title: 'Scheduled Reports',
      numericValue: kpi.scheduledReports,
      badgeText: 'Automated',
      icon: Calendar,
      iconBgColor: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      id: 'shared',
      title: 'Shared Links',
      numericValue: kpi.sharedLinks,
      badgeText: 'Active Links',
      icon: Share2,
      iconBgColor: 'bg-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'storage',
      title: 'Storage Used',
      stringValue: `${kpi.storageUsedMB} MB`,
      subtext: '+12 MB this week',
      icon: HardDrive,
      iconBgColor: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-400'
    }
  ]

  return (
    <div
      aria-label="Reports Overview Metrics Grid"
      className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4', className)}
    >
      {cards.map((card) => (
        <KPICard key={card.id} {...card} />
      ))}
    </div>
  )
}

export default ReportsOverview
