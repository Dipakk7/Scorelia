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
        'flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/40 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 h-10 select-none shrink-0',
        className
      )}
      aria-label="Open Knowledge Graph visualization"
    >
      <Network size={15} className="text-purple-400 shrink-0" />
      <span>Knowledge Graph</span>
    </button>
  )
}

export default KnowledgeGraphButton

