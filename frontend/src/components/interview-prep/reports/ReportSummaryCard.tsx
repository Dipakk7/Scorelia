import React from 'react'
import { Award, Video, BookOpen, Target, Clock, Zap, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { InterviewReportSummary } from '@/types/interviewPrep'

export interface ReportSummaryCardProps {
  summary: InterviewReportSummary
}

export function ReportSummaryCard({ summary }: ReportSummaryCardProps) {
  const stats = [
    { label: 'Overall Readiness Index', value: `${summary.overallReadinessScore}/100`, icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Mock Rounds Completed', value: summary.interviewCount, icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Questions Practiced', value: summary.questionCount, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Average Accuracy', value: `${summary.avgAccuracyPercent}%`, icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Practice Time', value: `${summary.totalPracticeTimeHours} Hrs`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-400" /> Executive Diagnostic Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map((st, i) => {
            const Icon = st.icon
            return (
              <div key={i} className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 truncate">{st.label}</span>
                  <div className={`p-1 rounded-lg ${st.bg} ${st.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="text-base font-extrabold text-white font-mono block">{st.value}</span>
              </div>
            )
          })}
        </div>

        {/* Skill Highs & Lows Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Strongest Skill Area</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              {summary.strongestSkill}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Primary Focus Area</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              {summary.weakestSkill}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default ReportSummaryCard
