import React from 'react'
import { FileText, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { ResumeContextData } from '@/types/interviewPrep'

export interface ResumeContextCardProps {
  resume: ResumeContextData
}

export function ResumeContextCard({ resume }: ResumeContextCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-purple-400" /> Active Resume Context
          </span>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2 text-xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-white block truncate">{resume.fileName}</span>
          <span className="text-[10px] text-slate-400 font-medium">Target: {resume.roleTarget} ({resume.experienceYears} Yrs Exp)</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Detected Skills</span>
          <div className="flex flex-wrap gap-1">
            {resume.skillsDetected.map((sk, i) => (
              <Badge key={i} className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-[9px] font-semibold py-0.5 px-1.5">
                {sk}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default ResumeContextCard
