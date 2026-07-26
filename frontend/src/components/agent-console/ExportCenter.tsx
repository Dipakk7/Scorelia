import React from 'react'
import { useReports } from '@/hooks/useReports'
import { Download, FileText, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ExportCenterProps {
  className?: string
}

export function ExportCenter({ className }: ExportCenterProps) {
  const { exportJobs } = useReports()

  const handleDownload = (fileName: string, format: string) => {
    const dummyContent = `data:text/plain;charset=utf-8,Scorelia Export File: ${fileName}\nFormat: ${format}\nGenerated At: ${new Date().toISOString()}`
    const encodedUri = encodeURI(dummyContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4 text-left', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Download size={16} className="text-purple-400" />
          <span>Export Center & Downloads</span>
        </h3>
        <span className="text-xs font-mono font-semibold text-slate-400">{exportJobs.length} Recent Exports</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {exportJobs.map((job) => (
          <div
            key={job.id}
            className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 truncate">
                <div className="p-2 rounded-lg bg-white/5 text-purple-300 shrink-0">
                  <FileText size={15} />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-white text-xs truncate">{job.fileName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{job.size} • {job.createdTime}</span>
                </div>
              </div>

              <div>
                {job.status === 'Ready' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                    Ready
                  </span>
                )}
                {job.status === 'Processing' && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                    Processing
                  </span>
                )}
                {job.status === 'Expired' && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    Expired
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{job.format} Format</span>
              <button
                type="button"
                disabled={job.status === 'Expired'}
                onClick={() => handleDownload(job.fileName, job.format)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  job.status === 'Ready'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                )}
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExportCenter
