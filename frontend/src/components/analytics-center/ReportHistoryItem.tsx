import React from 'react'
import { FileText, FileSpreadsheet, Table, Code, Presentation, Clock } from 'lucide-react'
import type { ReportHistoryItemData, ExportFormatType } from '@/data/analyticsReportsMockData'
import { ReportStatusBadge } from './ReportStatusBadge'

interface ReportHistoryItemProps {
  item: ReportHistoryItemData
  className?: string
}

const formatIconMap: Record<ExportFormatType, React.ElementType> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  CSV: Table,
  JSON: Code,
  PowerPoint: Presentation,
}

export function ReportHistoryItem({ item, className = '' }: ReportHistoryItemProps) {
  const IconComponent = formatIconMap[item.format] || FileText

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Report ${item.name}: ${item.status}`}
      className={`group relative flex items-center justify-between p-3 rounded-xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
          <IconComponent size={15} className="stroke-[2]" />
        </div>

        <div className="min-w-0 text-left space-y-0.5">
          <span className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors block truncate">
            {item.name}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>By: <strong className="text-slate-300">{item.initiatedBy}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={10} className="text-slate-500 shrink-0" />
              Duration: {item.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="text-[10px] font-mono text-slate-400">{item.generatedAt}</span>
        <ReportStatusBadge status={item.status} />
      </div>
    </div>
  )
}

export default ReportHistoryItem
