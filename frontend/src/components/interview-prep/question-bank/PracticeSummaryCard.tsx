import React from 'react'
import { BookOpen, CheckCircle2, Bookmark, Award, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { PracticeSummaryData } from '@/types/interviewPrep'

export interface PracticeSummaryCardProps {
  summary: PracticeSummaryData
}

export function PracticeSummaryCard({ summary }: PracticeSummaryCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white">
              Practice Progress Summary
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Track your question completion and performance
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Available */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-purple-400" /> Available
            </span>
            <span className="text-xl font-black text-white font-mono block">
              {summary.totalAvailable.toLocaleString()}
            </span>
          </div>

          {/* Completed */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Completed
            </span>
            <span className="text-xl font-black text-white font-mono block">
              {summary.totalCompleted}
            </span>
          </div>

          {/* Bookmarked */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <Bookmark className="h-3 w-3 text-amber-400" /> Bookmarked
            </span>
            <span className="text-xl font-black text-white font-mono block">
              {summary.totalBookmarked}
            </span>
          </div>

          {/* Avg Practice Score */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <Award className="h-3 w-3 text-cyan-400" /> Avg Score
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono block">
              {summary.avgPracticeScore}%
            </span>
          </div>
        </div>

        {/* Recommended Next Topic Banner */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">Recommended Next Topic:</span>
          <span className="font-bold text-purple-300">{summary.recommendedNextTopic}</span>
        </div>
      </CardContent>
    </Card>
  )
}
export default PracticeSummaryCard
