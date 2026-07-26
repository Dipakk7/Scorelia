import React, { useState } from 'react'
import { TrendingUp, Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface PerformanceHeaderProps {
  overallScore?: number
}

export function PerformanceHeader({ overallScore = 87 }: PerformanceHeaderProps) {
  const [dateRange, setDateRange] = useState<string>('30d')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10121e]/90 border border-white/10 p-5 rounded-2xl hover:border-purple-500/30 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Performance & Interview Analytics
          </h2>
          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs font-bold font-mono px-2.5 py-0.5">
            {overallScore}% Readiness
          </Badge>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Comprehensive score trajectories, skill proficiency diagnostics, strength/weakness evaluations, and milestone achievements.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-[#141627] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200">
          <Calendar className="h-3.5 w-3.5 text-purple-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="7d" className="bg-[#141627] text-white">Last 7 Days</option>
            <option value="30d" className="bg-[#141627] text-white">Last 30 Days</option>
            <option value="90d" className="bg-[#141627] text-white">Last 90 Days</option>
            <option value="all" className="bg-[#141627] text-white">All Time</option>
          </select>
        </div>

        {/* Export Analytics Placeholder */}
        <Button
          disabled
          className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed opacity-60 flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  )
}
export default PerformanceHeader
