import React from 'react'
import { Sparkles, ArrowRight, Zap, Target, BookOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { RecommendationInsightData } from '@/types/interviewPrep'

export interface RecommendationInsightsCardProps {
  insights: RecommendationInsightData
}

export function RecommendationInsightsCard({ insights }: RecommendationInsightsCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Actionable AI Coaching Insights
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Personalized recommendations based on skill gap analysis
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3.5 text-xs">
        {/* Weekly Focus Banner */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            {insights.weeklyFocusText}
          </span>
          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
            {insights.estimatedReadinessGainText}
          </Badge>
        </div>

        {/* Suggested Skills & Round */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Key Skills to Focus On
            </span>
            <div className="flex flex-wrap gap-1.5">
              {insights.recommendedSkills.map((sk, i) => (
                <Badge key={i} className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-[10px] font-semibold py-0.5 px-2">
                  {sk}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-purple-400" /> Next Suggested Round
            </span>
            <h4 className="text-sm font-bold text-white leading-tight">
              {insights.suggestedInterviewType}
            </h4>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 shadow-md shadow-purple-900/30">
            <span>Launch Recommended Practice</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default RecommendationInsightsCard
