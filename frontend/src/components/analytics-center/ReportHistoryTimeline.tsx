import React from 'react'
import { History } from 'lucide-react'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'
import type { ReportHistoryItemData } from '@/data/analyticsReportsMockData'
import { ReportHistoryItem } from './ReportHistoryItem'

interface ReportHistoryTimelineProps {
  history?: ReportHistoryItemData[]
  className?: string
}

export function ReportHistoryTimeline({
  history = analyticsReportsMockData.history,
  className = '',
}: ReportHistoryTimelineProps) {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight flex items-center gap-2">
          <History size={16} className="text-purple-400" />
          Report Generation & Audit Log
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Recent automated and user-triggered report execution history
        </p>
      </div>

      <div className="relative pl-3 space-y-2.5 border-l-2 border-white/10">
        {history.map((item) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[19px] top-4 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-[#0b0c14]" />
            <ReportHistoryItem item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportHistoryTimeline
