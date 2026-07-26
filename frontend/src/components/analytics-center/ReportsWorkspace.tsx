import React from 'react'
import type {
  ReportTemplateItem,
  SavedReportItem,
  ExportOptionItem,
} from '@/data/analyticsReportsMockData'
import { ReportsDashboard } from './ReportsDashboard'
import { ReportTemplateCard } from './ReportTemplateCard'
import { SavedReportsTable } from './SavedReportsTable'
import { ScheduledReportsPanel } from './ScheduledReportsPanel'
import { ExportCenter } from './ExportCenter'
import { ReportHistoryTimeline } from './ReportHistoryTimeline'
import { DataSourcesSummary } from './DataSourcesSummary'
import { ReportsSkeleton } from './ReportsSkeleton'
import { EmptyReportsState } from './EmptyReportsState'
import { Sparkles } from 'lucide-react'
import { useReportsWorkspace } from '@/services/analytics/analyticsQueries'

interface ReportsWorkspaceProps {
  onGenerateTemplate?: (template: ReportTemplateItem) => void
  onDownloadReport?: (report: SavedReportItem) => void
  onExportFormat?: (option: ExportOptionItem) => void
  className?: string
}

export function ReportsWorkspace({
  onGenerateTemplate,
  onDownloadReport,
  onExportFormat,
  className = '',
}: ReportsWorkspaceProps) {
  const { data, isLoading, isError, refetch } = useReportsWorkspace()

  if (isLoading) {
    return <ReportsSkeleton />
  }

  if (isError || !data) {
    return <EmptyReportsState onReset={refetch} />
  }

  return (
    <div className={`space-y-6 lg:space-y-8 ${className}`}>
      {/* 1. Reports Executive KPI Overview */}
      <ReportsDashboard overview={data.overview} />

      {/* 2. Report Templates Gallery */}
      <div className="space-y-4 text-left">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            Executive Report Templates
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
            Pre-configured report formats optimized for executive digests and technical audits
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {data.templates.map((tmpl) => (
            <ReportTemplateCard key={tmpl.id} template={tmpl} onGenerate={onGenerateTemplate} />
          ))}
        </div>
      </div>

      {/* 3. Export Center (5 Formats Hub) */}
      <ExportCenter options={data.exportOptions} onExportFormat={onExportFormat} />

      {/* 4. Saved Reports Data Table */}
      <SavedReportsTable reports={data.savedReports} onDownload={onDownloadReport} />

      {/* 5. Scheduled Reports & Audit Feed (2-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        <ScheduledReportsPanel scheduledReports={data.scheduledReports} />
        <ReportHistoryTimeline history={data.history} />
      </div>

      {/* 6. Connected Data Sources Summary */}
      <DataSourcesSummary dataSources={data.dataSources} />
    </div>
  )
}

export default ReportsWorkspace
