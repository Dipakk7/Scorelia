import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, TrendingUp, Award } from 'lucide-react'
import { mockAiOverviewBanner, type AIOverviewBannerData } from '@/lib/ats-ai-mock-data'

interface AIOverviewBannerProps {
  data?: AIOverviewBannerData
  onOptimizeClick?: () => void
}

export const AIOverviewBanner: React.FC<AIOverviewBannerProps> = ({
  data = mockAiOverviewBanner,
  onOptimizeClick,
}) => {
  const safeData = data || mockAiOverviewBanner
  const readinessScore = safeData?.readinessScore ?? 92
  const readinessLevel = safeData?.readinessLevel ?? '92% - Production Ready'
  const recruiterImpression = safeData?.recruiterImpression ?? 'Highly Favorable (9.2 / 10)'
  const recruiterScore = safeData?.recruiterScore ?? 94
  const passProbability = safeData?.passProbability ?? '95% ATS Pass Probability'
  const passScore = safeData?.passScore ?? 95
  const summary = safeData?.summary ?? mockAiOverviewBanner.summary

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-500/40 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">AI Readiness & Insight Overview</h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  AI Verified
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Real-time AI evaluation of ATS compatibility and recruiter impression.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOptimizeClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimize ATS Score Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Key AI Performance Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: ATS Readiness Level */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ATS Readiness Level
              </span>
              <span className="font-mono text-emerald-400 font-bold">{readinessScore}%</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{readinessLevel}</div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          {/* Card 2: Recruiter Impression */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-400" />
                Recruiter Impression
              </span>
              <span className="font-mono text-purple-300 font-bold">9.4 / 10</span>
            </div>
            <div className="text-base font-bold text-white tracking-tight">{recruiterImpression}</div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                style={{ width: `${recruiterScore}%` }}
              />
            </div>
          </div>

          {/* Card 3: ATS Pass Probability */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Pass Probability
              </span>
              <span className="font-mono text-cyan-400 font-bold">{passScore}%</span>
            </div>
            <div className="text-base font-bold text-white tracking-tight">{passProbability}</div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                style={{ width: `${passScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-[var(--heading)] leading-relaxed flex items-start gap-2.5">
          <Award className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
          <span>{summary}</span>
        </div>
      </div>
    </div>
  )
}
