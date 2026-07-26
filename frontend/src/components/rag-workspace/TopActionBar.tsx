import React from 'react'
import { Network, Plus, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface TopActionBarProps {
  className?: string
  onAddNewCollection?: () => void
  onOpenKnowledgeGraph?: () => void
}

export function TopActionBar({
  className,
  onAddNewCollection,
  onOpenKnowledgeGraph
}: TopActionBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* System Status Card */}
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#121320]/80 border border-white/10 text-slate-300 text-xs shadow-inner">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">System Status</span>
          <span className="text-xs font-semibold text-slate-200">All Systems Operational</span>
        </div>
      </div>

      {/* Knowledge Graph Button */}
      <button
        onClick={onOpenKnowledgeGraph}
        type="button"
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121320]/80 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
      >
        <Network size={15} className="text-purple-400" />
        <span>Knowledge Graph</span>
      </button>

      {/* Add New Collection Primary Action Button */}
      <button
        onClick={onAddNewCollection}
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/30 hover:shadow-purple-900/50 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
      >
        <Plus size={16} className="stroke-[2.5]" />
        <span>Add New Collection</span>
      </button>
    </div>
  )
}

export default TopActionBar
