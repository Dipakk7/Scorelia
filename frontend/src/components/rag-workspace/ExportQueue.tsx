import React from 'react'
import { Loader2, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react'
import type { ExportJobItem } from '@/data/ragReportsMockData'
import { cn } from '@/lib/utils'

export interface ExportQueueProps {
  jobs: ExportJobItem[]
  onCancelJob?: (id: string) => void
  className?: string
}

export function ExportQueue({ jobs, onCancelJob, className }: ExportQueueProps) {
  const activeJobs = jobs.filter((j) => j.status === 'running' || j.status === 'queued')

  if (activeJobs.length === 0) return null

  return (
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a]/90 border border-purple-500/30 shadow-lg text-left space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Loader2 size={14} className="text-purple-400 animate-spin" />
          Active Export Queue ({activeJobs.length})
        </h4>
      </div>

      <div className="space-y-2">
        {activeJobs.map((job) => (
          <div key={job.id} className="p-3 rounded-xl bg-[#121320] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="font-semibold text-white font-mono truncate max-w-xs">{job.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  {job.status}
                </span>
                {onCancelJob && (
                  <button
                    type="button"
                    onClick={() => onCancelJob(job.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{job.progress}% Completed</span>
              <span>ETA: {job.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExportQueue
