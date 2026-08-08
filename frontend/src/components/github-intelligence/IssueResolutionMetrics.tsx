import React from 'react'
import { AlertCircle, CheckCircle2, Clock, RotateCcw } from 'lucide-react'
import { githubDeveloperMetricsMockData, type IssueResolutionData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface IssueResolutionMetricsProps {
  metrics?: IssueResolutionData
  className?: string
}

export const IssueResolutionMetrics: React.FC<IssueResolutionMetricsProps> = ({
  metrics = githubDeveloperMetricsMockData.issueResolution,
  className,
}) => {
  const safeMetrics = metrics ?? githubDeveloperMetricsMockData.issueResolution
  const resolutionRate = safeMetrics?.resolutionRate ?? 100
  const opened = safeMetrics?.opened ?? 0
  const closed = safeMetrics?.closed ?? (safeMetrics as any)?.issuesResolved ?? 0
  const averageResolutionTime = safeMetrics?.averageResolutionTime ?? ((safeMetrics as any)?.averageResolutionDays ? `${(safeMetrics as any).averageResolutionDays} days` : '0 days')
  const reopened = safeMetrics?.reopened ?? 0

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-400" />
            <h3 className="font-bold text-sm text-white m-0">Issue Resolution Metrics</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Bug triage & resolution efficiency</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {resolutionRate}% Closed Rate
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Opened Issues</div>
          <div className="text-lg font-extrabold text-white mt-1 font-mono">{opened}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Closed Issues</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1 font-mono">{closed}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Avg Resolution Time</div>
          <div className="text-lg font-extrabold text-sky-400 mt-1 font-mono">{averageResolutionTime}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Reopened</div>
          <div className="text-lg font-extrabold text-amber-400 mt-1 font-mono">{reopened}</div>
        </div>
      </div>

      <div className="space-y-1.5 p-3 rounded-xl border border-slate-700/80 bg-slate-900/60 font-sans">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-white">Triage Efficiency</span>
          <span className="text-emerald-400 font-bold font-mono">{resolutionRate}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${resolutionRate}%` }} />
        </div>
      </div>
    </div>
  )
}

export default IssueResolutionMetrics
