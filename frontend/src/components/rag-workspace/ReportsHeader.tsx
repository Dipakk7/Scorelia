import React from 'react'
import { FileSpreadsheet, Download, Clock, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReportsHeaderProps {
  onOpenShareModal?: () => void
  lastExport?: string
  scheduledCount?: number
  className?: string
}

export function ReportsHeader({
  onOpenShareModal,
  lastExport = 'Today, 10:24 AM',
  scheduledCount = 4,
  className
}: ReportsHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <FileSpreadsheet className="w-5 h-5 text-purple-400 shrink-0" />
          Reports & Export Management
        </h2>
        <p className="text-xs text-slate-400">
          Generate reports, export workspace data, review audit history, and share workspaces.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
          <Clock size={13} className="shrink-0" />
          <span>Last Export: {lastExport}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
          <Download size={13} className="shrink-0" />
          <span>{scheduledCount} Scheduled</span>
        </div>

        {onOpenShareModal && (
          <button
            type="button"
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer min-h-[44px]"
          >
            <Share2 size={13} />
            <span>Share Workspace</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ReportsHeader
