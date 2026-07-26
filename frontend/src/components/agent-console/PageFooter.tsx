import React from 'react'
import { Bot, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PageFooterProps {
  className?: string
}

export function PageFooter({ className }: PageFooterProps) {
  return (
    <footer className={cn('pt-4 border-t border-white/5 text-xs text-slate-400 font-sans', className)}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Bot size={15} className="text-purple-400" />
          <span className="font-semibold text-slate-300">Scorelia V3 — Agent Console</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">Autonomous Career Intelligence Engine</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Shield size={13} className="text-emerald-400" />
            <span>WCAG 2.2 AA Certified</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>Phase 1 Production Edition</span>
        </div>
      </div>
    </footer>
  )
}

export default PageFooter
