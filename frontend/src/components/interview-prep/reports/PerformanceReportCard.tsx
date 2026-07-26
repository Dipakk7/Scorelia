import React from 'react'
import { TrendingUp, Award, Calendar, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function PerformanceReportCard() {
  const growthMilestones = [
    { period: 'Week 1 - 2', scoreGain: '68% → 74%', highlight: 'Established baseline STAR structure in behavioral mock rounds.' },
    { period: 'Week 3 - 4', scoreGain: '79% → 84%', highlight: 'Improved Python algorithm time complexity and SQL query indexing.' },
    { period: 'Week 5 Current', scoreGain: '87% Index', highlight: 'Top candidate tier for FAANG AI/ML Engineer interviews.' },
  ]

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" /> Longitudinal Performance & Growth Trajectory
        </CardTitle>
        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
          +14% Growth Gain
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {growthMilestones.map((ms, i) => (
          <div key={i} className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-400" /> {ms.period}
              </span>
              <span className="font-bold text-emerald-400 font-mono">{ms.scoreGain}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              {ms.highlight}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
export default PerformanceReportCard
