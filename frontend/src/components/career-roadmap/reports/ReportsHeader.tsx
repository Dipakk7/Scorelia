import React from 'react'
import { FileText, RefreshCw, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface ReportsHeaderProps {
  lastGenerated?: string
  overallCompletion?: number
  onRefresh?: () => void
  onExport?: () => void
  onShare?: () => void
  className?: string
}

export function ReportsHeader({
  lastGenerated = 'Today, 03:30 PM',
  overallCompletion = 78,
  onRefresh,
  onExport,
  onShare,
  className,
}: ReportsHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl shadow-sm text-left', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight m-0 flex items-center gap-2">
            <span>Career Roadmap Progress &amp; Intelligence Report</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {overallCompletion}% Complete
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium m-0 pl-9">
          Comprehensive candidate career roadmap audit, skills gap matrix &amp; AI readiness insights • Last generated {lastGenerated}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0 pl-9 md:pl-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white cursor-pointer"
          aria-label="Refresh Report"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white cursor-pointer"
          aria-label="Export Report Options"
        >
          <Download className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
          <span>Export</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onShare}
          className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer border-none shadow-md shadow-purple-950/40"
          aria-label="Share Report Dialog"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Share Report</span>
        </Button>
      </div>
    </div>
  )
}
export default ReportsHeader
