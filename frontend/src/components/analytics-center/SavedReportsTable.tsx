import React, { useState } from 'react'
import { Search, Download, Trash2, Eye, FileSpreadsheet, FileText, Table, Code, Presentation } from 'lucide-react'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'
import type { SavedReportItem, ExportFormatType } from '@/data/analyticsReportsMockData'
import { ReportStatusBadge } from './ReportStatusBadge'

interface SavedReportsTableProps {
  reports?: SavedReportItem[]
  onDownload?: (report: SavedReportItem) => void
  onDelete?: (report: SavedReportItem) => void
  className?: string
}

const formatIconMap: Record<ExportFormatType, React.ElementType> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  CSV: Table,
  JSON: Code,
  PowerPoint: Presentation,
}

export function SavedReportsTable({
  reports = analyticsReportsMockData.savedReports,
  onDownload,
  onDelete,
  className = '',
}: SavedReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReports = reports.filter(
    (rep) =>
      rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`space-y-4 text-left ${className}`}>
      {/* Table Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
            Saved Reports & Intelligence Files
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
            Pre-compiled reports ready for review and download
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports or owner..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#121320] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-white/10 bg-[#0f101c]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#121320] text-slate-400 font-mono font-semibold uppercase text-[10px]">
              <th className="p-3.5 pl-4">Report Name</th>
              <th className="p-3.5">Format</th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5">Created</th>
              <th className="p-3.5">Size</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {filteredReports.map((report) => {
              const FormatIcon = formatIconMap[report.format] || FileText
              return (
                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 pl-4 font-bold text-slate-100">
                    <div className="flex items-center gap-2">
                      <FormatIcon size={15} className="text-purple-400 shrink-0" />
                      <span className="truncate max-w-[240px]">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] font-semibold text-purple-300">
                    {report.format}
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{report.owner}</td>
                  <td className="p-3.5 font-mono text-slate-400">{report.createdAt}</td>
                  <td className="p-3.5 font-mono text-slate-300">{report.size}</td>
                  <td className="p-3.5">
                    <ReportStatusBadge status={report.status} />
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onDownload?.(report)}
                        className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors cursor-pointer"
                        title="Download Report"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(report)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SavedReportsTable
