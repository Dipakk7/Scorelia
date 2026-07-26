import React from 'react'
import { Download } from 'lucide-react'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'
import type { ExportOptionItem } from '@/data/analyticsReportsMockData'
import { ExportOptionCard } from './ExportOptionCard'

interface ExportCenterProps {
  options?: ExportOptionItem[]
  onExportFormat?: (option: ExportOptionItem) => void
  className?: string
}

export function ExportCenter({
  options = analyticsReportsMockData.exportOptions,
  onExportFormat,
  className = '',
}: ExportCenterProps) {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight flex items-center gap-2">
          <Download size={16} className="text-purple-400" />
          Export Center & Format Hub
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Generate instant data snapshots in 5 executive formats
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {options.map((option) => (
          <ExportOptionCard key={option.id} option={option} onExport={onExportFormat} />
        ))}
      </div>
    </div>
  )
}

export default ExportCenter
