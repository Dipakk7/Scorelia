import React from 'react'
import { Edit3, Award, TrendingUp, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { AnswerSummaryData } from '@/types/interviewPrep'

export interface AnswerSummaryCardProps {
  summary: AnswerSummaryData
}

export function AnswerSummaryCard({ summary }: AnswerSummaryCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Answer Analytics & Overall Performance
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Aggregated scores across all completed practice rounds
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Answers */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <Edit3 className="h-3 w-3 text-purple-400" /> Total Answers
            </span>
            <span className="text-xl font-black text-white font-mono block">
              {summary.totalAnswers}
            </span>
          </div>

          {/* Average Score */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <Award className="h-3 w-3 text-emerald-400" /> Avg Score
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono block">
              {summary.avgScorePercent}%
            </span>
          </div>

          {/* Needs Improvement */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" /> Focus Needed
            </span>
            <span className="text-xl font-black text-amber-300 font-mono block">
              {summary.needsImprovementCount} Answers
            </span>
          </div>

          {/* Feedback Generated */}
          <div className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-cyan-400" /> AI Evaluations
            </span>
            <span className="text-xl font-black text-white font-mono block">
              {summary.feedbackGeneratedCount} Reports
            </span>
          </div>
        </div>

        {/* Best Answer & Trend Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs">
          <div className="truncate">
            <span className="text-slate-400 font-medium">Highest Scoring Answer: </span>
            <span className="font-bold text-purple-300 truncate">{summary.bestAnswerTitle}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{summary.improvementTrend}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default AnswerSummaryCard
