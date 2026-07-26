import React from 'react'
import { FileText, Briefcase, Building2, Clock, ShieldCheck, HelpCircle, Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { MockInterviewSetupConfig, ResumeOption } from '@/types/interviewPrep'

export interface InterviewSummaryCardProps {
  config: MockInterviewSetupConfig
  resumes: ResumeOption[]
}

export function InterviewSummaryCard({ config, resumes }: InterviewSummaryCardProps) {
  const selectedResume = resumes.find((r) => r.id === config.resumeId) || resumes[0]

  const estimatedQuestionsMap: Record<number, number> = {
    15: 5,
    30: 8,
    45: 12,
    60: 16,
  }

  const estimatedQuestions = estimatedQuestionsMap[config.durationMinutes] || 12

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white">
              Round Configuration Summary
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Live preview of your mock session setup
            </p>
          </div>
        </div>
        <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] font-bold px-2 py-0.5">
          Ready
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* Detail Items */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-purple-400" />
              Target Resume
            </span>
            <span className="font-bold text-white truncate max-w-[180px]">
              {selectedResume?.fileName || 'Resume.pdf'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-purple-400" />
              Job Role
            </span>
            <span className="font-bold text-white">{config.targetRole || 'Not specified'}</span>
          </div>

          {config.companyName && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                Company Target
              </span>
              <span className="font-bold text-white">{config.companyName}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Difficulty Level
            </span>
            <span className="font-bold text-amber-300 capitalize">{config.difficulty}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-purple-400" />
              Session Duration
            </span>
            <span className="font-bold text-white">{config.durationMinutes} Minutes</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141627] border border-white/5">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
              Est. Questions
            </span>
            <span className="font-bold text-white font-mono">{estimatedQuestions} Questions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default InterviewSummaryCard
