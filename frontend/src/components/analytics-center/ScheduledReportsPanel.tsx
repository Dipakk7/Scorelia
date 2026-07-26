import React, { useState } from 'react'
import { Calendar, Clock, Mail, MessageSquare, Edit3, Trash2 } from 'lucide-react'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'
import type { ScheduledReportItem } from '@/data/analyticsReportsMockData'
import { ReportStatusBadge } from './ReportStatusBadge'

interface ScheduledReportsPanelProps {
  scheduledReports?: ScheduledReportItem[]
  onToggleScheduled?: (id: string, enabled: boolean) => void
  onEdit?: (report: ScheduledReportItem) => void
  onDelete?: (report: ScheduledReportItem) => void
  className?: string
}

export function ScheduledReportsPanel({
  scheduledReports = analyticsReportsMockData.scheduledReports,
  onToggleScheduled,
  onEdit,
  onDelete,
  className = '',
}: ScheduledReportsPanelProps) {
  const [reports, setReports] = useState(scheduledReports)

  const handleToggle = (id: string) => {
    setReports((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled, status: !item.enabled ? 'queued' : 'cancelled' } : item
      )
    )
    const target = reports.find((r) => r.id === id)
    if (target) {
      onToggleScheduled?.(id, !target.enabled)
    }
  }

  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          Scheduled Intelligence Deliveries
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Automated daily, weekly, and monthly analytics digest triggers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {reports.map((report) => (
          <div
            key={report.id}
            tabIndex={0}
            className="flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30 shrink-0">
                  {report.frequency}
                </span>
                <span className="text-xs font-bold text-slate-100 truncate">{report.name}</span>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle(report.id)}
                aria-label={`Toggle schedule for ${report.name}`}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  report.enabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    report.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-slate-500 shrink-0" />
                <span className="font-mono text-[11px]">Next: {report.nextRun}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {report.deliveryMethod.includes('Slack') ? (
                  <MessageSquare size={13} className="text-slate-500 shrink-0" />
                ) : (
                  <Mail size={13} className="text-slate-500 shrink-0" />
                )}
                <span className="truncate text-[11px]">{report.deliveryMethod}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-xs">
              <ReportStatusBadge status={report.status} />

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit?.(report)}
                  className="p-1 rounded-lg bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Edit Schedule"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(report)}
                  className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Delete Schedule"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduledReportsPanel
