import React from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface ReportFooterProps {
  className?: string
}

export function ReportFooter({ className }: ReportFooterProps) {
  return (
    <Card className={cn('p-4 bg-[#121320] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left shadow-sm select-none', className)}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Scorelia V3 Career Copilot Intelligence</span>
          <span className="text-[10px] text-slate-400 font-mono block">
            Report Engine v3.2.0 • Data Source: Live FastAPI Backend &amp; TanStack Query
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span>Confidential Candidate Report</span>
        </span>
        <span className="font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
          Certified
        </span>
      </div>
    </Card>
  )
}
export default ReportFooter
