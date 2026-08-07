import React from 'react'
import { Play, Award, BookOpen, Video, Code, FileText, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { recommendedActionsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { RecommendedActionData } from '@/types/careerRoadmap'

export interface RecommendedActionsCardProps {
  actions?: RecommendedActionData[]
  onActionClick?: (actionId: string) => void
  className?: string
}

export function RecommendedActionsCard({
  actions = recommendedActionsMockData,
  onActionClick,
  className,
}: RecommendedActionsCardProps) {
  const renderActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'play':
        return <Play className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
      case 'award':
        return <Award className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
      case 'book':
        return <BookOpen className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
      case 'video':
        return <Video className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
      case 'code':
        return <Code className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
      case 'file':
      default:
        return <FileText className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
    }
  }

  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight m-0">
          Recommended Actions
        </h3>
        <span className="text-[10px] text-slate-400 font-medium">6 Quick Steps</span>
      </div>

      <div className="space-y-2">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => onActionClick?.(act.id)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-purple-500/40 hover:bg-white/5 transition-all text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[44px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                {renderActionIcon(act.iconName)}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white block truncate">
                  {act.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {act.category}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-purple-400 group-hover:text-purple-300 flex items-center gap-1 shrink-0 ml-2">
              <span>{act.actionText}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
export default RecommendedActionsCard
