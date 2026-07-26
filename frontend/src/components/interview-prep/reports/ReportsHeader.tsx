import React from 'react'
import { FileSpreadsheet, Download, Sparkles, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export interface ReportsHeaderProps {
  overallReadinessScore?: number
  onQuickExport?: () => void
}

export function ReportsHeader({
  overallReadinessScore = 87,
  onQuickExport,
}: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#121426] via-[#10121e] to-purple-950/40 border border-purple-500/30 text-left shadow-lg shadow-purple-950/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Interview Preparation Reports & Export
          </h2>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Readiness: {overallReadinessScore}/100</span>
          </Badge>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Comprehensive diagnostic audits, competency matrix reports, and multi-format exports for candidate evaluation.
        </p>
      </div>

      <Button
        onClick={onQuickExport}
        className="py-2.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 shrink-0 shadow-md shadow-purple-900/30"
      >
        <Download className="h-4 w-4" />
        <span>Quick Export PDF</span>
      </Button>
    </div>
  )
}
export default ReportsHeader
