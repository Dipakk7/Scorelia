import React from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyInsightsStateProps {
  onRefresh?: () => void
  className?: string
}

export function EmptyInsightsState({ onRefresh, className }: EmptyInsightsStateProps) {
  return (
    <div
      className={cn(
        'p-12 rounded-2xl bg-[#111322] border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl select-none',
        className
      )}
    >
      <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <Sparkles size={36} className="animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-white tracking-tight">No insights available</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          All system recommendations have been addressed. Adjust your filter settings or refresh insights telemetry.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
        >
          <RefreshCw size={14} />
          <span>Refresh Insights</span>
        </button>
      </div>
    </div>
  )
}

export default EmptyInsightsState
