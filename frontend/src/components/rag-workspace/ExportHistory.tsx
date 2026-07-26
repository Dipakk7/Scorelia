import React, { useState } from 'react'
import { Download, Trash2, Search, FileText, FileSpreadsheet, FileCode, Archive } from 'lucide-react'
import type { ExportJobItem } from '@/data/ragReportsMockData'
import { cn } from '@/lib/utils'

export interface ExportHistoryProps {
  jobs: ExportJobItem[]
  onDeleteJob?: (id: string) => void
  className?: string
}

export function ExportHistory({ jobs, onDeleteJob, className }: ExportHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const completedJobs = jobs.filter(
    (j) => j.status === 'completed' && j.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFormatIcon = (format: string) => {
    if (format === 'ZIP') return Archive
    if (format === 'CSV') return FileSpreadsheet
    if (format === 'JSON') return FileCode
    return FileText
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Export History
          </h3>
          <p className="text-xs text-slate-400">
            Download previously generated workspace exports and reports.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exports..."
            className="w-full bg-[#121320] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">File Name</th>
              <th className="py-2.5 px-3">Format</th>
              <th className="py-2.5 px-3">Targets</th>
              <th className="py-2.5 px-3">Size</th>
              <th className="py-2.5 px-3">Created By</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[12px]">
            {completedJobs.map((job) => {
              const FormatIcon = getFormatIcon(job.format)

              return (
                <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    <FormatIcon size={15} className="text-purple-400 shrink-0" />
                    <span className="truncate max-w-xs">{job.name}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[10px]">
                      {job.format}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-sans">
                    {job.targets.join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-200">{job.size}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{job.createdBy}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={job.downloadUrl || '#'}
                        download
                        className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all"
                        title="Download file"
                      >
                        <Download size={13} />
                      </a>
                      {onDeleteJob && (
                        <button
                          type="button"
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                          title="Delete export"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
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

export default ExportHistory
