import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PageFooterProps {
  className?: string
}

export function PageFooter({ className }: PageFooterProps) {
  return (
    <footer className={cn('pt-6 pb-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans', className)}>
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-purple-400" />
        <span className="font-semibold text-slate-300">Scorelia AI Career Intelligence</span>
        <span className="text-slate-500">— RAG Workspace V3 (Phase 1)</span>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
        <span>System Status: Healthy</span>
        <span>•</span>
        <span>Version 3.0.0</span>
      </div>
    </footer>
  )
}

export default PageFooter
