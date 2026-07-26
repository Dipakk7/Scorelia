import React from 'react'
import { Lightbulb, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export function InterviewTipsCard() {
  const tips = [
    'Technical: Always think out loud before writing code or proposing architectures.',
    'Behavioral: Structure stories tightly using Situation, Task, Action, Result.',
    'Pacing: Allocate 5 min for problem setup, 25 min coding, 10 min testing.',
    'Communication: Confirm assumptions explicitly before jumping into details.',
  ]

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4 text-amber-400" /> Interview Pro Tips
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2 text-xs">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-slate-300 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed text-[11px]">{tip}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
export default InterviewTipsCard
