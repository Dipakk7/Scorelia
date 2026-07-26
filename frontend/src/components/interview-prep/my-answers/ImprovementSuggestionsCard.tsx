import React from 'react'
import { Sparkles, ArrowRight, BookOpen, Video, Clock, Target } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { ImprovementSuggestionData } from '@/types/interviewPrep'

export interface ImprovementSuggestionsCardProps {
  suggestions: ImprovementSuggestionData
}

export function ImprovementSuggestionsCard({ suggestions }: ImprovementSuggestionsCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Personalized Coaching & Next Steps
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              AI recommendations to level up your interview performance
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3.5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Recommended Practice Topic */}
          <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Focus Practice Topic
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {suggestions.recommendedPracticeTopic}
              </h4>
              <div className="flex flex-wrap gap-1 pt-1">
                {suggestions.suggestedTopics.map((top, i) => (
                  <Badge key={i} className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-[10px] font-semibold py-0.5 px-2">
                    {top}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Round & Question Set */}
          <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Video className="h-3.5 w-3.5 text-purple-400" /> Next Mock Round
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {suggestions.recommendedInterviewRound}
              </h4>
              <p className="text-xs text-slate-400 font-medium pt-0.5">
                Target Set: <span className="text-purple-300 font-semibold">{suggestions.recommendedQuestionSet}</span>
              </p>
            </div>
          </div>

          {/* Target Goal & Time */}
          <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-emerald-400" /> Target Benchmark Goal
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {suggestions.nextGoalText}
              </h4>
              <div className="flex items-center gap-1.5 text-slate-400 font-medium pt-0.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>{suggestions.estimatedImprovementTimeText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 flex justify-end">
          <Button className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 shadow-md shadow-purple-900/30">
            <span>Start Practice Drill</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default ImprovementSuggestionsCard
