import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { ExportFormat } from '@/data/ragReportsMockData'
import { MOCK_REPORTS_OVERVIEW } from '@/data/ragReportsMockData'
import { useRAGReports } from '@/hooks/useRAGReports'
import { ReportsHeader } from './ReportsHeader'
import { ReportsOverview } from './ReportsOverview'
import { ExportCenter } from './ExportCenter'
import { ExportQueue } from './ExportQueue'
import { ExportHistory } from './ExportHistory'
import { BulkActionsPanel } from './BulkActionsPanel'
import { AuditLogs } from './AuditLogs'
import { PerformanceReports } from './PerformanceReports'
import { UsageReports } from './UsageReports'
import { WorkspaceSnapshots } from './WorkspaceSnapshots'
import { ShareWorkspaceDialog } from './ShareWorkspaceDialog'
import { cn } from '@/lib/utils'

export interface ReportsWorkspaceProps {
  className?: string
}

export function ReportsWorkspace({ className }: ReportsWorkspaceProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const {
    overview,
    exportJobs,
    auditLogs,
    snapshots,
    createExportJob,
    isExporting,
    createSnapshot,
    isSnapshotting,
    generateShareLink
  } = useRAGReports()

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedBulkCount, setSelectedBulkCount] = useState<number>(0)

  const handleGenerateExport = async (format: ExportFormat, targets: string[]) => {
    await createExportJob({ format, targets })
  }

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Reports & Export Workspace"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Header with Share Workspace Modal CTA */}
      <ReportsHeader onOpenShareModal={() => setIsShareModalOpen(true)} />

      {/* 2. Overview Metrics Grid (6 KPI Cards) */}
      <ReportsOverview kpi={overview || MOCK_REPORTS_OVERVIEW} />

      {/* 3. Export Center & Active Export Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <ExportCenter onGenerateExport={handleGenerateExport} isExporting={isExporting} />
        </div>
        <div className="lg:col-span-4">
          <ExportQueue jobs={exportJobs} />
        </div>
      </div>

      {/* 4. Export History Log Table */}
      <ExportHistory jobs={exportJobs} />

      {/* 5. Performance & Telemetry Reports */}
      <PerformanceReports />

      {/* 6. Storage Growth & API Usage Reports */}
      <UsageReports />

      {/* 7. Workspace Snapshots & Restore Points */}
      <WorkspaceSnapshots
        snapshots={snapshots}
        onCreateSnapshot={(name, description) => createSnapshot({ name, description })}
        isSnapshotting={isSnapshotting}
      />

      {/* 8. Compliance Audit Log Table */}
      <AuditLogs logs={auditLogs} />

      {/* Share Workspace Modal */}
      <ShareWorkspaceDialog
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onGenerateLink={(permission, expiresInDays) => generateShareLink({ permission, expiresInDays })}
      />
    </motion.div>
  )
}

export default ReportsWorkspace
