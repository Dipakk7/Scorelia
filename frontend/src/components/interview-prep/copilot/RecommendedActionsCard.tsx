import React from 'react'
import { Sparkles, Play, Video, BookOpen, Award, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface RecommendedActionsCardProps {
  onActionSelect?: (action: string) => void
}

export function RecommendedActionsCard({ onActionSelect }: RecommendedActionsCardProps) {
  const actions = [
    { id: 'mock', label: 'Start Mock Round', icon: Video },
    { id: 'qbank', label: 'Open Question Bank', icon: BookOpen },
    { id: 'star', label: 'Practice STAR Story', icon: Award },
    { id: 'drill', label: 'Continue Practice', icon: Play },
  ]

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 border-b border-white/10 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-purple-400" /> Recommended Copilot Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map((act) => {
          const Icon = act.icon

          return (
            <Button
              key={act.id}
              variant="outline"
              onClick={() => onActionSelect && onActionSelect(act.id)}
              className="p-2.5 h-auto text-xs font-semibold text-slate-300 border-white/10 bg-[#141627] hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-1 text-left"
            >
              <div className="flex items-center gap-2 truncate">
                <Icon className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{act.label}</span>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
export default RecommendedActionsCard
