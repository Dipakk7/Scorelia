import React from 'react'
import { Award, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { STARCoachData } from '@/types/interviewPrep'

export interface STARCoachCardProps {
  coach: STARCoachData
}

export function STARCoachCard({ coach }: STARCoachCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
          <Award className="h-4 w-4 text-purple-400" />
          <span>STAR Storytelling Coach</span>
        </div>

        <span className="text-xs font-black text-emerald-400 font-mono">
          {coach.starScorePercent}% Score
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-2 text-xs">
        <div className="space-y-1">
          {coach.checklist.map((chk, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-300 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{chk.item}</span>
            </div>
          ))}
        </div>

        <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 font-medium space-y-1">
          <span className="font-bold block">Coach Suggestion:</span>
          <span>{coach.suggestions[0]}</span>
        </div>
      </CardContent>
    </Card>
  )
}
export default STARCoachCard
