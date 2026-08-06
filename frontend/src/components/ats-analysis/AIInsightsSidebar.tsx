import React from 'react'
import {
  Sparkles,
  Award,
  TrendingUp,
  Lightbulb,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { mockAiSidebarData } from '@/lib/ats-ai-mock-data'

export const AIInsightsSidebar: React.FC = () => {
  return (
    <aside aria-label="AI Insights Sidebar" className="space-y-4">
      {/* 1. AI Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">AI Health Summary</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-sm shrink-0">
            {mockAiSidebarData.aiSummary.healthScore}%
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex justify-between items-center shadow-inner">
            <span className="text-slate-400 font-sans text-xs">Status Tag</span>
            <span className="text-emerald-400 font-bold font-sans text-xs">
              {mockAiSidebarData.aiSummary.readinessTag}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex justify-between items-center gap-2 shadow-inner">
            <span className="text-slate-400 font-sans text-xs shrink-0">Top Strength</span>
            <span className="text-purple-300 font-bold font-sans text-xs truncate text-right" title={mockAiSidebarData.aiSummary.topStrength}>
              {mockAiSidebarData.aiSummary.topStrength}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex justify-between items-center gap-2 shadow-inner">
            <span className="text-slate-400 font-sans text-xs shrink-0">Focus Area</span>
            <span className="text-amber-400 font-bold font-sans text-xs truncate text-right" title={mockAiSidebarData.aiSummary.keyFocusArea}>
              {mockAiSidebarData.aiSummary.keyFocusArea}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Tips Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 tracking-tight">
            Quick AI Insights & Tips
          </h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300/90">
          {mockAiSidebarData.quickTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 leading-relaxed shadow-sm flex items-start gap-2"
            >
              <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Recommendations Applied */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm shrink-0 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">
              Applied Fixes
            </h3>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">Activity</span>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          {mockAiSidebarData.recentRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2.5 shadow-sm"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="font-sans font-bold text-slate-200 text-xs truncate">{rec.title}</div>
                <div className="text-[10px] text-emerald-400 font-bold font-mono">{rec.status}</div>
              </div>
              <span className="text-xs font-bold font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 shrink-0">
                {rec.gain}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
