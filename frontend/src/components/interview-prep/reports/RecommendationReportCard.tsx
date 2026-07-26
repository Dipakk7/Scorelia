import React from 'react'
import { Sparkles, Target, Award, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export function RecommendationReportCard() {
  const recommendations = [
    { title: 'Complete 3 System Design Drills', target: 'Focus on distributed HNSW vector indexing & sharding.', gain: '+4% Readiness' },
    { title: 'Practice SQL Window Functions', target: 'Work on execution plans, CTEs, and composite indexing.', gain: '+3% Readiness' },
    { title: 'Schedule Google AI/ML Mock #3', target: 'Full 60-minute technical round with real-time feedback.', gain: '+5% Readiness' },
  ]

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" /> Actionable Recommendations & Next Steps
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2 text-xs">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-3 rounded-xl bg-[#141627] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-purple-400" /> {rec.title}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {rec.gain}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">{rec.target}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
export default RecommendationReportCard
