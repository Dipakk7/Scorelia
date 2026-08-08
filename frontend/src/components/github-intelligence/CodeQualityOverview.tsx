import React from 'react'
import { ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, Lock, FileText, Bug } from 'lucide-react'
import { githubDeveloperMetricsMockData, type CodeQualityMetrics } from '@/data/githubDeveloperMetricsMockData'
import { QualityScoreBadge } from './QualityScoreBadge'
import { cn } from '@/lib/utils'

export interface CodeQualityOverviewProps {
  metrics?: CodeQualityMetrics
  onViewDetails?: () => void
  className?: string
}

export const CodeQualityOverview: React.FC<CodeQualityOverviewProps> = ({
  metrics = githubDeveloperMetricsMockData.codeQuality,
  onViewDetails,
  className,
}) => {
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
            <ShieldCheck size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-white m-0">Code Quality Overview</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Overall code quality & security audit metrics</p>
        </div>
        <QualityScoreBadge score={`${metrics.overallScore}%`} level={metrics.healthGrade} />
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 text-center">
          <div className="text-[10px] text-slate-400 font-medium font-sans">Test Coverage</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">{metrics.testCoverage}%</div>
          <div className="text-[9px] text-emerald-400 font-semibold mt-0.5 font-mono">↑ 8% this month</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 text-center">
          <div className="text-[10px] text-slate-400 font-medium font-sans">Code Smells</div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">{metrics.technicalDebt}</div>
          <div className="text-[9px] text-emerald-400 font-semibold mt-0.5 font-mono">↓ 12 resolved</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 text-center">
          <div className="text-[10px] text-slate-400 font-medium font-sans">Maintainability</div>
          <div className="text-xl font-extrabold text-sky-400 mt-1 font-mono">{metrics.maintainability}</div>
          <div className="text-[9px] text-emerald-400 font-semibold mt-0.5 font-mono">Grade A</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 text-center">
          <div className="text-[10px] text-slate-400 font-medium font-sans">Security Score</div>
          <div className="text-xl font-extrabold text-purple-400 mt-1 font-mono">{metrics.securityScore}%</div>
          <div className="text-[9px] text-emerald-400 font-semibold mt-0.5 font-mono">↑ 5% compliant</div>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="space-y-2.5 py-1 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-white">Reliability Index</span>
            <span className="text-emerald-400 font-mono">{metrics.reliability}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full rounded-full bg-emerald-400 w-[94%]" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-white">Lint & Styling Standard</span>
            <span className="text-sky-400 font-mono">{metrics.lintScore}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full rounded-full bg-sky-400 w-[96%]" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-white">Documentation Coverage</span>
            <span className="text-purple-400 font-mono">{metrics.documentationScore}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full rounded-full bg-purple-400 w-[82%]" />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 text-center">
        <button
          type="button"
          onClick={onViewDetails}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-md px-2 py-1"
        >
          <span>View detailed code quality report</span> <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default CodeQualityOverview
