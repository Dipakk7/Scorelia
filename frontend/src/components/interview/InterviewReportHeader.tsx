import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FileText, Download, Printer, Sparkles, Building2, Briefcase, Calendar } from 'lucide-react'
import type { AdaptedInterviewSession } from '@/lib/interview-adapter'

export interface InterviewReportHeaderProps {
  session?: AdaptedInterviewSession | null
  onOpenExportModal?: () => void
}

export const InterviewReportHeader: React.FC<InterviewReportHeaderProps> = ({
  session,
  onOpenExportModal,
}) => {
  const company = session?.companyName || 'Target Company'
  const role = session?.targetRole || 'Senior Full Stack Engineer'
  const type = session?.interviewType || 'TECHNICAL'
  const createdDate = session?.createdAt ? new Date(session.createdAt).toLocaleDateString() : new Date().toLocaleDateString()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Metadata Badges */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--heading)] md:text-2xl">
                Interview Session Report
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Official transcript & analysis record for candidate practice.
              </p>
            </div>
            <Badge variant="success" className="px-3 py-1 text-xs font-semibold">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Verified Report
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)] pt-1">
            <span className="flex items-center gap-1.5 font-medium text-[var(--heading)]">
              <Briefcase className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              {role}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              {company}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              {createdDate}
            </span>
            <span>•</span>
            <Badge variant="neutral" className="px-2 py-0.5 text-[10px] font-semibold">
              {type}
            </Badge>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="h-10 min-h-[44px] gap-2 px-4 text-xs font-semibold cursor-pointer"
            aria-label="Print Interview Report"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Print Report</span>
          </Button>

          <Button
            variant="primary"
            onClick={onOpenExportModal}
            className="h-10 min-h-[44px] gap-2 px-5 text-xs font-semibold cursor-pointer shadow-md"
            aria-label="Export Interview Report"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewReportHeader
