import React from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyAuditStateProps {
  onResetFilters?: () => void
  className?: string
}

export function EmptyAuditState({ onResetFilters, className }: EmptyAuditStateProps) {
  return (
    <div
      className={cn(
        'p-12 rounded-2xl bg-[#111322] border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl select-none',
        className
      )}
    >
      <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <FileText size={36} className="animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-white tracking-tight">No audit logs found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          No audit log entries match your current search query or filter parameters. Reset your filters to view full security audit history.
        </p>
      </div>

      {onResetFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <RefreshCw size={14} />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default EmptyAuditState
