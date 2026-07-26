import React from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle2, User, Sparkles, Clock, Calendar, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { AnswerDetailData } from '@/types/interviewPrep'

export interface AnswerDetailPanelProps {
  detail: AnswerDetailData | null
}

export function AnswerDetailPanel({ detail }: AnswerDetailPanelProps) {
  if (!detail) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-6 text-center text-slate-400 text-xs font-medium">
        Select an answer from the history list to view detailed user vs model comparison and AI feedback.
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
        {/* Header */}
        <CardHeader className="p-0 pb-3 flex flex-col space-y-2 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-bold px-2.5 py-0.5">
                {detail.statusBadge}
              </Badge>
              <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs font-bold">
                {detail.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                {detail.attemptDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                {detail.durationText}
              </span>
            </div>
          </div>

          <CardTitle className="text-base font-bold text-white leading-tight pt-1">
            {detail.questionTitle}
          </CardTitle>

          <span className="text-[11px] text-slate-400 font-medium block">
            Source: <span className="text-purple-300 font-semibold">{detail.interviewSource}</span>
          </span>
        </CardHeader>

        <CardContent className="p-0 space-y-4 text-xs">
          {/* Key Skills Tested */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" /> Key Skills Evaluated
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detail.keySkillsTested.map((skill, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Side-by-Side or Stacked Answer Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {/* User Submitted Answer */}
            <div className="bg-[#141627] border border-white/10 rounded-xl p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 pb-1 border-b border-white/5">
                  <User className="h-4 w-4 text-purple-400" />
                  Your Submitted Response
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium font-sans">
                  "{detail.userAnswerText}"
                </p>
              </div>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                Duration: {detail.durationText}
              </div>
            </div>

            {/* Model Expected Answer */}
            <div className="bg-[#141627] border border-emerald-500/20 rounded-xl p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pb-1 border-b border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Model Answer & Key Points
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium font-sans">
                  {detail.expectedAnswerText}
                </p>
              </div>
              <div className="pt-2 text-[10px] text-emerald-400 font-mono font-bold">
                Target Benchmark Coverage: 95%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default AnswerDetailPanel
