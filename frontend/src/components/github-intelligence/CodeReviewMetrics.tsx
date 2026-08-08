import React from 'react'
import { Eye, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react'
import { githubDeveloperMetricsMockData, type CodeReviewMetricsData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface CodeReviewMetricsProps {
  metrics?: CodeReviewMetricsData
  className?: string
}

export const CodeReviewMetrics: React.FC<CodeReviewMetricsProps> = ({
  metrics = githubDeveloperMetricsMockData.codeReviews,
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
            <Eye size={16} className="text-indigo-400" />
            <h3 className="font-bold text-sm text-white m-0">Code Review Metrics</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Peer review activity & responsiveness</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Score: {metrics.reviewQualityScore}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Reviews Completed</div>
          <div className="text-lg font-extrabold text-white mt-1 font-mono">{metrics.reviewsCompleted}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Approvals</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1 font-mono">{metrics.approvals}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Change Requests</div>
          <div className="text-lg font-extrabold text-amber-400 mt-1 font-mono">{metrics.changeRequests}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80">
          <div className="text-[10px] text-slate-400 font-sans">Response Time</div>
          <div className="text-lg font-extrabold text-sky-400 mt-1 font-mono">{metrics.responseTime}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/60 flex items-center justify-between text-xs font-sans">
        <span className="text-slate-400 flex items-center gap-1.5">
          <MessageSquare size={13} className="text-indigo-400" /> Review Comments Given
        </span>
        <span className="font-bold text-white font-mono">{metrics.comments} comments</span>
      </div>
    </div>
  )
}

export default CodeReviewMetrics
