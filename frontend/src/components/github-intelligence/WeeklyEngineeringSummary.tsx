import React from 'react'
import { Calendar, CheckCircle2, Star, GitCommit, GitPullRequest, Eye, FolderGit2 } from 'lucide-react'
import { githubAIInsightsMockData, type WeeklySummaryData } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface WeeklyEngineeringSummaryProps {
  summary?: WeeklySummaryData
  className?: string
}

export const WeeklyEngineeringSummary: React.FC<WeeklyEngineeringSummaryProps> = ({
  summary = githubAIInsightsMockData.weeklySummary[0],
  className,
}) => {
  const safeSummary = summary ?? githubAIInsightsMockData.weeklySummary[0]
  const commits = safeSummary?.commits ?? 0
  const pullRequests = safeSummary?.pullRequests ?? 0
  const reviews = safeSummary?.reviews ?? 0
  const issuesClosed = safeSummary?.issuesClosed ?? 0
  const repositoriesWorked = safeSummary?.repositoriesWorked ?? 0
  const highlights = Array.isArray(safeSummary?.highlights) ? safeSummary.highlights : []

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 space-y-4 font-sans text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" />
            <h3 className="font-bold text-sm text-white m-0">Weekly Executive Summary</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Engineering output for this week</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          This Week
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-center text-xs font-sans">
        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 flex flex-col justify-between items-center min-w-0">
          <div className="text-[10px] text-slate-400 font-medium font-sans whitespace-nowrap">Commits</div>
          <div className="text-base sm:text-lg font-extrabold text-white mt-1 font-mono">{commits}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 flex flex-col justify-between items-center min-w-0">
          <div className="text-[10px] text-slate-400 font-medium font-sans whitespace-nowrap">PRs Merged</div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-400 mt-1 font-mono">{pullRequests}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 flex flex-col justify-between items-center min-w-0">
          <div className="text-[10px] text-slate-400 font-medium font-sans whitespace-nowrap">Reviews</div>
          <div className="text-base sm:text-lg font-extrabold text-purple-400 mt-1 font-mono">{reviews}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 flex flex-col justify-between items-center min-w-0">
          <div className="text-[10px] text-slate-400 font-medium font-sans whitespace-nowrap">Issues Closed</div>
          <div className="text-base sm:text-lg font-extrabold text-sky-400 mt-1 font-mono">{issuesClosed}</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 flex flex-col justify-between items-center min-w-0 col-span-2 sm:col-span-1">
          <div className="text-[10px] text-slate-400 font-medium font-sans whitespace-nowrap">Active Repos</div>
          <div className="text-base sm:text-lg font-extrabold text-amber-400 mt-1 font-mono">{repositoriesWorked}</div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="text-[11px] font-bold text-white">Key Engineering Highlights</div>
        <ul className="space-y-1.5 p-3 rounded-xl border border-slate-700/80 bg-slate-900/60 list-none m-0">
          {highlights.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default WeeklyEngineeringSummary
