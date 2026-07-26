import React from 'react'
import { BarChart2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyReportsStateProps {
  onGenerateReport?: () => void
  className?: string
}

export function EmptyReportsState({ onGenerateReport, className }: EmptyReportsStateProps) {
  return (
    <div
      className={cn(
        'p-12 rounded-2xl bg-[#111322] border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl select-none',
        className
      )}
    >
      <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
        <BarChart2 size={36} className="animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-white tracking-tight">No reports generated</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          No generated executive reports found in history. Select a report template below to generate a new operational summary export.
        </p>
      </div>

      {onGenerateReport && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Generate Report</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default EmptyReportsState
