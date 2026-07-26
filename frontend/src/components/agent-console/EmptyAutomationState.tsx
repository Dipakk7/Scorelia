import React from 'react'
import { Workflow, Plus, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyAutomationStateProps {
  onResetFilters?: () => void
  onCreateAutomation?: () => void
  className?: string
}

export function EmptyAutomationState({
  onResetFilters,
  onCreateAutomation,
  className,
}: EmptyAutomationStateProps) {
  return (
    <div
      className={cn(
        'p-12 rounded-2xl bg-[#111322] border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl select-none',
        className
      )}
    >
      <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <Workflow size={36} className="animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-white tracking-tight">No automations found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          No automation workflows match your search query. Build a new automated workflow trigger to automate your agent operations.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
          >
            <RefreshCw size={14} />
            <span>Reset Filters</span>
          </button>
        )}

        {onCreateAutomation && (
          <button
            type="button"
            onClick={onCreateAutomation}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Create Automation</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyAutomationState
