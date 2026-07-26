import React from 'react'
import { Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { JobContextData } from '@/types/interviewPrep'

export interface JobContextCardProps {
  job: JobContextData
}

export function JobContextCard({ job }: JobContextCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-purple-400" /> Target Job Context
          </span>
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[9px] font-bold">
            {job.difficultyLevel}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2 text-xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-white block truncate">{job.roleTitle}</span>
          <span className="text-[10px] text-purple-300 font-semibold">{job.targetCompany} • {job.interviewType}</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Required Skills</span>
          <div className="flex flex-wrap gap-1">
            {job.requiredSkills.map((sk, i) => (
              <Badge key={i} className="bg-white/5 text-slate-300 border-white/10 text-[9px] font-semibold py-0.5 px-1.5">
                {sk}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default JobContextCard
