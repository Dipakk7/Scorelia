import React from 'react'
import { Award, Trophy } from 'lucide-react'
import { githubAIInsightsMockData, type AchievementItemData } from '@/data/githubAIInsightsMockData'
import { AchievementBadge } from './AchievementBadge'
import { cn } from '@/lib/utils'

export interface AchievementTimelineProps {
  achievements?: AchievementItemData[]
  className?: string
}

export const AchievementTimeline: React.FC<AchievementTimelineProps> = ({
  achievements = githubAIInsightsMockData.achievements,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 space-y-4 font-sans text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            <h3 className="font-bold text-sm text-white m-0">Engineering Badges & Milestones</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Unlocked achievements & contribution streaks</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {(achievements ?? []).length} Unlocked
        </span>
      </div>

      <div className="space-y-3">
        {(achievements ?? []).map((item) => (
          <AchievementBadge key={item.id} achievement={item} />
        ))}
      </div>
    </div>
  )
}

export default AchievementTimeline
