import React from 'react'
import { Code2, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { CodingAssistantData } from '@/types/interviewPrep'

export interface CodingAssistantCardProps {
  assistant: CodingAssistantData
}

export function CodingAssistantCard({ assistant }: CodingAssistantCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
          <Code2 className="h-4 w-4 text-purple-400" />
          <span>Coding & Algo Assistant</span>
        </div>

        <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[9px] font-bold">
          {assistant.language}
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#141627] border border-white/5 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" /> Complexity Target
          </span>
          <span className="text-[11px] font-bold text-emerald-400 block">{assistant.timeComplexityTip}</span>
          <span className="text-[10px] text-slate-400 font-medium block">{assistant.spaceComplexityTip}</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Best Practices</span>
          <ul className="space-y-1 pl-3.5 list-disc text-slate-300 font-medium text-[11px]">
            {assistant.bestPractices.map((bp, i) => (
              <li key={i}>{bp}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
export default CodingAssistantCard
