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
    <aside aria-label="AI Insights Sidebar" className="space-y-5">
      {/* 1. AI Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-purple-950/90 to-slate-950/95 border border-purple-500/30 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">AI Health Summary</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {mockAiSidebarData.aiSummary.healthScore}%
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex justify-between">
            <span className="text-slate-400 font-sans">Status Tag</span>
            <span className="text-emerald-400 font-bold font-sans">
              {mockAiSidebarData.aiSummary.readinessTag}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex justify-between">
            <span className="text-slate-400 font-sans">Top Strength</span>
            <span className="text-purple-300 font-sans truncate max-w-[130px]" title={mockAiSidebarData.aiSummary.topStrength}>
              {mockAiSidebarData.aiSummary.topStrength}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex justify-between">
            <span className="text-slate-400 font-sans">Focus Area</span>
            <span className="text-amber-400 font-sans truncate max-w-[130px]" title={mockAiSidebarData.aiSummary.keyFocusArea}>
              {mockAiSidebarData.aiSummary.keyFocusArea}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Tips Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          Quick AI Insights & Tips
        </h3>

        <div className="space-y-2 text-xs text-slate-300">
          {mockAiSidebarData.quickTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 leading-relaxed"
            >
              • {tip}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Recommendations Applied */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Applied Fixes
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">Activity</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {mockAiSidebarData.recentRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="font-sans font-semibold text-slate-200">{rec.title}</div>
                <div className="text-[10px] text-emerald-400">{rec.status}</div>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {rec.gain}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
