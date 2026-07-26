import React from 'react'
import { FileText, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DocumentsHeaderProps {
  indexedCount?: number
  processingCount?: number
  failedCount?: number
  className?: string
}

export function DocumentsHeader({
  indexedCount = 14,
  processingCount = 1,
  failedCount = 1,
  className
}: DocumentsHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <FileText className="w-5 h-5 text-purple-400 shrink-0" />
          Documents Workspace
        </h2>
        <p className="text-xs text-slate-400">
          Manage and monitor indexed knowledge assets across collections.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
          <CheckCircle2 size={13} />
          <span>{indexedCount} Indexed</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
          <RefreshCw size={12} className="animate-spin shrink-0" />
          <span>{processingCount} Processing</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold">
          <AlertTriangle size={13} />
          <span>{failedCount} Failed</span>
        </div>
      </div>
    </div>
  )
}

export default DocumentsHeader
