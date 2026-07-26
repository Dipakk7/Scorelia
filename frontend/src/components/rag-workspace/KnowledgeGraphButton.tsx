import React from 'react'
import { Network } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KnowledgeGraphButtonProps {
  onClick?: () => void
  className?: string
}

export function KnowledgeGraphButton({ onClick, className }: KnowledgeGraphButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121320]/90 border border-white/10 hover:border-purple-500/30 hover:bg-purple-950/20 text-slate-200 hover:text-purple-300 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[44px]',
        className
      )}
      aria-label="Open Knowledge Graph visualization placeholder"
    >
      <Network size={15} className="text-purple-400 shrink-0" />
      <span>Knowledge Graph</span>
    </button>
  )
}

export default KnowledgeGraphButton
